const trendingStore = new Map();

export function trackSearch(query) {
  if (!query) return;
  
  const normalized = query.toLowerCase().trim();
  const current = trendingStore.get(normalized) || 0;
  trendingStore.set(normalized, current + 1);
}

export function getTopSearches(limit = 10) {
  return Array.from(trendingStore.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Reset every 24 hours
setInterval(() => {
  trendingStore.clear();
}, 24 * 60 * 60 * 1000);
