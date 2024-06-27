export interface TracesRepositoryPort {
    getTraceByTaskId(taskId: string): Promise<string | null>
    streamTrace(filename: string): Promise<NodeJS.ReadableStream | null>
    deleteTrace(taskId: string): Promise<void>
    uploadTrace(taskId: string): Promise<void>
    uploadAll(): Promise<void>
}
