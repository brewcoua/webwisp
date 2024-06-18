export default class Queue<T> {
    private head: Node<T> | null = null
    private tail: Node<T> | null = null
    private length = 0

    /**
     * Enqueue a value to the end of the queue
     * @param value Value to enqueue
     * @public
     */
    public enqueue(value: T): void {
        const node = new Node(value)

        if (this.tail) {
            this.tail.next = node
            node.prev = this.tail
            this.tail = node
        } else {
            this.head = this.tail = node
        }

        this.length++
    }

    /**
     * Dequeue a value from the front of the queue and return it
     * @returns Value at the front of the queue
     * @public
     */
    public dequeue(): T | null {
        if (!this.head) return null

        const value = this.head.value
        this.head = this.head.next
        if (this.head) {
            this.head.prev = null
        } else {
            this.tail = null
        }

        this.length--
        return value
    }

    /**
     * Remove a specific value from the queue, with an increased time complexity of O(n)
     * @param selector Function to determine if a value should be removed
     * @returns Value that was removed, or null if no value was removed
     * @public
     */
    public remove(selector: (value: T) => boolean): T | null {
        let current = this.head

        while (current) {
            if (selector(current.value)) {
                if (current.prev) {
                    current.prev.next = current.next
                } else {
                    this.head = current.next
                }

                if (current.next) {
                    current.next.prev = current.prev
                } else {
                    this.tail = current.prev
                }

                this.length--
                return current.value
            }

            current = current.next
        }

        return null
    }

    /**
     * Peek at the front of the queue without removing the value
     * @returns Value at the front of the queue
     * @public
     */
    public peek(): T | null {
        return this.head ? this.head.value : null
    }

    /**
     * Peek at all values in the queue without removing them
     * @returns All values in the queue
     * @public
     */
    public peekAll(): T[] {
        const values: T[] = []
        let current = this.head

        while (current) {
            values.push(current.value)
            current = current.next
        }

        return values
    }

    /**
     * Check if the queue is empty
     * @returns True if the queue is empty, false otherwise
     * @public
     */
    public isEmpty(): boolean {
        return this.length === 0
    }

    /**
     * Get the size of the queue
     * @returns Number of elements in the queue
     * @public
     */
    public size(): number {
        return this.length
    }

    /**
     * Clear the queue
     * @public
     */
    public clear(): void {
        this.head = this.tail = null
        this.length = 0
    }
}

export class Node<T> {
    value: T
    next: Node<T> | null = null
    prev: Node<T> | null = null

    constructor(value: T) {
        this.value = value
    }
}
