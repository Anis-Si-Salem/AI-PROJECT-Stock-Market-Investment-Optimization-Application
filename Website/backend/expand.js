/**
 * Expands the stock portfolio by evaluating buy/sell/hold actions for each stock
 * @param {Array<{id: string, price: number}>} stocks - List of stocks to evaluate
 * @param {{funds: number}} mainstock - The main stock object with available funds
 * @param {{
 *   hasStock: (id: string) => boolean,
 *   getPercentage: (id: string) => number
 * }} portfolio - Current portfolio with ownership checks
 * @param {number} [limit=0.2] - Allocation threshold percentage (default 20%)
 * @returns {Array<{id: string, hold: number, buy?: number, sell?: number}>} List of actions
 */
function expand(stocks, mainstock, portfolio) {
  return stocks.map(stock => {
    let action = { 
      symbol: stock.symbol, 
      hold: 0  // Default hold action
    };
    
    // Check if stock is already in portfolio
    if (portfolio.hasStock(stock.symbol)) {
      action.sell = stock.price;  // Add sell option at current price
    }
  const limit = parseFloat(0.2)
 const currentAllocation = parseFloat(portfolio.percentage(stock.symbol)) || 0;
const funds = parseFloat(portfolio.getFunds()) || 0;
const price = parseFloat(stock.price) || 0;

console.log(currentAllocation, funds, price , currentAllocation < limit ,  funds >= price);

if ((currentAllocation < limit || currentAllocation == 0) && funds >= price) {
  console.log('hi i passed')
  action["buy"] = -price;
}
    return action;
  });
}

export default expand