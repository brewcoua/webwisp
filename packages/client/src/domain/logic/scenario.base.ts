import { useClient } from '@api/client'
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

    public async launch(id: string): Promise<void> {
        console.log(`Launching scenario ${this.name} with id ${id}`)

        const client = useClient()
        const task = this.entities.find((entity) => entity.id === id)?.toTask()

        if (!task) {
            throw new Error(`Task with id ${id} not found`)
        }

        await client.tasks.createTask(task)

        console.log(`Scenario ${this.name} launched`)
    }

    public async bulk(count?: number): Promise<void> {
        console.log(`Launching scenario ${this.name} as bulk`)

        // We'll send tasks in bulk of 30 tasks
        const bulkSize = 30
        const client = useClient()

        if (!this.entities.length) {
            await this.initialize()
        }

        let tasks = this.toTasks()
        if (count) {
            tasks = tasks.slice(0, count)
        }

        const correlation = await client.tasks.getCorrelation()
        if (correlation) {
            tasks = tasks.map((task) => ({ ...task, correlation }))
        }

        for (let i = 0; i < tasks.length; i += bulkSize) {
            const bulk = tasks.slice(i, i + bulkSize)

            console.log(
                `Sending bulk of ${bulk.length} tasks with correlation ${correlation}`
            )
            console.log(bulk)

            await client.tasks.bulkTasks(bulk)
        }

        console.log(`Scenario ${this.name} launched`)
    }

    public clear(): void {
        this.entities = []
    }

    abstract initialize(): Promise<void>
    abstract toTasks(): CreateTaskProps[]
}
