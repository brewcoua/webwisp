import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'

export default class GetRunnerParams {
    @IsString()
    @Matches(/^[A-Za-z0-9_-]{21}$/)
    @ApiProperty({
        type: 'string',
        description: 'The ID of the runner.',
        example: 'V1StGXR8_Z5jdHi6B-myT',
    })
    id: string

    constructor(id: string) {
        this.id = id
    }
}
