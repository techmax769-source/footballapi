import { randomUUID } from 'crypto';

const CREATOR = process.env.API_CREATOR || "Max";
const API_NAME = process.env.API_NAME || "Max Sports API";
const API_VERSION = process.env.API_VERSION || "1.0.0";

export function successResponse(data, metadata = {}) {
  return {
    creator: CREATOR,
    api_name: API_NAME,
    api_version: API_VERSION,
    success: true,
    timestamp: new Date().toISOString(),
    request_id: randomUUID(),
    ...metadata,
    data
  };
}

export function errorResponse(message, statusCode = 500) {
  return {
    creator: CREATOR,
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    request_id: randomUUID()
  };
}
