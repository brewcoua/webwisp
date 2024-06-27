import {
    ArgumentMetadata,
    BadRequestException,
    ParseArrayPipe,
} from '@nestjs/common'
import { CreateTaskRequestDto } from '../create-task/create-task.request.dto'

export class TasksArrayPipe extends ParseArrayPipe {
    private readonly min: number
    private readonly max: number

    constructor({ max = 10, min = 1 }: { max?: number; min?: number }) {
        super({
            items: CreateTaskRequestDto,
        })
        this.min = min
        this.max = max
    }

    async transform(
        value: any,
        metadata: ArgumentMetadata
    ): Promise<CreateTaskRequestDto[]> {
        const result: CreateTaskRequestDto[] = await super.transform(
            value,
            metadata
        )
        if (result.length > this.max) {
            throw new BadRequestException(
                `Maximum tasks allowed are ${this.max}`
            )
        } else if (result.length < this.min) {
            throw new BadRequestException(
                `Minimum tasks allowed are ${this.min}`
            )
        }
        return result
    }
}
