import { PaginatedQueryRequestDto } from '@domain/api/paginated-query.request.dto'
import {
    SortableTaskGroupFields,
    SortableTaskGroupField,
} from '../../database/models/group.model'
import { ApiProperty } from '@nestjs/swagger'

export class GetGroupsRequestDto extends PaginatedQueryRequestDto<SortableTaskGroupField> {
    @ApiProperty({
        example: SortableTaskGroupFields.name,
        description: 'The field to order by',
        required: false,
        default: SortableTaskGroupFields.name,
        enum: SortableTaskGroupFields,
    })
    readonly orderBy: SortableTaskGroupField = SortableTaskGroupFields.name
}
