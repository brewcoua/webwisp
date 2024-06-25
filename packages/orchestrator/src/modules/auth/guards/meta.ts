import { SetMetadata } from '@nestjs/common'
import { UserScopes } from '../domain/user.types'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const SCOPES_KEY = 'hasScope'
export const Scopes = (scope: UserScopes | UserScopes[]) =>
    SetMetadata(SCOPES_KEY, scope)
