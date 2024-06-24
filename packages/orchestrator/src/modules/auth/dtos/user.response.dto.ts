import { ApiProperty } from '@nestjs/swagger'
import { BaseUserProps, UserScopes } from '../domain/user.types'
import { BaseResponseProps, ResponseBase } from '@domain/api/response.base'

export default class UserResponseDto extends ResponseBase {
    @ApiProperty({
        example: 'john.doe',
        description: 'The username of the user',
    })
    username: string

    @ApiProperty({
        example: 'John Doe',
        description: 'The display name of the user',
    })
    displayName: string

    @ApiProperty({
        example: [UserScopes.VIEW],
        description: 'The scopes of the user',
        enum: UserScopes,
        enumName: 'UserScopes',
        isArray: true,
    })
    scopes: UserScopes[]

    constructor(props: BaseUserProps & BaseResponseProps) {
        super(props)
        this.username = props.username
        this.displayName = props.displayName
        this.scopes = props.scopes
    }
}
