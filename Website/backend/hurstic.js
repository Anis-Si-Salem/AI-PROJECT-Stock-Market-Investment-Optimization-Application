

/**
 * Calculates daily returns from price data
 * @param {number[]} prices - Array of stock prices
 * @returns {number[]} Array of daily returns
 */
function calculateReturns(prices) {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    return returns;
}

/**
 * Calculates Value at Risk (VaR) and Conditional Value at Risk (CVaR)
 * @param {Object} stock - Stock object with symbol and prices
 * @param {number} [confidenceLevel=0.95] - Confidence level (0-1)
 * @returns {Object} Contains VaR and CVaR values
 */
function getVarAndCVar(stock, confidenceLevel = 0.95) {
    const prices = stock.prices;
    const returns = calculateReturns(prices);
    
    // Calculate mean and standard deviation
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const stdDev = Math.sqrt(
        returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length
    );
    
    // Z-score approximation for normal distribution
    const zScore = -1.6449; // Approximation for 95% confidence (1 - 0.95)
    const varValue = mean - zScore * stdDev;
    
    // Calculate CVaR (average of losses beyond VaR)
    const lossesBeyondVar = returns.filter(r => r <= varValue);
    const cvarValue = lossesBeyondVar.length > 0 ? 
        lossesBeyondVar.reduce((sum, val) => sum + val, 0) / lossesBeyondVar.length : 
        varValue;
    
    return { 
        var: parseFloat(varValue.toFixed(6)), 
        cvar: parseFloat(cvarValue.toFixed(6)) 
    };
}

/**
 * Calculates Sharpe Ratio for risk-adjusted return
 * @param {Object} stock - Stock object with symbol and prices
 * @param {number} [riskFreeRate=0.02] - Annual risk-free rate
 * @param {number} [tradingDays=252] - Trading days in a year
 * @returns {number} Sharpe ratio
 */
function getSharpeRatio(stock, riskFreeRate = 0.02, tradingDays = 252) {
    const returns = calculateReturns(stock.prices);
    const meanDailyReturn = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const annualExcessReturn = (meanDailyReturn * tradingDays) - riskFreeRate;
    const annualStdDev = Math.sqrt(
        returns.reduce((sum, val) => sum + Math.pow(val - meanDailyReturn, 2), 0) / returns.length
    ) * Math.sqrt(tradingDays);
    
    return annualStdDev !== 0 ? 
        parseFloat((annualExcessReturn / annualStdDev).toFixed(4)) : 
        Infinity;
}

/**
 * Calculates Sortino Ratio focusing on downside risk
 * @param {Object} stock - Stock object with symbol and prices
 * @param {number} [riskFreeRate=0.02] - Annual risk-free rate
 * @param {number} [tradingDays=252] - Trading days in a year
 * @returns {number} Sortino ratio
 */
function getSortinoRatio(stock, riskFreeRate = 0.02, tradingDays = 252) {
    const returns = calculateReturns(stock.prices);
    const meanDailyReturn = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const annualExcessReturn = (meanDailyReturn * tradingDays) - riskFreeRate;
    
    // Calculate downside deviation
    const downsideReturns = returns.filter(r => r < 0);
    const downsideDeviation = downsideReturns.length > 0 ? 
        Math.sqrt(
            downsideReturns.reduce((sum, val) => sum + Math.pow(val, 2), 0) / downsideReturns.length
        ) * Math.sqrt(tradingDays) : 
        0;
    
    return downsideDeviation !== 0 ? 
        parseFloat((annualExcessReturn / downsideDeviation).toFixed(4)) : 
        Infinity;
}

/**
 * Calculates Exponential Moving Average (EMA)
 * @param {number[]} prices - Array of stock prices
 * @param {number} span - Time period for EMA calculation
 * @returns {number[]} EMA values
 */
