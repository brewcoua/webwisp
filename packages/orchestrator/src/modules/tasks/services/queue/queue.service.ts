import { Injectable } from '@nestjs/common'
import { Task } from '@webwisp/types/tasks'
import Queue from './queue.entity'

@Injectable()
export default class QueueService {
    private readonly queue: Queue<Task> = new Queue()

    push(task: Task) {
        this.queue.enqueue(task)
    }

    pop(): Task | null {
        return this.queue.dequeue()
    }

    remove(id: string): Task | null {
        return this.queue.remove((task: Task) => task.id === id)
    }

    peek(): Task | null {
        return this.queue.peek()
    }

    peekAll(): Task[] {
        return this.queue.peekAll()
    }

    isEmpty(): boolean {
        return this.queue.isEmpty()
    }

    size(): number {
        return this.queue.size()
    }
}
