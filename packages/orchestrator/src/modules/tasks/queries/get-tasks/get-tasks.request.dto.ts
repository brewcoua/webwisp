import { ApiProperty } from '@nestjs/swagger'
import {
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator'

import { PaginatedQueryRequestDto } from '@domain/api/paginated-query.request.dto'
import { TaskStatus } from '../../domain/task.types'
import {
    SortableTaskField,
    SortableTaskFields,
} from '../../database/models/task.model'

export class GetTasksRequestDto extends PaginatedQueryRequestDto<SortableTaskField> {
    @ApiProperty({
        example: TaskStatus.RUNNING,
        description: 'Filter tasks by status',
        required: false,
    })
    @IsOptional()
    @IsEnum(TaskStatus)
    @IsString()
    readonly status?: TaskStatus

    @ApiProperty({
        example: 'example.com',
        description: 'Filter tasks by target, including partial matches',
        required: false,
        minLength: 1,
        maxLength: 256,
    })
    @IsOptional()
    @MinLength(1)
    @MaxLength(256)
    @IsString()
    readonly target?: string

    @ApiProperty({
        example: 'verify',
        description: 'Filter tasks by prompt, including partial matches',
        required: false,
        minLength: 1,
        maxLength: 512,
    })
    @IsOptional()
    @MinLength(1)
    @MaxLength(512)
    @IsString()
    readonly prompt?: string

    @ApiProperty({
        example: '6687ba14da1b8221de863618',
        description: 'Filter tasks by group',
        required: false,
        minLength: 24,
        maxLength: 24,
    })
    @IsOptional()
    @MinLength(24)
    @MaxLength(24)
    @IsString()
    @Matches(/^[a-f0-9]{24}$/)
    readonly group?: string

    @ApiProperty({
        example: SortableTaskFields.updatedAt,
        description: 'Sort tasks by field',
        required: false,
        default: SortableTaskFields.updatedAt,
        enum: SortableTaskFields,
    })
    @IsOptional()
    @IsEnum(SortableTaskFields)
    @IsString()
    readonly orderBy: SortableTaskField = SortableTaskFields.updatedAt

    constructor() {
        super()
    }
}