function calculateEMA(prices, span) {
    if (!prices.length || span <= 0) {
        throw new Error("Prices must be non-empty and span must be positive");
    }
    
    const alpha = 2 / (span + 1);
    const ema = [prices[0]];
    
    for (let i = 1; i < prices.length; i++) {
        ema.push(prices[i] * alpha + ema[i - 1] * (1 - alpha));
    }
    
    return ema;
}

/**
 * Calculates Relative Strength Index (RSI)
 * @param {Object} stock - Stock object with symbol and prices
 * @param {number} [period=14] - Lookback period for RSI calculation
 * @returns {number} RSI value (0-100)
 */
function getRSI(stock, period = 14) {
    const prices = stock.prices;
    
    if (prices.length <= period) {
        throw new Error(`Need at least ${period + 1} prices for RSI calculation`);
    }
    
    const priceChanges = [];
    for (let i = 1; i < prices.length; i++) {
        priceChanges.push(prices[i] - prices[i - 1]);
    }
    
    const gains = priceChanges.map(change => Math.max(change, 0));
    const losses = priceChanges.map(change => -Math.min(change, 0));
    
    let avgGain = gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    
    // Handle case where there are no losses
    if (avgLoss === 0) return 100;
    
    for (let i = period; i < priceChanges.length; i++) {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    }
    
    const rs = avgGain / avgLoss;
    return parseFloat((100 - (100 / (1 + rs))).toFixed(2));
}

/**
 * Calculates Moving Average Convergence Divergence (MACD) histogram value
 * @param {Object} stock - Stock object with symbol and prices
 * @returns {number|null} MACD histogram value or null if insufficient data
 */
function getMACD(stock) {
    const prices = stock.prices;
    if (prices.length < 26) return null;
    
    const shortEMA = calculateEMA(prices.slice(-12), 12);
    const longEMA = calculateEMA(prices.slice(-26), 26);
    
    // Calculate MACD line (12-day EMA - 26-day EMA)
    const macd = [];
    for (let i = 0; i < 12; i++) {
        macd.push(shortEMA[i] - longEMA[i]);
    }
    
    // Calculate signal line (9-day EMA of MACD line)
    const signalLine = calculateEMA(macd.slice(-9), 9);
    
    // Calculate MACD histogram (MACD line - signal line)
    const histogram = macd.slice(-9).map((val, i) => val - signalLine[i]);
    
    return parseFloat(histogram[histogram.length - 1].toFixed(4));
}

/**
 * Calculates Momentum indicator
 * @param {Object} stock - Stock object with symbol and prices
 * @param {boolean} [shortTerm=false] - Use short-term lookback if true
 * @returns {number} Momentum value
 */
function calcMomentum(stock, shortTerm = false) {
    const prices = stock.prices;
    const T = prices.length;
    const n = shortTerm ? Math.floor(T / 6) : Math.floor(T / 4);
    const ti = prices[T - 1];
    const tn = prices[T - n - 1];
    
    return parseFloat(((ti - tn) / tn).toFixed(4));
}

