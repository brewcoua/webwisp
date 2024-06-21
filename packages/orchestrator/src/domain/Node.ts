export default class Node<T> {
    value: T
    next: Node<T> | null = null
    prev: Node<T> | null = null

    constructor(value: T) {
        this.value = value
    }
}

export interface TrackableData {
    id: unknown
}
