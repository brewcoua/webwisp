import { ApiProperty } from '@nestjs/swagger'

export class GetTraceResponseDto {
    @ApiProperty({
        description: 'Url to the trace file',
        example: '/api/local/traces/trace-1.json',
    })
    readonly url: string

    constructor(url: string) {
        this.url = url
    }
}
