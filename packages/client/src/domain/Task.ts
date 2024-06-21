export interface Task extends PartialTask {
    id: string
    createdAt: Date
}

export interface PartialTask {
    target: string
    prompt: string
}
