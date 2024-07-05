import { CreateTaskProps } from '../task.types'
import { DatasetBase } from './dataset.base'
import { DataEntity } from './data.entity'

export interface ScenarioBaseProps<T, Dataset extends DatasetBase<T>> {
    id: string
    name: string
    dataset: Dataset
    properties: {
        // This is for visual purposes only, the logic should be in the scenario class
        filters?: Record<string, string>
    }
}

export abstract class ScenarioBase<
    Data,
    Entity extends DataEntity<Data>,
    Dataset extends DatasetBase<Data>,
> {
    public readonly id: string
    public readonly name: string
    public readonly properties: ScenarioBaseProps<Data, Dataset>['properties']
    public readonly dataset: Dataset
    public abstract entities: Entity[]

    constructor(props: ScenarioBaseProps<Data, Dataset>) {
        this.id = props.id
        this.name = props.name
        this.properties = props.properties
        this.dataset = props.dataset
    }

    public clear(): void {
        this.entities = []
    }

    abstract initialize(): Promise<void>
    abstract toTasks(): CreateTaskProps[]
}
