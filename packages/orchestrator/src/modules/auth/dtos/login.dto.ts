import { ApiProperty } from '@nestjs/swagger'

export default class LoginDto {
    @ApiProperty({
        example: 'username',
        description: 'The username of the user',
    })
    username: string

    @ApiProperty({
        example: 'password',
        description: 'The password of the user',
    })
    password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }
}
