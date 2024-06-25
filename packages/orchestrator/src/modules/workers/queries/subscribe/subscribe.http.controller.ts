import { Controller, HttpStatus, Query, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { fromEvent, map } from 'rxjs'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

@ApiTags('workers')
@Controller('workers')
export class SubscribeHttpController {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    @ApiOperation({
        summary: 'Subscribe to workers events',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Subscribed to workers events',
        type: 'text/event-stream',
    })
    @Scopes(UserScopes.VIEW)
    @Sse('subscribe')
    subscribe(@Query('access_token') token: string) {
        return fromEvent(this.eventEmitter, 'worker').pipe(
            map((event) => {
                return new MessageEvent('message', {
                    data: JSON.stringify(event),
                })
            })
        )
    }
}
