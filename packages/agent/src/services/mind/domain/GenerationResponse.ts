export type GenerationResponse<ModelMeta> = (
    | GenerationResponseSuccess
    | GenerationResponseFailure
) & {
    meta?: ModelMeta
}
export default GenerationResponse

export type GenerationResponseSuccess = {
    success: true
    result: string
}

export type GenerationResponseFailure = {
    success: false
    error: string
}
