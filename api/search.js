import { fetchFromAllSports } from '../lib/fetchFromAllSports.js';
import { successResponse, errorResponse } from '../lib/responseWrapper.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { getFromCache, setCache, getCacheKey } from '../lib/cache.js';
import { paginate } from '../lib/pagination.js';
import { rankSearchResults } from '../lib/ranking.js';
import { trackSearch } from '../lib/trendingStore.js';

export default async function handler(req, res) {
  const clientIp = req.headers['x-forwarded-for'] || 'unknown';
  
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json(errorResponse('Rate limit exceeded', 429));
  }
  
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json(errorResponse('Search query is required', 400));
    }
    
    trackSearch(q);
    
    const cacheKey = getCacheKey('search', req.query);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.status(200).json(successResponse(cached));
    }
    
    const actualLimit = Math.min(parseInt(limit), 20);
    
    const [playersRes, teamsRes] = await Promise.allSettled([
      fetchFromAllSports('Players', { playerName: q }),
      fetchFromAllSports('Teams', { teamName: q })
    ]);
    
    let players = playersRes.status === 'fulfilled' ? playersRes.value?.result || [] : [];
    let teams = teamsRes.status === 'fulfilled' ? teamsRes.value?.result || [] : [];
    
    const rankedPlayers = rankSearchResults(q, players, 'players');
    const rankedTeams = rankSearchResults(q, teams, 'teams');
    
    const allResults = {
      players: rankedPlayers,
      teams: rankedTeams
    };
    
    const paginatedPlayers = paginate(allResults.players, page, actualLimit);
    const paginatedTeams = paginate(allResults.teams, page, actualLimit);
    
    const response = {
      query: q,
      results: {
        players: paginatedPlayers.results,
        teams: paginatedTeams.results
      },
      pagination: {
        players: paginatedPlayers.pagination,
        teams: paginatedTeams.pagination
      }
    };
    
    setCache(cacheKey, response, 'search');
    
    return res.status(200).json(successResponse(response));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
