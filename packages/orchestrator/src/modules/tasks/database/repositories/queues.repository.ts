import { Inject, Injectable, Logger } from '@nestjs/common'
import amqp from 'amqplib'

import LinkedList from '@domain/LinkedList'
import { RabbitMQService } from '@services/rabbitmq'
import { MessageQueues } from '@configs/app.const'

import { TaskQueuesRepositoryPort } from './queues.repository.port'
import TaskEntity from '../../domain/task.entity'
import { TaskEvent, TaskEventType } from '../../domain/task.events'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TASK_REPOSITORY } from '../../tasks.tokens'
import { TaskRepositoryPort } from './task.repository.port'
import { TaskStatus } from '../../domain/task.types'

@Injectable()
export default class TaskQueuesRepository implements TaskQueuesRepositoryPort {
    private tasksQueue: amqp.Channel | null = null
    private eventsQueue: amqp.Channel | null = null

    private readonly enqueuedTasks: LinkedList<TaskEntity> = new LinkedList()

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        @Inject(TASK_REPOSITORY)
        private readonly taskRepository: TaskRepositoryPort,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async connect(): Promise<void> {
        this.tasksQueue = await this.rabbitMQService.getQueue(
            MessageQueues.Tasks
        )
        this.eventsQueue = await this.rabbitMQService.getQueue(
            MessageQueues.TaskEvents
        )
        this.bindEvents()
    }

    findTaskById(id: string): TaskEntity | null {
        const task = this.enqueuedTasks.findById(id)

        return task?.value || null
    }

    sendTaskToQueue(task: TaskEntity): boolean {
        if (!this.tasksQueue) {
            throw new Error('Channel not initialized')
        }

        const props = task.getProps()

        const result = this.tasksQueue.sendToQueue(
            MessageQueues.Tasks,
            Buffer.from(
                JSON.stringify({
                    id: task.id,
                    target: props.target,
                    prompt: props.prompt,
                })
            )
        )

        if (result) {
            Logger.log(`Task published: ${task.id}`, 'TaskQueuesRepository')
            this.enqueuedTasks.append(task)
        }

        return result
    }

    private bindEvents(): void {
        if (!this.eventsQueue) {
            throw new Error('Channel not initialized')
        }

        this.eventsQueue.consume(
            MessageQueues.TaskEvents,
            async (message) => {
                if (!message) {
                    return
                }

                const event: TaskEvent = JSON.parse(message.content.toString())
                switch (event.type) {
                    case TaskEventType.COMPLETED: {
                        const task = this.enqueuedTasks.findById(event.id)
                        if (task) {
                            this.enqueuedTasks.remove(task.value)
                        }

                        // Now, save the task to the database
                        const entity = new TaskEntity({
                            id: event.id,
                            createdAt: task?.value.createdAt || new Date(),
                            updatedAt: new Date(),
                            props: event.task,
                        })

                        await this.taskRepository.transaction(async () => {
                            await this.taskRepository.insert(entity)
                        })

                        Logger.log(
                            `Task completed: ${event.id}`,
                            'TaskQueuesRepository'
                        )
                        break
                    }
                    case TaskEventType.CYCLE_COMPLETED: {
                        const task = this.enqueuedTasks.findById(event.id)
                        if (task) {
                            task.value.pushCycle(event.report)
                        }
                        break
                    }
                    case TaskEventType.STARTED: {
                        const task = this.enqueuedTasks.findById(event.id)
                        if (task) {
                            task.value.setStatus(TaskStatus.RUNNING)
                        }
                        break
                    }
                    case TaskEventType.REQUEUED: {
                        const task = this.enqueuedTasks.findById(event.id)
                        if (task) {
                            task.value.setStatus(TaskStatus.PENDING)
                            this.enqueuedTasks.moveToBack(task)
                        }
                        break
                    }
                }

                this.eventEmitter.emit('task', event)
            },
            { noAck: true }
        )
    }
}
