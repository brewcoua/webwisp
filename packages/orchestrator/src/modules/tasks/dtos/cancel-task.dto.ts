import { IsString, Matches } from 'class-validator'

export default class CancelTaskDto {
    @IsString()
    @Matches(/^[0-9A-Za-z_-]{21,22}$/) // nanoid
    id: string

    constructor(id: string) {
        this.id = id
    }
}
