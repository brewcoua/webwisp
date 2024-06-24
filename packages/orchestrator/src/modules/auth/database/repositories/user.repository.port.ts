import { RepositoryPort } from '@domain/ddd'
import UserEntity from '@modules/auth/domain/user.entity'

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
    findOneByUsername(username: string): Promise<UserEntity | null>
}
