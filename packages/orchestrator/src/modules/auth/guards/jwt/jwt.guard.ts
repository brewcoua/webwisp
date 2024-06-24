import { ExecutionContext, Injectable, Type, mixin } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard, IAuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from '../public.guard'
import { UserScopes } from '../../domain/user.types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (isPublic) {
            return true
        }

        if (!super.canActivate(context)) {
            return false
        }

        return true
    }
}

export const ScopedJwtAuthGuard = (scope?: UserScopes): Type<IAuthGuard> => {
    @Injectable()
    class ScopedGuard extends AuthGuard('jwt') {
        private readonly scope = scope
        constructor(private readonly reflector: Reflector) {
            super()
        }

        canActivate(context: ExecutionContext) {
            const isPublic = this.reflector.getAllAndOverride<boolean>(
                IS_PUBLIC_KEY,
                [context.getHandler(), context.getClass()]
            )

            if (isPublic) {
                return true
            }

            if (!super.canActivate(context)) {
                return false
            }

            if (this.scope) {
                const { user } = context.switchToHttp().getRequest()
                if (!user || !user.scopes.includes(this.scope)) {
                    return false
                }
            }

            return true
        }
    }

    return mixin(ScopedGuard)
}
