import {
    TaskDifficultyDto,
    TaskEvaluationConfigDto,
} from '@modules/tasks/dtos/task.eval.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator'

export class CreateTaskRequestDto {
    @ApiProperty({
        example: 'https://example.com',
        description: 'The target URL to perform the task on',
        minLength: 6,
        maxLength: 512,
        pattern: '^(http|https)://[^ "]+$',
    })
    @IsString()
    @MinLength(3)
    @MaxLength(512)
    @IsUrl()
    readonly target!: string

    @ApiProperty({
        example: 'Click the button',
        description: 'The prompt for the task',
        minLength: 6,
        maxLength: 1024,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(1024)
    readonly prompt!: string

    @ApiProperty({
        type: () => TaskEvaluationConfigDto,
        description: 'The evaluation configuration for the task',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    readonly evaluation?: TaskEvaluationConfigDto

    @ApiProperty({
        type: () => TaskDifficultyDto,
        description: 'The difficulty of the task, informative only',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    readonly difficulty?: TaskDifficultyDto
}
