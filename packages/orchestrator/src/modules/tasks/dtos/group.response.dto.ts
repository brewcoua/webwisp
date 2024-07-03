import { ApiProperty } from '@nestjs/swagger'

import { BaseResponseProps, ResponseBase } from '@domain/api/response.base'
import { TaskGroupProps } from '../domain/group.types'

export default class TaskGroupResponseDto
    extends ResponseBase
    implements TaskGroupProps
{
    @ApiProperty({
        example: 'Group 1',
        description: 'The name of the group',
    })
    readonly name: string

    constructor(props: TaskGroupProps & BaseResponseProps) {
        super(props)
        this.name = props.name
    }
}
