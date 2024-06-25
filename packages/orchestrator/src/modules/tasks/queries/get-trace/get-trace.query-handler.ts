import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { NotFoundException, StreamableFile } from '@nestjs/common'
import { Err, Ok, Result } from 'oxide.ts'
import { createReadStream, existsSync } from 'fs'

import { GetTraceQuery } from './get-trace.query'

@QueryHandler(GetTraceQuery)
export class GetTraceQueryHandler implements IQueryHandler<GetTraceQuery> {
    async execute(
        query: GetTraceQuery
    ): Promise<Result<StreamableFile, Error>> {
        const path = `/data/traces/${query.id}.zip`
        if (!existsSync(path)) {
            return Err(
                new NotFoundException(`Trace with id ${query.id} not found`)
            )
        }

        const file = createReadStream(path)
        return Ok(new StreamableFile(file))
    }
}
