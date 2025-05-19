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
function expand(stocks, mainstock, portfolio, limit = 0.2) {
  return stocks.map(stock => {
    const action = { 
      id: stock.id, 
      hold: 0  // Default hold action
    };
    
    // Check if stock is already in portfolio
    if (portfolio.hasStock(stock.id)) {
      action.sell = stock.price;  // Add sell option at current price
    }
    
    // Check if under allocation limit and has sufficient funds
    const currentAllocation = portfolio.getPercentage(stock.id) || 0;
    if (currentAllocation < limit && portfolio.getFunds() >= stock.price) {
      action.buy = -stock.price;  // Add buy option (negative for cost)
    }
    
    return action;
  });
}

export default expand