import { fetchFromAllSports } from '../lib/fetchFromAllSports.js';
import { successResponse, errorResponse } from '../lib/responseWrapper.js';
import { checkRateLimit } from '../lib/rateLimit.js';

export default async function handler(req, res) {
  const clientIp = req.headers['x-forwarded-for'] || 'unknown';
  
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json(errorResponse('Rate limit exceeded', 429));
  }
  
  try {
    const { leagueId } = req.query;
    
    if (!leagueId) {
      return res.status(400).json(errorResponse('leagueId is required', 400));
    }
    
    const data = await fetchFromAllSports('Topscorers', { leagueId });
    
    return res.status(200).json(successResponse(data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
}
