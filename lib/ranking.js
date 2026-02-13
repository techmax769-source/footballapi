export function rankSearchResults(query, items, type) {
  const normalizedQuery = query.toLowerCase().trim();
  
  return items
    .map(item => {
      const name = item[type === 'players' ? 'player_name' : 'team_name']?.toLowerCase() || '';
      let score = 0;
      
      if (name === normalizedQuery) {
        score = 3;
      } else if (name.startsWith(normalizedQuery)) {
        score = 2;
      } else if (name.includes(normalizedQuery)) {
        score = 1;
      }
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}
