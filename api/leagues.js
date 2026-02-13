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
    const { countryId } = req.query;
    
    const cacheKey = getCacheKey('leagues', req.query);
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.status(200).json(successResponse(cached));
    }
    
    const params = countryId ? { countryId } : {};
    const data = await fetchFromAllSports('Leagues', params);
    
    setCache(cacheKey, data, 'leagues');
    
    return res.status(200).json(successResponse(data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
