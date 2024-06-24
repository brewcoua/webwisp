import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { ValidationOptions } from '@configs/app.const'

export class LoginRequestDto {
    @ApiProperty({
        example: 'john.doe',
        description: 'The username of the user',
        minLength: ValidationOptions.username.minLength,
        maxLength: ValidationOptions.username.maxLength,
        pattern: ValidationOptions.username.match?.toString(),
    })
    @MinLength(ValidationOptions.username.minLength || 0)
    @MaxLength(ValidationOptions.username.maxLength || 0)
    @Matches(ValidationOptions.username.match || /.*/, {
        message: 'Invalid username',
    })
    @IsString()
    readonly username!: string

    @ApiProperty({
        example: 'password',
        description: 'The password of the user',
        minLength: ValidationOptions.password.minLength,
        maxLength: ValidationOptions.password.maxLength,
    })
    @IsString()
    @MinLength(ValidationOptions.password.minLength || 0)
    @MaxLength(ValidationOptions.password.maxLength || 0)
    readonly password!: string
}
