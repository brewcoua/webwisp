import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'

export default class TaskIdDto {
    @ApiProperty({
        description: 'The ID of the task',
        example: 'SRjCIwzTLvAjKMMY59MY5',
        pattern: '^[0-9A-Za-z_-]{21,22}$',
    })
    @IsString()
    @Matches(/^[0-9A-Za-z_-]{21,22}$/)
    id: string

    constructor(id: string) {
        this.id = id
    }
}
