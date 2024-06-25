import Node, { TrackableData } from './Node'

/**
 * A linked list data structure (doubly linked)
 * @public
 */
export default class LinkedList<T extends TrackableData> {
    head: Node<T> | null = null
    tail: Node<T> | null = null
    size: number = 0

    /**
     * Append a new element to the list
     * @param value Value to append
     */
    append(value: T): void {
        const newNode = new Node(value)
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            newNode.prev = this.tail
            if (this.tail) {
                this.tail.next = newNode
            }
            this.tail = newNode
        }
        this.size++
    }

    /**
     * Prepend a new element to the list
     * @param value Value to prepend
     */
    prepend(value: T): void {
        const newNode = new Node(value)
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            newNode.next = this.head
            this.head.prev = newNode
            this.head = newNode
        }
        this.size++
    }

    /**
     * Move an element to the front of the list
     * @param node Node to move
     * @returns Node containing the value or null if not found
     */
    moveToBack(node: Node<T>): void {
        if (node === this.tail) return

        if (node.prev) {
            node.prev.next = node.next
        } else {
            this.head = node.next
        }

        if (node.next) {
            node.next.prev = node.prev
        }

        node.prev = this.tail
        node.next = null

        if (this.tail) {
            this.tail.next = node
        }

        this.tail = node
    }

    /**
     * Remove an element from the list
     * @param value Value to remove
     * @returns Node containing the value or null if not found
     */
    remove(value: T): Node<T> | null {
        if (!this.head) return null

        let current: Node<T> | null = this.head
        while (current && current.value.id !== value.id) {
            current = current.next
        }

        if (!current) return null

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

        this.size--
        return current
    }

    /**
     * Remove an element by id from the list
     * @param id Id to remove
     * @returns Node containing the value or null if not found
     */
    removeById(id: T['id']): Node<T> | null {
        if (!this.head) return null

        let current: Node<T> | null = this.head
        while (current && current.value.id !== id) {
            current = current.next
        }

        if (!current) return null

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

        this.size--
        return current
    }

    /**
     * Find an element in the list
     * @param value Value to find
     * @returns Node containing the value or null if not found
     */
    find(value: T): Node<T> | null {
        let current = this.head
        while (current && current.value.id !== value.id) {
            current = current.next
        }
        return current
    }

    /**
     * Find an element by id in the list
     * @param id Id to find
     * @returns Node containing the value or null if not found
     */
    findById(id: T['id']): Node<T> | null {
        let current = this.head
        while (current && current.value.id !== id) {
            current = current.next
        }
        return current
    }

    /**
     * Find an element by a field in the list
     * @param field Field to find
     * @param value Value to find
     * @returns Node containing the value or null if not found
     */
    findByField(field: keyof T, value: T[keyof T]): Node<T> | null {
        let current = this.head
        while (current && current.value[field] !== value) {
            current = current.next
        }
        return current
    }

    /**
     * Find an element by a selector in the list
     * @param selector Selector to find
     * @returns Node containing the value or null if not found
     */
    findBySelector(selector: (value: T) => boolean): Node<T> | null {
        let current = this.head
        while (current && !selector(current.value)) {
            current = current.next
        }
        return current
    }

    /**
     * Clear the list
     */
    clear(): void {
        this.head = null
        this.tail = null
        this.size = 0
    }

    /**
     * Map the list to an array, while cloning the values (which has overhead)
     * @returns Array of values
     */
    toArray(): T[] {
        const array: T[] = []
        let current = this.head
        while (current) {
            array.push(current.value.clone())
            current = current.next
        }
        return array
    }

    /**
     * Print the list from head to tail
     */
    printForward(): void {
        let current = this.head
        let output = ''
        while (current) {
            output += JSON.stringify(current.value) + ' <-> '
            current = current.next
        }
        console.log(output + 'null')
    }

    /**
     * Print the list from tail to head
     */
    printBackward(): void {
        let current = this.tail
        let output = ''
        while (current) {
            output += JSON.stringify(current.value) + ' <-> '
            current = current.prev
        }
        console.log(output + 'null')
    }
}
