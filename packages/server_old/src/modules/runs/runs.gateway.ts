import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Observable, fromEvent, map } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Server, Socket } from 'socket.io'
import { RunCommands, RunEvent, RunEvents } from '@webwisp/types'

import RunsService from './runs.service'
import { Contexts } from '../../constants'

@WebSocketGateway({ namespace: '/runs' })
export default class RunsGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() private readonly server!: Server
    private readonly clients: Map<string, Set<Socket>> = new Map()

    constructor(
        private readonly runsService: RunsService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    handleConnection(client: Socket): void {
        const runnerId = client.handshake.query.id as string
        if (!runnerId || !runnerId.match(/^[A-Za-z0-9_-]{21}$/)) {
            client.disconnect(true)
            return
        }

        if (!this.clients.has(runnerId)) {
            this.clients.set(runnerId, new Set())
        }
        this.clients.get(runnerId)?.add(client)
        Logger.log(
            `[${client.id}]: Client connected (${runnerId})`,
            Contexts.RunsGateway
        )
    }

    handleDisconnect(client: Socket): void {
        const runnerId = client.handshake.query.id as string
        if (runnerId && this.clients.has(runnerId)) {
            this.clients.get(runnerId)?.delete(client)
            if (this.clients.get(runnerId)?.size === 0) {
                this.clients.delete(runnerId)
            }
        }
        Logger.log(`[${client.id}]: Client disconnected`, Contexts.RunsGateway)
    }

    @SubscribeMessage(RunCommands.START)
    async onStart(client: Socket): Promise<void> {
        const id = client.handshake.query.id as string
        if (!id) {
            return
        }

        return this.runsService.start(id)
    }

    @SubscribeMessage(RunCommands.PAUSE)
    onPause(client: Socket): void {
        const id = client.handshake.query.id as string
        if (!id) {
            return
        }

        return this.runsService.pause(id)
    }

    @SubscribeMessage(RunCommands.RESUME)
    onResume(client: Socket): void {
        const id = client.handshake.query.id as string
        if (!id) {
            return
        }
        return this.runsService.resume(id)
    }

    @SubscribeMessage(RunCommands.SUBSCRIBE)
    onSubscribe(client: Socket): Observable<WsResponse<RunEvent['data']>> {
        const id = client.handshake.query.id as string
        if (!id) {
            return new Observable()
        }

        Logger.debug(
            `[${client.id}]: Subscribing to events (${id})`,
            Contexts.RunsGateway
        )

        return fromEvent(this.eventEmitter, `run.${id}`).pipe(
            map((data) => {
                const event = data as RunEvent
                return {
                    event: event.type,
                    data: event.data,
                }
            })
        )
    }
}
