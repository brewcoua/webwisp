import { Paginated } from '@domain/ddd'
import { ApiProperty } from '@nestjs/swagger'

export abstract class PaginatedResponseDto<T> extends Paginated<T> {
    @ApiProperty({
        example: 5312,
        description: 'Total number of items',
    })
    declare readonly count: number

    @ApiProperty({
        example: 10,
        description: 'Number of items per page',
    })
    declare readonly limit: number

    @ApiProperty({
        example: 1,
        description: 'Current page',
    })
    declare readonly page: number

    @ApiProperty({
        isArray: true,
    })
    abstract readonly data: readonly T[]
}
