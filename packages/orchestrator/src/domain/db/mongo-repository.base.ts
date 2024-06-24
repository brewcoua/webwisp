import { EventEmitter2 } from '@nestjs/event-emitter'
import { HydratedDocument, Model, PipelineStage } from 'mongoose'
import { None, Option, Some } from 'oxide.ts'

import {
    Entity,
    Mapper,
    Paginated,
    PaginatedQueryParams,
    RepositoryPort,
    SortOrder,
} from '../ddd'
import { ObjectLiteral } from '../types'

export class ConflictException extends Error {
    constructor(
        message: string,
        public readonly error: any
    ) {
        super(message)
    }
}

export abstract class MongoRepositoryBase<
    Aggregate extends Entity<any>,
    DbModel extends ObjectLiteral,
> implements RepositoryPort<Aggregate>
{
    protected abstract model: Model<any>

    protected constructor(
        protected readonly mapper: Mapper<Aggregate, DbModel>,
        protected readonly eventEmitter: EventEmitter2
    ) {}

    async findOneById(id: string): Promise<Option<Aggregate>> {
        const dbModel = await this.model.findById(id).exec()
        return dbModel ? Some(this.mapper.toDomain(dbModel)) : None
    }

    async findAll(): Promise<Aggregate[]> {
        const dbModels = await this.model.find().exec()
        return dbModels.map((dbModel) => this.mapper.toDomain(dbModel))
    }

    async findAllPaginated(
        params: PaginatedQueryParams
    ): Promise<Paginated<Aggregate>> {
        return this.findPaginated(params)
    }

    async delete(entity: Aggregate): Promise<boolean> {
        entity.validate()

        const result = await this.model.findByIdAndDelete(entity.id).exec()

        return result.length > 0
    }

    async insert(entity: Aggregate | Aggregate[]): Promise<void> {
        const entities = Array.isArray(entity) ? entity : [entity]
        const records = entities.map(this.mapper.toPersistence)

        try {
            await this.model.insertMany(records)
        } catch (error: any) {
            if (error.code === 11000) {
                // Validation Error (duplicate key)
                throw new ConflictException('Record already exists', error)
            }

            throw error
        }
    }

    public async transaction<T>(handler: () => Promise<T>): Promise<T> {
        const session = await this.model.startSession()

        session.startTransaction()

        try {
            const result = await handler()

            await session.commitTransaction()

            return result
        } catch (error: any) {
            await session.abortTransaction()

            throw error
        } finally {
            await session.endSession()
        }
    }

    protected async findPaginated(
        params: PaginatedQueryParams,
        pipeline: PipelineStage[] = []
    ): Promise<Paginated<Aggregate>> {
        const {
            limit,
            page,
            offset,
            orderBy,
            sort,
            createdAfter,
            createdBefore,
        } = params

        const sortType: 1 | -1 = sort === SortOrder.DESC ? -1 : 1
        const createdPipeline: PipelineStage[] =
            createdAfter || createdBefore
                ? [
                      {
                          $match: {
                              createdAt: {
                                  ...{
                                      ...(createdAfter && {
                                          $gte: createdAfter,
                                      }),
                                      ...(createdBefore && {
                                          $lte: createdBefore,
                                      }),
                                  },
                              },
                          },
                      },
                  ]
                : []

        const dbModels: HydratedDocument<DbModel>[] = await this.model
            .aggregate([
                ...pipeline,
                ...createdPipeline,
                {
                    $sort: { [orderBy]: sortType },
                },
                {
                    $skip: offset,
                },
                {
                    $limit: limit,
                },
            ])
            .exec()

        const entities = dbModels.map((dbModel) =>
            this.mapper.toDomain(dbModel)
        )

        return new Paginated<Aggregate>({
            data: entities,
            count: entities.length,
            limit,
            page,
        })
    }
}
