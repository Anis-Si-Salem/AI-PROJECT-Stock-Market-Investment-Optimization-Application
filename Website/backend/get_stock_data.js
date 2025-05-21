async function getStockData(symbols, startDate, endDate, priceType = 'close') {
  const API_KEY = 'QIHRCGEMWG245J48'; 
  const results = [];
  const RATE_LIMIT_DELAY = 1000; 

  for (const [index, symbol] of symbols.entries()) {
    try {
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }

      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Unknown API error');
      }

      results.push({
        symbol,
        dates: data.values?.map(v => v.datetime) || [],
        prices: data.values?.map(v => parseFloat(v[priceType])) || [],
        meta: {
          currency: data.meta?.currency,
          exchange: data.meta?.exchange
        }
      });

      console.log(`Successfully fetched ${symbol}`);

    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error.message);
      results.push({ 
        symbol,
        error: error.message,
        prices: [] 
      });
    }
  }

  return results;
}


export default getStockData;