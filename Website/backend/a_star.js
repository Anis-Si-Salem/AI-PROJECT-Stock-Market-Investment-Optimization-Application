import { setNodes } from "./Node";
import MaxHeap from "./MaxHeap";


/**
 * A* search algorithm to find a goal node based on heuristic + cost evaluation.
 *
 * @param {Node} startNode - Starting node in the graph
 * @param {string} goal - Symbol of the goal node
 * @param {Portfolio} portfolio - Portfolio object with funds and current holdings
 * @param {Object} prices - Object mapping stock symbols to their current prices
 * @returns {Node|null} The goal node if found, otherwise null
 */
function aStarSearch(startNode, goal, portfolio, prices ) {
    const heap = new MaxHeap();
    heap.push(startNode, 0);

    const visited = new Set(); // To avoid revisiting same nodes

    while (!heap.isEmpty()) {
        const { value: currentNode, priority } = heap.pop();

        const keyC = `${currentNode.symbol}_${currentNode.action}`;

        // If already visited, skip
        if (visited.has(keyC)) continue;
        visited.add(keyC);

        // Goal check
        if (currentNode.symbol === goal) {
            return currentNode;
        }

        // Evaluate current node
        const [cost, funds] = evaluate(currentNode, portfolio, prices);

        // Explore neighbors
        for (const neighbor of currentNode.neighbors) {
            const keyN = neighbor.getKey();

            // Skip if already visited
            if (visited.has(keyN)) continue;

            // Skip buy action if insufficient funds
            if (neighbor.action === "buy" && funds < neighbor.value) {
                continue;
            }

            // Evaluate neighbor
            const [costN, fundsN] = evaluate(neighbor, portfolio, prices);
            const heuristic = neighbor.getHeu();
            const combinedScore = 0.65 * heuristic + 0.35 * normalize(costN * 0.6 + fundsN * 0.4);

            // Push to heap
            heap.push(neighbor, combinedScore);
        }
    }

    // No path to goal found
    return null;
}
export default aStarSearch 