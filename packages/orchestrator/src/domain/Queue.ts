import LinkedList from './LinkedList'
import { TrackableData } from './Node'

export default class Queue<T extends TrackableData> {
    private readonly list: LinkedList<T> = new LinkedList<T>()

    /**
     * Enqueue a new element to the queue
     * @param value Value to enqueue
     */
    enqueue(value: T): void {
        this.list.append(value)
    }

    /**
     * Dequeue an element from the queue
     * @returns The dequeued element or null if the queue is empty
     */
    dequeue(): T | null {
        if (!this.list.head) return null

        const value = this.list.head.value
        this.list.remove(this.list.head.value)
        return value
    }

    /**
     * Peek at the first element in the queue
     * @returns The first element in the queue or null if the queue is empty
     */
    peek(): T | null {
        if (!this.list.head) return null
        return this.list.head.value
    }

    /**
     * Check if the queue is empty
     * @returns True if the queue is empty, false otherwise
     */
    isEmpty(): boolean {
        return this.list.size === 0
    }

    /**
     * Get the size of the queue
     * @returns The size of the queue
     */
    size(): number {
        return this.list.size
    }

    /**
     * Clear the queue
     */
    clear(): void {
        this.list.clear()
    }

    /**
     * Print the queue
     */
    printQueue(): void {
        this.list.printForward()
    }
}
