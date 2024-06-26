import { PaginatedResponseDto } from '@domain/api/paginated.response.base'
import TaskResponseDto from './task.response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class TaskPaginatedResponseDto extends PaginatedResponseDto<TaskResponseDto> {
    @ApiProperty({
        type: TaskResponseDto,
        isArray: true,
        description: 'Tasks list',
    })
    readonly data: readonly TaskResponseDto[]

    constructor(props: TaskPaginatedResponseDto) {
        super(props)
        this.data = props.data
    }
}
