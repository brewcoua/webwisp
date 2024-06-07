import Action from '@/services/runner/domain/Action'

export type GenerationResult<ModelMeta> = (
    | GenerationResultSuccess
    | GenerationResultFailed
) & {
    meta?: ModelMeta
}

export type GenerationResultSuccess = {
    status: GenerationStatus.Success
    action: Action
    reasoning?: string
}

export type GenerationResultFailed = {
    status: GenerationStatus.Failed | GenerationStatus.Invalid
}

export enum GenerationStatus {
    Success = 'success',
    Failed = 'failed',
    Invalid = 'invalid',
}
