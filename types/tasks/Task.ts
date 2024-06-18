export interface PartialTask {
    target: string
    prompt: string
}

export interface Task extends PartialTask {
    id: string
    createdAt: Date
}
