import { ApiProperty } from '@nestjs/swagger'
import { CreateRunner } from '@webwisp/types'
import { IsUrl, MinLength, MaxLength } from 'class-validator'

export default class CreateRunnerDto implements CreateRunner {
    @IsUrl()
    @MaxLength(1024)
    @ApiProperty({
        description: 'The target URL to run the agent on',
        example: 'https://example.com',
    })
    target: string
    
    @MinLength(9)
    @MaxLength(2048)
    @ApiProperty({
        description: 'The prompt to use for the agent',
        example: 'Check that the page loads.',
    })
    prompt: string

    constructor(target: string, prompt: string) {
        this.target = target
        this.prompt = prompt
    }
}
