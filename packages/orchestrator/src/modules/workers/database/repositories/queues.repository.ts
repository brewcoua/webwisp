import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import amqp from 'amqplib'

import { RabbitMQService } from '@services/rabbitmq'
import LinkedList from '@domain/LinkedList'
import { MessageQueues } from '@configs/app.const'

import { WorkerQueuesRepositoryPort } from './queues.repository.port'
import WorkerEntity from '../../domain/worker.entity'
import { WorkerEvent, WorkerEventType } from '../../domain/worker.events'
import { WorkerStatus } from '@modules/workers/domain/worker.types'

@Injectable()
export default class WorkerQueuesRepository
    implements WorkerQueuesRepositoryPort
{
    private workersQueue: amqp.Channel | null = null

    private readonly workers: LinkedList<WorkerEntity> = new LinkedList()

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async connect() {
        this.workersQueue = await this.rabbitMQService.getQueue(
            MessageQueues.WorkerEvents
        )
        this.bindEvents()
    }

    getWorkers(): WorkerEntity[] {
        return this.workers.toArray()
    }

    findWorkerById(id: string): WorkerEntity | null {
        return this.workers.findById(id)?.value || null
    }

    findWorkerByTag(tag: string): WorkerEntity | null {
        return (
            this.workers.findBySelector(
                (worker) => worker.getProps().tag === tag
            )?.value || null
        )
    }

    findWorkerByTask(task: string): WorkerEntity | null {
        return (
            this.workers.findBySelector(
                (worker) => worker.getProps().task === task
            )?.value || null
        )
    }

    private bindEvents() {
        if (!this.workersQueue) return

        this.workersQueue.consume(
            MessageQueues.WorkerEvents,
            async (message: amqp.ConsumeMessage | null) => {
                if (!message) return

                const event: WorkerEvent = JSON.parse(
                    message.content.toString()
                )

                if (event.type === WorkerEventType.STARTED) {
                    const worker = WorkerEntity.create(event.worker)
                    this.workers.append(worker)
                    this.eventEmitter.emit('worker', {
                        type: WorkerEventType.STARTED,
                        worker: worker.toObject(),
                    })
                    Logger.log(`Worker ${worker.id} started`, 'WorkerQueues')
                    return
                }

                const worker = this.findWorkerById(event.id)
                if (!worker) return

                switch (event.type) {
                    case WorkerEventType.DISCONNECTED: {
                        this.workers.remove(worker)
                        this.eventEmitter.emit('worker', {
                            type: WorkerEventType.DISCONNECTED,
                            id: worker.id,
                        })
                        Logger.log(
                            `Worker ${worker.id} disconnected`,
                            'WorkerQueues'
                        )
                        break
                    }
                    case WorkerEventType.STATUS_CHANGED: {
                        switch (event.status) {
                            case WorkerStatus.READY: {
                                worker.setStatus(WorkerStatus.READY)
                                this.eventEmitter.emit('worker', {
                                    type: WorkerEventType.STATUS_CHANGED,
                                    id: worker.id,
                                    status: WorkerStatus.READY,
                                })
                                break
                            }
                            case WorkerStatus.BUSY: {
                                worker.setStatus(WorkerStatus.BUSY)
                                worker.setTask(event.task)
                                this.eventEmitter.emit('worker', {
                                    type: WorkerEventType.STATUS_CHANGED,
                                    id: worker.id,
                                    status: WorkerStatus.BUSY,
                                    task: event.task,
                                })
                                break
                            }
                        }
                        break
                    }
                }

                this.workersQueue?.ack(message)
            },
            { noAck: true }
        )
    }
}
