import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { NotFoundException } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'
import { ReadStream, createReadStream, existsSync } from 'fs'

import { GetTraceQuery } from './get-trace.query'

@QueryHandler(GetTraceQuery)
export class GetTraceQueryHandler implements IQueryHandler<GetTraceQuery> {
    async execute(query: GetTraceQuery): Promise<Result<ReadStream, Error>> {
        const path = `/data/traces/${query.id}.zip`
        if (!existsSync(path)) {
            return Err(
                new NotFoundException(`Trace with id ${query.id} not found`)
            )
        }

        return Ok(createReadStream(path))
    }
}
