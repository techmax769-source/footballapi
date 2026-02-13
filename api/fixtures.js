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
    const { from, to, leagueId, teamId, timezone, withPlayerStats, page = 1, limit = 20 } = req.query;
    
    const cacheKey = getCacheKey('fixtures', req.query);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.status(200).json(successResponse(cached));
    }
    
    const params = {
      ...(from && { from }),
      ...(to && { to }),
      ...(leagueId && { leagueId }),
      ...(teamId && { teamId }),
      ...(timezone && { timezone }),
      ...(withPlayerStats && { withPlayerStats: 'true' })
    };
    
    const data = await fetchFromAllSports('Fixtures', params);
    
    const paginated = paginate(data.result || [], page, limit);
    
    const response = {
      ...data,
      result: paginated.results,
      pagination: paginated.pagination
    };
    
    setCache(cacheKey, response, 'fixtures');
    
    return res.status(200).json(successResponse(response));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
