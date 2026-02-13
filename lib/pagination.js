export function paginate(array, page = 1, limit = 20) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  
  const results = array.slice(start, end);
  const total = array.length;
  const total_pages = Math.ceil(total / limitNum);
  
  return {
    results,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      total_pages
    }
  };
}
