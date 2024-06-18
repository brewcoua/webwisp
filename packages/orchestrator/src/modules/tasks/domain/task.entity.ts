import { ApiProperty } from '@nestjs/swagger'
import { Task } from '@webwisp/types/tasks'

export default class TaskEntity implements Task {
    @ApiProperty({
        description: 'The ID of the task',
        example: 'SRjCIwzTLvAjKMMY59MY5',
        pattern: '^[0-9A-Za-z_-]{21,22}$',
    })
    id: string

    @ApiProperty({
        description: 'Date and time the task was created',
        example: '2021-07-25T00:00:00.000Z',
        type: 'string',
    })
    createdAt: Date

    @ApiProperty({
        description: 'The URL of the target to run the task on',
        example: 'https://example.com',
    })
    target: string

    @ApiProperty({
        description: 'The prompt to use for the task',
        example: 'Check that the page loads.',
        minLength: 9,
        maxLength: 2048,
    })
    prompt: string

    constructor(id: string, date: Date, target: string, prompt: string) {
        this.id = id
        this.createdAt = date
        this.target = target
        this.prompt = prompt
    }
}
