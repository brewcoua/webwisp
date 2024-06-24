import { Params } from '@domain/ddd'
import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
    @ApiProperty({
        example: 'eyJhbGcidsdjshEodlpokiezjaiw',
        description: 'The JWT access token',
    })
    readonly access_token: string

    constructor(props: Params<LoginResponseDto>) {
        this.access_token = props.access_token
    }
}
