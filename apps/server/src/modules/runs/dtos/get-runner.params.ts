import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export default class GetRunnerParams {
    @IsNumberString()
    @ApiProperty({
        type: 'number',
        description: 'The ID of the runner.',
        example: 1
    })
    id: number

    constructor(id: number) {
        this.id = id
    }
}