import { successResponse } from '../lib/responseWrapper.js';

export default async function handler(req, res) {
  return res.status(200).json(successResponse({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage()
  }));
}
