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
    const { type, matchId } = req.query;
    
    if (!type) {
      return res.status(400).json(errorResponse('type parameter is required (live, full, probabilities)', 400));
    }
    
    const validTypes = ['live', 'full', 'probabilities'];
    if (!validTypes.includes(type)) {
      return res.status(400).json(errorResponse(`Invalid type. Must be one of: ${validTypes.join(', ')}`, 400));
    }
    
    if ((type === 'full' || type === 'probabilities') && !matchId) {
      return res.status(400).json(errorResponse(`matchId is required for ${type} odds`, 400));
    }
    
    const cacheKey = getCacheKey('odds', req.query);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.status(200).json(successResponse(cached));
    }
    
    let met;
    let params = {};
    
    switch (type) {
      case 'live':
        met = 'OddsLive';
        break;
      case 'full':
        met = 'FullOdds';
        params.matchId = matchId;
        break;
      case 'probabilities':
        met = 'Probabilities';
        params.matchId = matchId;
        break;
    }
    
    const data = await fetchFromAllSports(met, params);
    
    setCache(cacheKey, data, 'odds');
    
    return res.status(200).json(successResponse(data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
