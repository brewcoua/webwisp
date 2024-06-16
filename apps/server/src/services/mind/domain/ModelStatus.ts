export default class ModelStatus {
    private readonly type: ModelStatusType
    private readonly error?: Error

    constructor(type: ModelStatusType, error?: Error) {
        this.type = type
        this.error = error

        if (this.type === ModelStatusType.UNAUTHORIZED && !this.error) {
            throw new Error('Error must be provided for unauthorized status')
        }
    }

    public asObject(): ModelUnauthorized | ModelOther {
        if (this.type === ModelStatusType.UNAUTHORIZED) {
            return {
                type: ModelStatusType.UNAUTHORIZED,
                error: this.error!,
            }
        }
        return {
            type: this.type,
        }
    }

    public static get MISSING_MODEL(): ModelStatus {
        return new ModelStatus(ModelStatusType.MISSING_MODEL)
    }
    public static get READY(): ModelStatus {
        return new ModelStatus(ModelStatusType.READY)
    }
    public static UNAUTHORIZED(error: Error): ModelStatus {
        return new ModelStatus(ModelStatusType.UNAUTHORIZED, error)
    }
}

export enum ModelStatusType {
    UNAUTHORIZED = 'unauthorized',
    MISSING_MODEL = 'missing_model',
    READY = 'ready',
}

type ModelUnauthorized = {
    type: ModelStatusType.UNAUTHORIZED
    error: Error
}
type ModelOther = {
    type: Exclude<ModelStatusType, ModelStatusType.UNAUTHORIZED>
}
