import { ApiProperty } from '@nestjs/swagger'
import {
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator'

import { TaskStatus } from '../../domain/task.types'

export class GetQueuedTasksRequestDto {
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
}
