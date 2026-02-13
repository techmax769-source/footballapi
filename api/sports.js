import { fetchFromAllSports } from '../lib/fetchFromAllSports.js';
import { successResponse, errorResponse } from '../lib/responseWrapper.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { getFromCache, setCache, getCacheKey } from '../lib/cache.js';
import { paginate } from '../lib/pagination.js';

export default async function handler(req, res) {
  const clientIp = req.headers['x-forwarded-for'] || 'unknown';
  
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json(errorResponse('Rate limit exceeded', 429));
  }
  
  try {
    const { endpoint, page = 1, limit = 20, ...params } = req.query;
    
    if (!endpoint) {
      return res.status(400).json(errorResponse('endpoint parameter is required', 400));
    }
    
    const validEndpoints = [
      'fixtures', 'standings', 'leagues', 'countries', 
      'teams', 'players', 'h2h', 'topscorers', 'videos'
    ];
    
    if (!validEndpoints.includes(endpoint)) {
      return res.status(400).json(errorResponse(`Invalid endpoint. Must be one of: ${validEndpoints.join(', ')}`, 400));
    }
    
    const cacheKey = getCacheKey(endpoint, req.query);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.status(200).json(successResponse(cached));
    }
    
    let data;
    let requiresPagination = false;
    
    switch (endpoint) {
      case 'fixtures':
        requiresPagination = true;
        data = await fetchFromAllSports('Fixtures', {
          from: params.from,
          to: params.to,
          leagueId: params.leagueId,
          teamId: params.teamId,
          timezone: params.timezone,
          withPlayerStats: params.withPlayerStats === 'true' ? 'true' : undefined
        });
        break;
        
      case 'standings':
        if (!params.leagueId) {
          return res.status(400).json(errorResponse('leagueId is required for standings', 400));
        }
        data = await fetchFromAllSports('Standings', { leagueId: params.leagueId });
        break;
        
      case 'leagues':
        data = await fetchFromAllSports('Leagues', params.countryId ? { countryId: params.countryId } : {});
        break;
        
      case 'countries':
        data = await fetchFromAllSports('Countries');
        break;
        
      case 'teams':
        if (!params.leagueId && !params.teamId) {
          return res.status(400).json(errorResponse('Either leagueId or teamId is required for teams', 400));
        }
        data = await fetchFromAllSports('Teams', {
          leagueId: params.leagueId,
          teamId: params.teamId
        });
        break;
        
      case 'players':
        if (!params.playerId && !params.playerName) {
          return res.status(400).json(errorResponse('Either playerId or playerName is required for players', 400));
        }
        data = await fetchFromAllSports('Players', {
          playerId: params.playerId,
          playerName: params.playerName
        });
        break;
        
      case 'h2h':
        if (!params.firstTeamId || !params.secondTeamId) {
          return res.status(400).json(errorResponse('Both firstTeamId and secondTeamId are required for h2h', 400));
        }
        data = await fetchFromAllSports('H2H', {
          firstTeamId: params.firstTeamId,
          secondTeamId: params.secondTeamId
        });
        break;
        
      case 'topscorers':
        if (!params.leagueId) {
          return res.status(400).json(errorResponse('leagueId is required for topscorers', 400));
        }
        data = await fetchFromAllSports('Topscorers', { leagueId: params.leagueId });
        break;
        
      case 'videos':
        if (!params.eventId) {
          return res.status(400).json(errorResponse('eventId is required for videos', 400));
        }
        data = await fetchFromAllSports('Videos', { eventId: params.eventId });
        break;
    }
    
    let responseData = data;
    
    if (requiresPagination && data.result) {
      const paginated = paginate(data.result, page, limit);
      responseData = {
        ...data,
        result: paginated.results,
        pagination: paginated.pagination
      };
    }
    
    setCache(cacheKey, responseData, endpoint);
    
    return res.status(200).json(successResponse(responseData));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
