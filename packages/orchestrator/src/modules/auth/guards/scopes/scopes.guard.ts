import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

import { SCOPES_KEY } from '../meta'
import { UserScopes } from '../../domain/user.types'
import UserEntity from '../../domain/user.entity'

@Injectable()
export default class ScopesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredScopes = this.reflector.getAllAndOverride<
            UserScopes | UserScopes[]
        >(SCOPES_KEY, [context.getHandler(), context.getClass()])

        if (!requiredScopes) {
            return true
        }

        const { user } = context.switchToHttp().getRequest()
        if (!user) {
            return false
        }

        const props = (user as UserEntity).getProps()

        if (Array.isArray(requiredScopes)) {
            return requiredScopes.every((scope) => props.scopes.includes(scope))
        }
        return props.scopes.includes(requiredScopes)
    }
}
