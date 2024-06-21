import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import amqp from 'amqplib'

import LinkedList from '@domain/LinkedList'
import { Task } from '@modules/tasks/domain'

import { WorkerEvent, WorkerEventType } from './domain/WorkerEvent'
import TaskResult from './domain/TaskResult'
import Worker from './domain/Worker'
import WorkerStatus from './domain/WorkerStatus'

@Injectable()
export default class WorkersService {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    private connection: amqp.Connection | null = null

    private tasksChannel: amqp.Channel | null = null
    private eventsChannel: amqp.Channel | null = null

    private readonly workers: LinkedList<Worker> = new LinkedList()
    private readonly results: LinkedList<TaskResult> = new LinkedList()

    async initialize() {
        this.connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_HOST || 'localhost'}`
        )

        this.tasksChannel = await this.connection.createChannel()
        await this.tasksChannel.assertQueue('tasks')

        this.eventsChannel = await this.connection.createChannel()
        await this.eventsChannel.assertQueue('events')
        this.bindEvents()
    }

    publishTask(task: Task): boolean {
        if (!this.tasksChannel) {
            throw new Error('Channel not initialized')
        }

        return this.tasksChannel.sendToQueue(
            'tasks',
            Buffer.from(JSON.stringify(task))
        )
    }

    getWorkers(): Worker[] {
        return this.workers.toArray()
    }
    getResults(): TaskResult[] {
        return this.results.toArray()
    }
    getResult(id: string): TaskResult | null {
        return this.results.findById(id)?.value || null
    }

    async close() {
        if (this.tasksChannel) {
            await this.tasksChannel.close()
        }

        if (this.connection) {
            await this.connection.close()
        }
    }

    private bindEvents(): void {
        if (!this.eventsChannel) {
            throw new Error('Channel not initialized')
        }

        this.eventsChannel.consume(
            'events',
            (msg) => {
                if (msg) {
                    const event: WorkerEvent = JSON.parse(
                        msg.content.toString()
                    )
                    switch (event.type) {
                        case WorkerEventType.STARTED: {
                            const worker = {
                                id: event.id,
                                tag: msg.fields.consumerTag,
                                status: WorkerStatus.READY,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }
                            this.workers.append(worker)
                            Logger.log(
                                `Worker ${event.id} connected`,
                                'WorkersService'
                            )
                            event.worker = worker
                            break
                        }
                        case WorkerEventType.TASK_STARTED: {
                            const worker = this.workers.findById(event.id)
                            if (worker) {
                                worker.value.status = WorkerStatus.BUSY
                                worker.value.updatedAt = new Date()
                                worker.value.task = event.task
                            }
                            Logger.log(
                                `Worker ${event.id} started task ${event.task.id}`,
                                'WorkersService'
                            )
                            break
                        }
                        case WorkerEventType.TASK_COMPLETED: {
                            const worker = this.workers.findById(event.id)
                            if (worker) {
                                worker.value.status = WorkerStatus.READY
                                worker.value.updatedAt = new Date()
                                worker.value.task = undefined
                            }
                            this.results.append(event.result)
                            Logger.log(
                                `Worker ${event.id} completed task ${event.result.id}`,
                                'WorkersService'
                            )
                            break
                        }
                        case WorkerEventType.DISCONNECT:
                            this.workers.removeById(event.id)
                            Logger.log(
                                `Worker ${event.id} disconnected`,
                                'WorkersService'
                            )
                            break
                    }

                    this.eventEmitter.emit('worker', event)
                }
            },
            { noAck: true }
        )
    }
}
