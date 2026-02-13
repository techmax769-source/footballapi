export async function fetchFromAllSports(met, params = {}) {
  const baseUrl = 'https://apiv2.allsportsapi.com/football/';
  const apiKey = process.env.ALLSPORTS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ALLSPORTS_API_KEY is not configured');
  }
  
  const queryParams = new URLSearchParams({
    APIkey: apiKey,
    met,
    ...params
  });
  
  const url = `${baseUrl}?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch from AllSportsAPI: ${error.message}`);
  }
}
