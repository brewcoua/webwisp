import { EnvVars } from './env'

export type EnvVar =
    | {
          name: string
          required?: boolean // default: true
          type?: EnvVarType // default: 'string'
      }
    | string

type EnvVarType = 'string' | 'number' | 'boolean'

type ExtractEnvVarNames<T extends readonly EnvVar[]> = {
    [K in keyof T]: T[K] extends { name: infer N } ? N : T[K]
}[number]

export type EnvVarNames = ExtractEnvVarNames<typeof EnvVars>

type ExtractEnvVarType2<T> = T extends { type: 'number' }
    ? number
    : T extends { type: 'boolean' }
      ? boolean
      : string

type ExtractEnvVarType<T extends readonly EnvVar[], K extends string> = {
    [P in keyof T]: T[P] extends { name: K }
        ? ExtractEnvVarType2<T[P]>
        : T[P] extends K
          ? string
          : never
}[number]

type EnvVarFromName<T extends readonly EnvVar[], K extends string> = {
    [P in keyof T]: T[P] extends { name: K }
        ? T[P]
        : T[P] extends K
          ? { name: K }
          : never
}[number]

type ExtractEnvVarTypes<T extends readonly EnvVar[]> = {
    [K in EnvVarNames]: EnvVarFromName<T, K> extends {
        required: false
    }
        ? ExtractEnvVarType<T, K> | undefined
        : ExtractEnvVarType<T, K>
}

export type TypedEnv = ExtractEnvVarTypes<typeof EnvVars>
export type Env = {
    [K in EnvVarNames]: EnvVarFromName<typeof EnvVars, K> extends {
        required: false
    }
        ? string | undefined
        : string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}
