export interface BaseUserProps {
    username: string
    displayName: string
    scopes: UserScopes[]
}

export interface UserProps extends BaseUserProps {
    password: string
}

export interface CreateUserProps {
    username: string
    password: string
}

export enum UserScopes {
    VIEW = 'view',
    EDIT = 'edit',
}
