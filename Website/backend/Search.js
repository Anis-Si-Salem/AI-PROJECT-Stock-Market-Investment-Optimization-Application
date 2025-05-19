
import { setNodes } from "./Node";
import Stocks from "./PortfolioClass";

import MaxHeap from "./MaxHeap";
import getStockData from "./get_stock_data";
import aStarSearch from "./a_star";
import expand from "./expand";
async function search(stocks, startDate, endDate) {
  // Fetch stock data (assuming getStockData is an async function)
  console.log(stocks)
  const T = await getStockData(stocks, startDate, endDate);
  console.log("This is the stock data:", T);

  // Find minimum length of prices array across all stocks
  const minLen = Math.min(...T.map(stock => stock.prices.length));

  // Initialize the search structure
  const T_search = Array.from({ length: minLen }, () => []);

  // Populate the search structure
  for (const stock of T) {
    for (let i = 0; i < minLen; i++) {
      T_search[i].push({
        symbol: stock.symbol,
        price: stock.prices[i]
      });
    }
  }

  return { history: T, frames: T_search };
}
// Portfolio Action Application
function applyActs(path, portfolio , frame = 0) {
  path.forEach(node => {
    if (node.action === "buy") {
      portfolio.buy(node.symbol, node.value ,true , frame);
    } else if (node.action === "sell") {
      portfolio.sell(node.symbol, node.value , true , frame);
    }
  });
}

// Date/Time Utilities
function getTimeFrame(years = 1, months = 0) {
  const pivotDate = new Date('2023-01-01');
  
  // Calculate start date (years-1 before pivot)
  const start = new Date(pivotDate);
  start.setFullYear(start.getFullYear() - (years - 1));
  
  // Calculate end date
  const end = new Date(pivotDate);
  end.setFullYear(end.getFullYear() + 1);
  end.setMonth(end.getMonth() + months);
  
  return [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ];
}

function getPastFrames(history, cutoffIndex) {
  return history.map(stock => ({
    ...stock,
    prices: stock.prices.slice(0, cutoffIndex)
  }));
}

function calculatePortfolioValue(portfolio, currentPrices) {
  return portfolio.stocks.reduce((total, stockData) => {
    return total + (stockData.amt * (currentPrices[stockData.stock] || 0));
  }, 0);
}

// Main Simulation Function
async function runSimulation(
  stocks = topTechStocks,
  initialCapital = 2000,
  years = 1,
  months = 0
) {
  // Setup time frame and get historical data
  const [startDate, endDate] = getTimeFrame(years, months);
  const shortTerm = years < 2;
  
  const { history, frames } = await search(stocks, startDate, endDate);
  console.log(frames)
  // Initialize portfolio
  const portfolio = new Stocks(initialCapital);
  const lastStock = stocks[stocks.length - 1];
  
  // Run time frame simulation
  for (let i = 26; i < frames.length; i++) {
    const pastFrames = getPastFrames(history, i);
    const historyHeuristic = pastFrames.reduce((acc, item) => {
      acc[item.symbol] = item;
      return acc;
    }, {});
    
    // Modified adapter call that uses expand with correct parameters
    const expanded = expand(frames[i] ,1, portfolio, constraints);
    const nodes = setNodes(expanded, historyHeuristic, shortTerm);
    const bestNode = aStarSearch(nodes[0], lastStock, portfolio, frames[i]);
    applyActs(getPath(bestNode).slice(1), portfolio , i);
  }
  
  // Display results
  portfolio.displayPortfolio();
  
  const currentPrices = frames[frames.length - 1].reduce((acc, fr) => {
    acc[fr.symbol] = fr.price;
    return acc;
  }, {});
  
  const totalValue = calculatePortfolioValue(portfolio, currentPrices) + portfolio.getFunds()
  console.log("Total Portfolio Value:", totalValue);
  return {totalValue :  totalValue  ,actions : portfolio.getActions()};
}



export default runSimulation