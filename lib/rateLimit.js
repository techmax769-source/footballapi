const rateLimitStore = new Map();

const WINDOW_MS = (parseInt(process.env.RATE_LIMIT_WINDOW) || 60) * 1000;
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_REQUESTS) || 100;

export function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip).filter(timestamp => timestamp > windowStart);
  
  if (requests.length >= MAX_REQUESTS) {
    return false;
  }
  
  requests.push(now);
  rateLimitStore.set(ip, requests);
  return true;
}

setInterval(() => {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  
  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const filtered = timestamps.filter(t => t > windowStart);
    if (filtered.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, filtered);
    }
  }
}, WINDOW_MS);
