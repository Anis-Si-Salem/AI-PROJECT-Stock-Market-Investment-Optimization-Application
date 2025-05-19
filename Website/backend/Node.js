import calculateHeuristics from "./hurstic";
class Node {
    /**
     * Represents a node in a graph, typically used in search algorithms.
     *
     * @param {Object} stock - Contains symbol, action, value (e.g., {"symbol": "AAPL", "action": "buy", "value": 100})
     * @param {number} heuristic - Heuristic value for this node
     * @param {Node|null} parent - Parent node in the search tree
     * @param {Array<Node>|null} neighbors - List of connected nodes
     */
    constructor(stock, heuristic, parent = null, neighbors = null) {
        this.value = stock.value !== undefined ? stock.value : 0;
        this.heuristic = heuristic || 0;
        this.symbol = stock.symbol || "unknown";
        this.action = stock.action || "none";
        this.neighbors = neighbors || [];
        this.parent = parent;
    }

    /**
     * Returns a dictionary representation of the node.
     * @returns {Object}
     */
    get setCopStock() {
        return {
            symbol: this.symbol,
            action: this.action,
            value: this.value
        };
    }

    /**
     * Adds a neighbor to the node.
     * @param {Node} neighbor
     */
    addNeighbor(neighbor) {
        if (!this.neighbors.includes(neighbor)) {
            this.neighbors.push(neighbor);
        }
    }

    /**
     * Removes a neighbor from the node.
     * @param {Node} neighbor
     */
    removeNeighbor(neighbor) {
        const index = this.neighbors.indexOf(neighbor);
        if (index > -1) {
            this.neighbors.splice(index, 1);
        }
    }

    /**
     * Sets the parent node.
     * @param {Node} parent
     */
    setParent(parent) {
        this.parent = parent;
    }

    /**
     * Returns a unique key for the node combining symbol and action.
     * @returns {string}
     */
    getKey() {
        return `${this.symbol}_${this.action}`;
    }

    /**
     * Returns the heuristic value.
     * @returns {number}
     */
    getHeu() {
        return this.heuristic;
    }

    /**
     * Returns a deep copy of the node.
     * @returns {Node}
     */
    getCopy() {
        const copyNode = new Node(this.setCopStock, this.heuristic);
        return copyNode;
    }

    /**
     * String representation for debugging.
     * @returns {string}
     */
    toString() {
        return `Node(symbol=${this.symbol}, action=${this.action}, value=${this.value.toFixed(2)}, heuristic=${this.heuristic.toFixed(2)}, neighbors=${this.neighbors.length})`;
    }
}
function setNodes(expansion, history, short = false, sellatonce = false, portfolio = null) {
    /**
     * Creates a graph of nodes based on the expansion list.
     *
     * @param {Array} expansion - List of dictionaries representing possible actions for each stock.
     * @param {Object} history - Historical data used for heuristic calculation.
     * @param {boolean} short - Boolean indicating if short positions are considered.
     * @param {boolean} sellatonce - Whether to allow multiple sells on the same stock.
     * @param {Portfolio} [portfolio] - Portfolio object containing current holdings.
     * @returns {Array} A list of Node objects representing the node graph.
     */

    // Create base node
    const baseNode = new Node(
        { symbol: "emp", action: "none", value: 0 },
        0,
        null,
        []
    );

    const nodes = [baseNode];
    let prevNodes = [baseNode];

    for (const stockInfo of expansion) {
        const stockId = stockInfo.symbol;
        const stockHeuristic = calculateHeuristics(history[stockId]);

        let num = 0;
        if (sellatonce && portfolio) {
            for (const stock of portfolio.stocks) {
                if (stock.stock === stockId) {
                    num = stock.amt - 1; // create extra sell steps
                }
            }
        }

        // Helper function to create nodes
        function createNode(action, value, heuristicKey) {
            if (stockInfo[action] !== undefined) {
                const node = new Node(
                    { symbol: stockId, action: action, value: value },
                    stockHeuristic[heuristicKey],
                    null,
                    []
                );
                nodes.push(node);
                return node;
            }
            return null;
        }

        // Create nodes for each action
        const createdNodes = [];

        const buyNode = createNode("buy", -stockInfo.buy, short ? "buy_short" : "buy_long");
        if (buyNode) createdNodes.push(buyNode);

        const sellNode = createNode("sell", stockInfo.sell, short ? "sell_short" : "sell_long");
        if (sellNode) createdNodes.push(sellNode);

        const holdNode = createNode("hold", stockInfo.hold, short ? "hold_short" : "hold_long");
        if (holdNode) createdNodes.push(holdNode);

        // Connect nodes
        const newPrevNodes = [];
        for (const prevNode of prevNodes) {
            for (const newNode of createdNodes) {
                const nodeCopy = newNode.getCopy();
                prevNode.neighbors.push(nodeCopy);
                nodeCopy.setParent(prevNode);
                newPrevNodes.push(nodeCopy);
            }
        }

        prevNodes = newPrevNodes;

        // Repeat selling/holding steps if needed
        for (let i = 0; i < num; i++) {
            const createdExtraNodes = [];

            const extraSellNode = createNode("sell", stockInfo.sell, short ? "sell_short" : "sell_long");
            const extraHoldNode = createNode("hold", stockInfo.hold, short ? "hold_short" : "hold_long");

            if (extraSellNode) createdExtraNodes.push(extraSellNode);
            if (extraHoldNode) createdExtraNodes.push(extraHoldNode);

            const updatedNewPrevNodes = [];
            for (const prevNode of prevNodes) {
                for (const newNode of createdExtraNodes) {
                    const nodeCopy = newNode?.getCopy();
                    if (!nodeCopy) continue;
                    prevNode.neighbors.push(nodeCopy);
                    nodeCopy.setParent(prevNode);
                    updatedNewPrevNodes.push(nodeCopy);
                }
            }

            prevNodes = updatedNewPrevNodes;
        }
    }

    return nodes;
}
export { Node , setNodes}