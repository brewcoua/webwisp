import { Provider } from '@nestjs/common'

import { USER_REPOSITORY } from '../../auth.tokens'
import UserRepository from './user.repository'

export const Repositories: Provider[] = [
    {
        provide: USER_REPOSITORY,
        useClass: UserRepository,
    },
]
