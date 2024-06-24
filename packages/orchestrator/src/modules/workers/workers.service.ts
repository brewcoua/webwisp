import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import amqp from 'amqplib'

import { MessageQueues } from '@configs/app.const'
import LinkedList from '@domain/LinkedList'
import { RabbitMQService } from '@services/rabbitmq'

import { WorkerEvent, WorkerEventType } from './domain/WorkerEvent'
import Worker from './domain/Worker'
import WorkerStatus from './domain/WorkerStatus'

@Injectable()
export default class WorkersService {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    private eventsChannel: amqp.Channel | null = null

    private readonly workers: LinkedList<Worker> = new LinkedList()

    async initialize() {
        this.eventsChannel = await this.rabbitMQService.getQueue(
            MessageQueues.WorkerEvents
        )

        this.bindEvents()
    }

    getWorkers(): Worker[] {
        return this.workers.toArray()
    }

    private bindEvents(): void {
        if (!this.eventsChannel) {
            throw new Error('Channel not initialized')
        }

        this.eventsChannel.consume(
            MessageQueues.WorkerEvents,
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
                        case WorkerEventType.STATUS_CHANGED: {
                            const worker = this.workers.findById(event.id)
                            if (worker) {
                                worker.value.status = event.status
                                worker.value.updatedAt = new Date()
                                if (event.status === WorkerStatus.BUSY) {
                                    worker.value.task_id = event.task_id
                                }
                            }
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
