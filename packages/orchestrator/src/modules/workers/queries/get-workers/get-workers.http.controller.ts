import { Controller, Get, HttpStatus } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'

import { Scopes } from '@modules/auth'
import { UserScopes } from '@modules/auth/domain/user.types'

import WorkersMapper from '../../workers.mapper'
import WorkerResponseDto from '../../dtos/worker.response.dto'
import { GetWorkersQuery } from './get-workers.query'
import WorkerEntity from '../../domain/worker.entity'

@ApiTags('workers')
@Controller('workers')
export class GetWorkersHttpController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly mapper: WorkersMapper
    ) {}

    @ApiOperation({
        summary: 'Get workers',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Workers list',
        type: [WorkerResponseDto],
    })
    @ApiBearerAuth()
    @Scopes(UserScopes.VIEW)
    @Get()
    async getWorkers(): Promise<WorkerResponseDto[]> {
        const workers: WorkerEntity[] = await this.queryBus.execute(
            new GetWorkersQuery({})
        )

        return workers.map((worker) => this.mapper.toResponse(worker))
    }
}