function calculateHeuristics(stock, marketData = null) {
    console.log(stock)
    const symbol = stock.symbol;

    // --- Step 1: Normalize All Inputs ---

    // Momentum: tanh bounds to [-1, 1], then shift to [0, 1]
    function tanh(x) {
        const e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }

    const momentumShort = (tanh(calcMomentum(stock, true)) + 1) / 2; // [0, 1]
    const momentumLong = (tanh(calcMomentum(stock, false)) + 1) / 2; // [0, 1]

    // MACD: Sigmoid to bound to [0, 1] (positive = bullish, negative = bearish)
    const macd = getMACD(stock);
    let macdScore, negMacdScore;
    if (macd !== null && macd !== undefined) {
        macdScore = 1 / (1 + Math.exp(-macd)); // [0, 1]
        negMacdScore = 1 / (1 + Math.exp(macd)); // flipped for sell
    } else {
        macdScore = 0.5;
        negMacdScore = 0.5;
    }

    // RSI: Normalize to [0, 1] (RSI > 70 = overbought, < 30 = oversold)
    const rsi = getRSI(stock);
    const rsiNormalized = Math.max(0, Math.min((rsi - 30) / 40, 1));

    // Sharpe/Sortino: Percentile rank or exponential scaling
    const sharpe = Math.max(0, getSharpeRatio(stock));
    const sortino = Math.max(0, getSortinoRatio(stock));

    let sharpeRank, sortinoRank;
    if (marketData && marketData.sharpes && marketData.sharpes.length > 0) {
        const sharpes = marketData.sharpes;
        sharpeRank = sharpes.filter(s => s <= sharpe).length / sharpes.length;
    } else {
        sharpeRank = 1 - Math.exp(-0.3 * sharpe); // diminishing returns
    }

    if (marketData && marketData.sortinos && marketData.sortinos.length > 0) {
        const sortinos = marketData.sortinos;
        sortinoRank = sortinos.filter(s => s <= sortino).length / sortinos.length;
    } else {
        sortinoRank = 1 - Math.exp(-0.3 * sortino);
    }

    // VaR/CVaR: Convert risk to safety score [0,1]
   
    let Var = getVarAndCVar(stock);
    const varRisk = Var.var, cvarRisk = Var.cvar
    const varSafety = Math.max(0, Math.min(1 + varRisk / 0.3, 1)); // max VaR = -30%
    const cvarSafety = Math.max(0, Math.min(1 + cvarRisk / 0.5, 1)); // max CVaR = -50%

    // Stability: based on how close momentum is to neutral
    const stabilityShort = 1 - Math.min(Math.abs(momentumShort - 0.5) * 2, 1);
    const stabilityLong = 1 - Math.min(Math.abs(momentumLong - 0.5) * 2, 1);

    // Clamp utility function
    function clamp(x) { return Math.max(0, Math.min(1, x)); }

    // --- Step 2: Rebalanced Weights ---
    // Short-Term Scores
    const buyScoreShort = clamp(
        0.3 * momentumShort +
        0.2 * macdScore +
        0.2 * rsiNormalized +
        0.2 * sharpeRank +
        0.05 * varSafety +
        0.05 * stabilityShort
    );

    const sellScoreShort = clamp(
        0.3 * (1 - momentumShort) +
        0.2 * negMacdScore +
        0.2 * (1 - rsiNormalized) +
        0.15 * (1 - varSafety) +
        0.1 * (1 - cvarSafety) +
        0.05 * (1 - stabilityShort)
    );

    const holdScoreShort = clamp(
        0.3 * sharpeRank +
        0.3 * sortinoRank +
        0.2 * stabilityShort +
        0.1 * rsiNormalized +
        0.1 * varSafety
    );

    // Long-Term Scores
    const buyScoreLong = clamp(
        0.3 * momentumLong +
        0.2 * macdScore +
        0.2 * rsiNormalized +
        0.15 * sharpeRank +
        0.1 * varSafety +
        0.05 * stabilityLong
    );

    const sellScoreLong = clamp(
        0.3 * (1 - momentumLong) +
        0.2 * negMacdScore +
        0.2 * (1 - rsiNormalized) +
        0.15 * (1 - varSafety) +
        0.1 * (1 - cvarSafety) +
        0.05 * (1 - stabilityLong)
    );

    const holdScoreLong = clamp(
        0.3 * sharpeRank +
        0.3 * sortinoRank +
        0.2 * stabilityLong +
        0.1 * rsiNormalized +
        0.1 * varSafety
    );

    // --- Final Output ---
    return {
        symbol,
        buy_short: buyScoreShort,
        sell_short: sellScoreShort,
        hold_short: holdScoreShort,
        buy_long: buyScoreLong,
        sell_long: sellScoreLong,
        hold_long: holdScoreLong
    };
}
export default calculateHeuristics