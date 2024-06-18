import { ApiProperty } from '@nestjs/swagger'
import { PartialTask } from '@webwisp/types/tasks'
import { IsUrl, MinLength, MaxLength } from 'class-validator'

export default class CreateTaskDto implements PartialTask {
    @IsUrl()
    @MaxLength(1024)
    @ApiProperty({
        description: 'The target URL to run the task on',
        example: 'https://example.com',
    })
    target: string

    @MinLength(9)
    @MaxLength(2048)
    @ApiProperty({
        description: 'The prompt to use for the task',
        example: 'Check that the page loads.',
    })
    prompt: string

    constructor(target: string, prompt: string) {
        this.target = target
        this.prompt = prompt
    }
}
