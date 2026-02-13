import { fetchFromAllSports } from '../lib/fetchFromAllSports.js';
import { successResponse, errorResponse } from '../lib/responseWrapper.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { getFromCache, setCache, getCacheKey } from '../lib/cache.js';

export default async function handler(req, res) {
  const clientIp = req.headers['x-forwarded-for'] || 'unknown';
  
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json(errorResponse('Rate limit exceeded', 429));
  }
  
  try {
    const { matchId } = req.query;
    
    if (!matchId) {
      return res.status(400).json(errorResponse('matchId is required', 400));
    }
    
    const cacheKey = getCacheKey('odds-full', req.query);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.status(200).json(successResponse(cached));
    }
    
    const data = await fetchFromAllSports('FullOdds', { matchId });
    
    setCache(cacheKey, data, 'odds');
    
    return res.status(200).json(successResponse(data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
