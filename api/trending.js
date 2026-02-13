import { successResponse, errorResponse } from '../lib/responseWrapper.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { getTopSearches } from '../lib/trendingStore.js';

export default async function handler(req, res) {
  const clientIp = req.headers['x-forwarded-for'] || 'unknown';
  
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json(errorResponse('Rate limit exceeded', 429));
  }
  
  try {
    const topSearches = getTopSearches(10);
    
    return res.status(200).json(successResponse({
      top_searches: topSearches
    }));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
