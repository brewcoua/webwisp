import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateTaskGroupRequestDto {
    @ApiProperty({
        example: 'Group 1',
        description: 'The name of the group',
        minLength: 6,
        maxLength: 512,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(512)
    readonly name!: string
}
