import { ApiProperty } from '@nestjs/swagger'
import PublicUser from '../domain/PublicUser'

export default class UserDto implements PublicUser {
    @ApiProperty({
        example: 'id',
        description: 'The user id',
    })
    id: string

    @ApiProperty({
        example: 'username',
        description: 'The user username',
    })
    username: string

    constructor(id: string, username: string) {
        this.id = id
        this.username = username
    }
}
