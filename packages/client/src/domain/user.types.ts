export interface UserProps {
    id: string
    username: string
    displayName: string
    scopes: UserScopes[]
}

export enum UserScopes {
    VIEW = 'view',
    EDIT = 'edit',
}
