import { IsString, Matches } from 'class-validator'

export class GetTaskRequestDto {
    @IsString()
    @Matches(/^[0-9a-fA-F]{24}$/)
    readonly id!: string
}
