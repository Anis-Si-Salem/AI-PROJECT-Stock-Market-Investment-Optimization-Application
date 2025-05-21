// async function getStockData(symbols, startDate, endDate, priceType = 'close') {
//   const API_KEY = 'QIHRCGEMWG245J48'; 
//   const results = [];
//   const RATE_LIMIT_DELAY = 1000; 

//   for (const [index, symbol] of symbols.entries()) {
//     try {
//       if (index > 0) {
//         await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
//       }

//       const response = await fetch(
//         `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${startDate}&end_date=${endDate}&apikey=${API_KEY}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.status === 'error') {
//         throw new Error(data.message || 'Unknown API error');
//       }

//       results.push({
//         symbol,
//         dates: data.values?.map(v => v.datetime) || [],
//         prices: data.values?.map(v => parseFloat(v[priceType])) || [],
//         meta: {
//           currency: data.meta?.currency,
//           exchange: data.meta?.exchange
//         }
//       });

//       console.log(`Successfully fetched ${symbol}`);

//     } catch (error) {
//       console.error(`Failed to fetch ${symbol}:`, error.message);
//       results.push({ 
//         symbol,
//         error: error.message,
//         prices: [] 
//       });
//     }
//   }
//   let res = []
//   for(key  in  results.keys()){
//     print(key)
//   }
//   return results;
// }
let keys = ["B0hlc3zkcN7TBue3xvP2De4Mo2WWLMPb" ,'AQL4o3oEgagVYDu17riKCmlM7ZpWYiOS']
async function fetchStockHistory(startDate, endDate, symbols) {
  const API_KEY = keys[0] ; 
  const results = {};

  for (const symbol of symbols) {
    try {
      console.log(`Fetching ${symbol}...`);    
      
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${startDate}&to=${endDate}&apikey=${API_KEY}`
      );
      
      const data = await response.json();

      if (data['Error Message']) {
        console.error(`Error for ${symbol}:`, data['Error Message']);
        results[symbol] = { error: data['Error Message'] };
        continue;
      }

      if (!data.historical || data.historical.length === 0) {
        console.log(`No data found for ${symbol} in date range`);
        results[symbol] = [];
        continue;
      }


      results[symbol] = data.historical
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(day => day.close);

    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error.message);
      results[symbol] = { error: error.message };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Final Results:', results);
  return results;
}

let getStockData = async (symbols, startDate, endDate) => {
  try {
    // Assume fetchStockHistory returns data in the format above
    const res = await fetchStockHistory(startDate, endDate, symbols);

    // Convert the result into an array of objects by symbol
    const results = [];

    for (const symbol in res) {
      results.push({
        symbol: symbol,
        prices: res[symbol]
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
};
export default   getStockData;