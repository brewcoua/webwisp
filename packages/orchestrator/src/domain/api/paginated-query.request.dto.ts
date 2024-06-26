import { LimitOptions } from '@configs/app.const'
import { SortOrder } from '@domain/ddd'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'

export abstract class PaginatedQueryRequestDto<OrderByField extends string> {
    @IsOptional()
    @IsInt()
    @Min(LimitOptions.pagination.limit.min)
    @Max(LimitOptions.pagination.limit.max)
    @Type(() => Number)
    @ApiProperty({
        example: 10,
        description: 'Specifies a limit of returned records',
        required: false,
        default: LimitOptions.pagination.limit.default,
        type: Number,
    })
    readonly limit: number = LimitOptions.pagination.limit.default

    @IsOptional()
    @IsInt()
    @Min(LimitOptions.pagination.page.min)
    @Max(LimitOptions.pagination.page.max)
    @Type(() => Number)
    @ApiProperty({
        example: 1,
        description: 'Specifies the page number',
        required: false,
        default: LimitOptions.pagination.page.default,
        type: Number,
    })
    readonly page: number = LimitOptions.pagination.page.default

    @IsOptional()
    @IsEnum(SortOrder)
    @Type(() => String)
    @ApiProperty({
        example: SortOrder.ASC,
        description: 'Specifies the sorting order of returned records',
        required: false,
        default: SortOrder.ASC,
        enum: SortOrder,
    })
    readonly sort: SortOrder = SortOrder.ASC

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        example: new Date(),
        description: 'Returns records created after the specified date',
        required: false,
        type: Date,
    })
    readonly createdAfter?: Date

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        example: new Date(),
        description: 'Returns records created before the specified date',
        required: false,
        type: Date,
    })
    readonly createdBefore?: Date

    abstract readonly orderBy: OrderByField
}
