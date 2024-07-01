import { LoginScripts } from '@modules/tasks/domain/task.types'
import {
    TaskDifficultyDto,
    TaskEvaluationConfigDto,
} from '@modules/tasks/dtos/task.eval.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
    IsEnum,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
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
        example: LoginScripts.CLASSIFIEDS,
        description: 'The login script to use for the task',
        enum: LoginScripts,
        enumName: 'LoginScripts',
    })
    @IsOptional()
    @IsString()
    @IsEnum(LoginScripts)
    readonly login_script?: LoginScripts

    @ApiProperty({
        example: '60e1c1e2c1d6b2f8b9b3b2f8',
        description: 'The correlation ID for the task',
        minLength: 24,
        maxLength: 24,
    })
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(24)
    @MaxLength(24)
    @Matches(/^[0-9a-f]{24}$/)
    readonly correlation?: string

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
