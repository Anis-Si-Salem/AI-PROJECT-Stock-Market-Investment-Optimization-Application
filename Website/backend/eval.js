/**
 * Gets the path from the current node back to the root (start node).
 * @param {Node} currentNode - The node to trace back from.
 * @returns {Node[]} An array of nodes representing the path.
 */
function getPath(currentNode) {
    const path = [];
    while (currentNode !== null && currentNode !== undefined) {
        path.push(currentNode);
        currentNode = currentNode.parent;
    }
    return path.reverse(); // Return path from root to current node
}

/**
 * Evaluates the total portfolio value and updates available funds based on the node path.
 * @param {Node} currentNode - Current node in the search tree.
 * @param {Object} portfolio - Portfolio object with funds and stocks.
 * @param {Array<Object>} prices - Array of price objects like { "symbol": "...", "price": ... }
 * @returns {[number, number]} [totalValue, availableFunds]
 */
function evaluate(currentNode, portfolio, prices) {
    const path = getPath(currentNode);

    // Convert prices array to map for faster lookup
    const priceMap = {};
    for (const priceObj of prices) {
        priceMap[priceObj.symbol] = priceObj.price;
    }

    // Calculate initial portfolio value from held stocks
    let totalValue = 0;
    for (const stockData of portfolio.stocks) {
        const symbol = stockData.stock;
        const shares = stockData.amt;
        const price = priceMap[symbol] || 0;
        totalValue += shares * price;
    }

    let availableFunds = portfolio.funds;

    // Apply actions along the path to update totalValue and funds
    for (const node of path) {
        if (node.action === "sell") {
            totalValue -= node.value;
            availableFunds += node.value;
        } else if (node.action === "buy") {
            totalValue += node.value;
            availableFunds -= node.value;
        }
        // Hold does nothing
    }

    return [totalValue, availableFunds];
}
export { evaluate , getPath}