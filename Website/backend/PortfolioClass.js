
/**
 * Represents an individual stock item with a stock name and the amount owned.
 */
class StockItem {
    /**
     * Initializes a stock item.
     * @param {string} stock - The name/symbol of the stock.
     * @param {number} [amt=1] - The amount of the stock owned (default is 1).
     */
    constructor(stock, amt = 1) {
        this.stock = stock;
        this.amt = amt;
    }
}

/**
 * Represents a stock portfolio where users can buy and sell stocks using available funds.
 */
class Stocks {
    /**
     * Initializes the Stocks portfolio.
     * @param {number} funds - Initial amount of funds available.
     * @param {StockItem[]} [stocks=[]] - Optional array of StockItem objects representing owned stocks.
     */
    constructor(funds, stocks = []) {
        this.funds = funds;
        this.stocks = stocks;
        this.value = 0;
        this.actions = []
    }

    /**
     * Gets all owned stocks.
     * @returns {StockItem[]} Array of StockItem objects.
     */
    getStocks() {
        return this.stocks;
    }

    /**
     * Gets current available funds.
     * @returns {number} Available funds amount.
     */
    getFunds() {
        return this.funds;
    }

    /**
     * Purchases a stock if sufficient funds are available.
     * @param {string} stock - The name/symbol of the stock to buy.
     * @param {number} price - The price of the stock.
     * @param {boolean} [showRes=true] - Whether to log the result (default true).
     */
    buy(stock, price, showRes = true , frame = 0) {
        if (this.funds < price) {
            if (showRes) {
                console.log(`Insufficient funds to buy ${stock}. Available: $${this.funds.toFixed(2)}, Required: $${price.toFixed(2)}`);
            }
            return;
        }

        this.funds -= price; // Deduct the stock price from funds
        let found = false;

        // Check if the stock is already owned
        for (const item of this.stocks) {
            if (item.stock === stock) {
                item.amt += 1; // Increase the stock amount
                found = true;
                break;
            }
        }

        // If stock is not found, add a new entry
        if (!found) {
            this.stocks.push(new StockItem(stock));
        }
        act = {
            symbol : stock,
            action : "buy",
            value : price,
            date: frame
        }
        this.actions.push(act)
        if (showRes) {
            console.log(`Bought 1 share of ${stock} for $${price.toFixed(2)}. Remaining funds: $${this.funds.toFixed(2)}`);
        }
    }

    /**
     * Sells a stock if the user owns it.
     * @param {string} stock - The name/symbol of the stock to sell.
     * @param {number} price - The price of the stock at the time of selling.
     * @param {boolean} [showRes=true] - Whether to log the result (default true).
     */
    sell(stock, price, showRes = true , frame) {
        for (let i = 0; i < this.stocks.length; i++) {
            const item = this.stocks[i];
            if (item.stock === stock) {
                item.amt -= 1; // Reduce stock amount
                this.funds += price; // Add the selling price to funds

                // Remove the stock from the list if the amount reaches zero
                if (item.amt === 0) {
                    this.stocks.splice(i, 1);
                }
                act = {
                symbol : stock,
                action : "sell",
                value : price,
                date: frame
            }
            this.actions.push(act)
                if (showRes) {
                    console.log(`Sold 1 share of ${stock} for $${price.toFixed(2)}. Updated funds: $${this.funds.toFixed(2)}`);
                }
                return;
            }
        }

        console.log(`Cannot sell ${stock}: Not owned.`);
    }

    /**
     * Checks if a stock exists in the portfolio.
     * @param {string} stock - The name/symbol of the stock to check.
     * @returns {boolean} True if the stock is in the portfolio, false otherwise.
     */
    hasStock(stock) {
        return this.stocks.some(item => item.stock === stock);
    }

    /**
     * Gets the amount of a specific stock owned.
     * @param {string} stock - The name/symbol of the stock.
     * @returns {number} Amount owned, or 0 if not found.
     */
    getStock(stock) {
        const item = this.stocks.find(item => item.stock === stock);
        return item ? item.amt : 0;
    }

    /**
     * Evaluates the total value of the portfolio.
     * @param {Object[]} stocks - Array of stock objects with symbol and price.
     * @returns {number} Total portfolio value.
     */
    evalPort(stocks) {
        let totalValue = 0;
        for (const stock of stocks) {
            if (this.hasStock(stock.symbol)) {
                totalValue += this.getStock(stock.symbol) * stock.price;
            }
        }
        return totalValue;
    }

    /**
     * Calculates the percentage of a specific stock in the portfolio.
     * @param {string} stock - The name/symbol of the stock.
     * @returns {number} Percentage (0-1) of the stock in the portfolio.
     */
    percentage(stock) {
        if (!this.hasStock(stock)) {
            return 0.0;
        }

        const total = this.stocks.reduce((sum, item) => sum + item.amt, 0);
        if (total === 0) {
            return 0.0;
        }

        const item = this.stocks.find(item => item.stock === stock);
        return item.amt / total;
    }
    getActions(){
        return this.actions
    }
    /**
     * Displays the current stock holdings and available funds.
     */
    displayPortfolio() {
        console.log(`\nAvailable funds: $${this.funds.toFixed(2)}`);
        if (this.stocks.length === 0) {
            console.log("Stock Portfolio is empty.");
        } else {
            console.log("Stock Portfolio:");
            for (const stock of this.stocks) {
                console.log(`- ${stock.stock}: ${stock.amt} shares`);
            }
        }
        console.log("-".repeat(30));
    }

    /**
     * Transitions the portfolio to a new state based on percentages.
     * @param {number} funds - New amount of funds.
     * @param {Object[]} dayPrices - Array of stock prices with symbol and price.
     */
    transition(funds, dayPrices) {
        // Create price lookup dictionary
        const prices = {};
        for (const price of dayPrices) {
            prices[price.symbol] = price.price;
        }

        // Create stock information dictionary
        const stockInfo = {};
        for (const stock of this.stocks) {
            const symbol = stock.stock;
            stockInfo[symbol] = {
                price: prices[symbol],
                amt: this.getStock(symbol),
                per: this.percentage(symbol)
            };
        }

        // Update funds
        this.funds = funds;

        // Clear current stocks (after we've used them for calculations)
        this.stocks = [];

        // Rebuild portfolio according to percentages
        for (const [symbol, details] of Object.entries(stockInfo)) {
            if (details.per <= 0) {  // Skip if percentage is 0 or negative
                continue;
            }

            // Calculate amount to buy (using available funds)
            const amountToSpend = funds * details.per;
            const numToBuy = Math.floor(amountToSpend / details.price);

            // Execute buys
            for (let i = 0; i < numToBuy; i++) {
                if (this.funds >= details.price) {  // Check if we can afford it
                    this.buy(symbol, details.price, false);
                } else {
                    break;  // Stop if we run out of money
                }
            }
        }
    }

    /**
     * Comparison method for sorting (compares by heuristic value).
     * @param {Stocks} other - Another Stocks instance to compare with.
     * @returns {boolean} True if this instance has lower heuristic value.
     */
    lessThan(other) {
        return this.getHeu() < other.getHeu();
    }

    /**
     * Equality comparison method.
     * @param {Stocks} other - Another Stocks instance to compare with.
     * @returns {boolean} True if heuristic values are equal.
     */
    equals(other) {
        return this.getHeu() === other.getHeu();
    }

    /**
     * Placeholder for heuristic value calculation.
     * @returns {number} Heuristic value (to be implemented).
     */
    getHeu() {
        // Implement your heuristic calculation here
        return 0;
    }
}

export default Stocks