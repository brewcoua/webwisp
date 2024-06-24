import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator'

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
}
