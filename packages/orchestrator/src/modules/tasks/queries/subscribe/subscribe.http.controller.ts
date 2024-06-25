import { Controller, HttpStatus, Query, Sse } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { fromEvent, map } from 'rxjs'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

@ApiTags('tasks')
@Controller('tasks')
export class SubscribeHttpController {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    @ApiOperation({
        summary: 'Subscribe to task events',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Task events',
        type: 'text/event-stream',
    })
    @Scopes(UserScopes.VIEW)
    @Sse('subscribe')
    subscribe(@Query('access_token') token: string) {
        return fromEvent(this.eventEmitter, 'task').pipe(
            map((event) => {
                return new MessageEvent('message', {
                    data: JSON.stringify(event),
                })
            })
        )
    }
}
