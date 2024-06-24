import {
    BadRequestException,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { LoginRequestDto } from './login.request.dto'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()

        const body = plainToInstance(LoginRequestDto, request.body)
        const errors = await validate(body)
        const errorMessages: string[] = errors.flatMap(({ constraints }: any) =>
            Object.values(constraints)
        )

        if (errorMessages.length > 0) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: errorMessages,
                error: 'Bad Request',
            })
        }

        const result = (await super.canActivate(context)) as boolean

        return result
    }
}
