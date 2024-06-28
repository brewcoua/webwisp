import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Ok, Result } from 'oxide.ts'

import { GetCorrelationQuery } from './get-correlation.query'
import { AggregateID } from '@domain/ddd/entity.base'

@QueryHandler(GetCorrelationQuery)
export class GetCorrelationQueryHandler
    implements IQueryHandler<GetCorrelationQuery>
{
    async execute(query: GetCorrelationQuery): Promise<Result<string, Error>> {
        const id = AggregateID.create()

        return Ok(id)
    }
}
