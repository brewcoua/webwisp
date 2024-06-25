import {
    Inject,
    Logger,
    Module,
    OnApplicationBootstrap,
    Provider,
} from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { CommandBus } from '@nestjs/cqrs'

import { useEnv } from '@configs/env'
import { SignUpCommand } from './commands/signup/signup.command'
import { User, UserSchema } from './database/models/user.model'
import AuthService from './auth.service'
import AuthMapper from './auth.mapper'
import { USER_REPOSITORY } from './auth.tokens'
import { UserRepositoryPort } from './database/repositories/user.repository.port'

import { Repositories } from './database/repositories'

import { LoginHttpController } from './queries/login/login.http.controller'
import { LoginQueryHandler } from './queries/login/login.query-handler'

import { SignUpHttpController } from './commands/signup/signup.http.controller'
import { SignUpService } from './commands/signup/signup.service'

import { LocalStrategy } from './queries/login/login.strategy'
import { JwtStrategy } from './guards/jwt'

import { CurrentUserHttpController } from './queries/current-user/current-user.http.controller'
import { CurrentUserQueryHandler } from './queries/current-user/current-user.query-handler'

const HttpControllers = [
    LoginHttpController,
    SignUpHttpController,
    CurrentUserHttpController,
]

const CommandHandlers: Provider[] = [SignUpService]
const QueryHandlers: Provider[] = [LoginQueryHandler, CurrentUserQueryHandler]

const Mappers: Provider[] = [AuthMapper]
const Strategies: Provider[] = [LocalStrategy, JwtStrategy]

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: useEnv('JWT_SECRET'),
            signOptions: { expiresIn: useEnv('JWT_EXPIRES_IN') },
        }),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [...HttpControllers],
    providers: [
        AuthService,
        LocalStrategy,
        ...CommandHandlers,
        ...QueryHandlers,
        ...Mappers,
        ...Repositories,
        ...Strategies,
    ],
})
export default class AuthModule implements OnApplicationBootstrap {
    constructor(
        private readonly commandBus: CommandBus,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const defaultUser = useEnv('DEFAULT_USER'),
            defaultPassword = useEnv('DEFAULT_PASSWORD')
        if (defaultUser && defaultPassword) {
            // Check if default user already exists
            const user =
                await this.userRepository.findOneByUsername(defaultUser)
            if (!user) {
                this.commandBus.execute(
                    new SignUpCommand({
                        username: defaultUser,
                        password: defaultPassword,
                    })
                )
                Logger.log(
                    `Default user created: ${defaultUser}/********`,
                    'AuthModule'
                )
            }
        }
    }
}
