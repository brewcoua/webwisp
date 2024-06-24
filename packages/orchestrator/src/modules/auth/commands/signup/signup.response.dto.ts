import { AggregateID } from '@domain/ddd/entity.base'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpResponseDto {
    @ApiProperty({
        example: '60e1c1e2c1d6b2f8b9b3b2f8',
        description: 'The id of the user created',
    })
    readonly id: AggregateID

    constructor(props: { id: AggregateID }) {
        this.id = props.id
    }
}
