/**
 * Stock Trading Simulation System
 * 
 * This module provides functions to:
 * 1. Select appropriate stocks based on investment horizon
 * 2. Run trading simulations with configurable parameters
 */

import Stocks from "./PortfolioClass";
import runSimulation from "./Search";
import selectStocks from "./stocks";

/**
 * Determines the investment period type based on duration
 * @param {number} years - Number of investment years
 * @param {number} months - Additional months to investment duration
 * @returns {string} - 'long' or 'short' term classification
 */
const getInvestmentPeriod = (years, months) => {
  const totalMonths = (years * 12) + months;
  return totalMonths >= 18 ? 'long' : 'short'; // Considered long-term if 1.5+ years
};

/**
 * Selects appropriate stocks for the investment period
 * @param {number} years - Investment years
 * @param {number} months - Additional months
 * @param {number} [count=30] - Number of stocks to select
 * @returns {Array} - Selected stocks array
 */
const selectPeriodStocks = (years, months, count = 30) => {
  const period = getInvestmentPeriod(years, months);
  return selectStocks(period, count);
};

/**
 * Executes a trading simulation with given parameters
 * @param {number} capital - Starting investment capital
 * @param {number} years - Investment duration in years
 * @param {number} months - Additional months to duration
 * @param {Array} [customStocks=[]] - Optional predefined stock selection
 * @returns {Object} - Simulation results
 * @throws {Error} - If invalid parameters are provided
 */
const executeTradingSimulation = async (capital, years, months, customStocks = []) => {
  // Validate inputs
  if (capital <= 0) throw new Error('Capital must be positive');
  if (years < 0 || months < 0) throw new Error('Duration cannot be negative');
  
  const period = getInvestmentPeriod(years, months);
  const stocks = customStocks.length > 0 
    ? customStocks 
    : selectStocks(period , 1);
  
  try {
    const simulationResults = await runSimulation(
      stocks,
      capital,
      years,
      months
    );
    /*
    eg
    the simulationResults = {
    totalValue :  totalValue  ,
    actions : 
    [{action : "buy"or "sell",
     frame : 0 index of days start day +i = current action day ,
     symbol 
     value
     }]
    }
    */
    return {
      success: true,
      periodType: period,
      stocksUsed: stocks.length,
      ...simulationResults
    };
  } catch (error) {
    console.error('Simulation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example usage
(async () => {
  try {
    // Example 1: Automated stock selection
    const autoResults = await executeTradingSimulation(1000, 1, 0);
    console.log('Auto-selected simulation:', autoResults);
    
    // Example 2: Custom stock selection
    const customStocks = selectPeriodStocks(2, 0,15); // 2.5 year horizon
    const customResults = await executeTradingSimulation(
      5000, 
      2, 
      6, 
      customStocks
    );
    console.log('Custom stock simulation:', customResults);
  } catch (error) {
    console.error('Runtime error:', error);
  }
})();

export {
 
  selectPeriodStocks,
  executeTradingSimulation
};