// Using Twelve Data API (free tier available)
async function getStockData(symbols, startDate, endDate) {
  const API_KEY = 'd83afdfe28574dc680283f93108daed0'; // Get from https://twelvedata.com/
  const results = [];

  for (const symbol of symbols) {
    try {
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      results.push({
        symbol,
        prices: data.values?.map(v => parseFloat(v.close)) || []
      });
    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error);
      results.push({ symbol, prices: [], error: error.message });
    }
  }

  return results;
}




export default getStockData