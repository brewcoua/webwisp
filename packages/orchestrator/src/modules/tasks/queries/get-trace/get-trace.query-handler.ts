import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'

import { GetTraceQuery } from './get-trace.query'
import { TRACES_REPOSITORY } from '../../tasks.tokens'
import { TracesRepositoryPort } from '../../database/repositories/traces.repository.port'

@QueryHandler(GetTraceQuery)
export class GetTraceQueryHandler implements IQueryHandler<GetTraceQuery> {
    constructor(
        @Inject(TRACES_REPOSITORY)
        private readonly tracesRepository: TracesRepositoryPort
    ) {}

    async execute(query: GetTraceQuery): Promise<Result<string, Error>> {
        const traces = await this.tracesRepository.getTraceByTaskId(query.id)

        if (!traces) {
            return Err(new NotFoundException('Trace not found'))
        }

        return Ok(traces)
    }
}
