import { CreateTaskProps } from '@domain/task.types'

export abstract class DataEntity<DataFormat> {
    constructor(
        public readonly id: string,
        protected readonly props: DataFormat
    ) {}

    public getProps(): DataFormat {
        return Object.freeze({
            ...this.props,
        })
    }

    public getProp<K extends keyof DataFormat>(key: K): DataFormat[K] {
        return this.props[key]
    }

    isFiltered(): boolean {
        return false
    }
    abstract toTask(): CreateTaskProps
}
