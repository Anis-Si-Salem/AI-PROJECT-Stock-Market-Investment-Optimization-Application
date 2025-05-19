class MaxHeap {
    constructor() {
        this.heap = [];     // Store items as [negativePriority, counter, value]
        this.counter = 0;   // Tie-breaker for equal-priority items
    }

    /**
     * Push a value into the heap with a given priority.
     * Higher priority means it will be popped earlier.
     * @param {*} value - The value to store (e.g., a Node)
     * @param {number} priority - Numeric priority (higher is better)
     */
    push(value, priority) {
        try {
            // Use negative priority to simulate max-heap using min-heap logic
            const entry = [-priority, this.counter, value];
            this.counter++;
            this._heapPush(entry);
        } catch (e) {
            console.error(`Error in push: ${e}`);
            console.error(traceStack());
        }
    }

    /**
     * Internal helper to push to the heap (min-heap by default in JS)
     * @param {*} entry 
     */
    _heapPush(entry) {
        this.heap.push(entry);
        this._siftUp(this.heap.length - 1);
    }

    /**
     * Internal helper to pop from the heap
     * @returns {*} entry
     */
    _heapPop() {
        const size = this.heap.length;
        if (size === 0) return null;

        const removedRoot = this.heap[0];
        const last = this.heap.pop();

        if (size > 1) {
            this.heap[0] = last;
            this._siftDown(0);
        }

        return removedRoot;
    }

    /**
     * Pop the value with the highest priority
     * @returns {{value: *, priority: number}|null}
     */
    pop() {
        if (this.isEmpty()) return null;

        const [negPriority, _, value] = this._heapPop();
        return { value, priority: -negPriority };
    }

    /**
     * Peek at the top item without removing it
     * @returns {{value: *, priority: number}|null}
     */
    peek() {
        if (this.isEmpty()) return null;

        const [negPriority, _, value] = this.heap[0];
        return { value, priority: -negPriority };
    }

    /**
     * Return the number of items in the heap
     */
    get size() {
        return this.heap.length;
    }

    /**
     * Check if the heap is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * Sift up to maintain heap property
     * @param {number} index
     */
    _siftUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this._compare(this.heap[index], this.heap[parentIndex]) >= 0) {
                this._swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    /**
     * Sift down to maintain heap property
     * @param {number} index
     */
    _siftDown(index) {
        const size = this.heap.length;
        const halfSize = Math.floor(size / 2);

        while (index < halfSize) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = leftChildIndex + 1;

            let smallestChildIndex = leftChildIndex;

            if (
                rightChildIndex < size &&
                this._compare(this.heap[rightChildIndex], this.heap[leftChildIndex]) < 0
            ) {
                smallestChildIndex = rightChildIndex;
            }

            if (this._compare(this.heap[smallestChildIndex], this.heap[index]) < 0) {
                this._swap(index, smallestChildIndex);
                index = smallestChildIndex;
            } else {
                break;
            }
        }
    }

    /**
     * Compare two heap entries
     * @param {*} a
     * @param {*} b
     * @returns {number}
     */
    _compare(a, b) {
        // Compare priorities first
        if (a[0] !== b[0]) {
            return a[0] - b[0]; // lower negPriority comes first
        }
        // Then use counter as tie-breaker
        return a[1] - b[1];
    }

    /**
     * Swap two elements in the heap
     * @param {number} i
     * @param {number} j
     */
    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}

/**
 * Optional: Trace stack on error
 * @returns {string}
 */
function traceStack() {
    const err = new Error();
    return err.stack || '';
}
export default MaxHeap