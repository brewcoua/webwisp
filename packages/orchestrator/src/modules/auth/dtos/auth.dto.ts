import { ApiProperty } from '@nestjs/swagger'

export default class AuthDto {
    @ApiProperty({
        example: 'access_token',
        description: 'The jwt access token',
    })
    access_token: string

    constructor(access_token: string) {
        this.access_token = access_token
    }
}
