import { PaginatedResponseDto } from '@domain/api/paginated.response.base'
import TaskGroupResponseDto from './group.response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class TaskGroupPaginatedResponseDto extends PaginatedResponseDto<TaskGroupResponseDto> {
    @ApiProperty({
        type: TaskGroupResponseDto,
        isArray: true,
        description: 'The list of task groups',
    })
    readonly data: readonly TaskGroupResponseDto[]

    constructor(props: TaskGroupPaginatedResponseDto) {
        super(props)
        this.data = props.data
    }
}
