import { useClient } from '@api/client'
import { CreateTaskProps } from './task.types'
import { DatasetBase } from './dataset.base'

export interface ScenarioBaseProps<Dataset extends DatasetBase<any>> {
    id: string
    name: string
    dataset: Dataset
    properties: {
        // This is for visual purposes only, the logic should be in the scenario class
        filters?: Record<string, string>
    }
}

export abstract class ScenarioBase<Dataset extends DatasetBase<any>> {
    public readonly id: string
    public readonly name: string
    public readonly properties: ScenarioBaseProps<Dataset>['properties']
    public readonly dataset: Dataset

    constructor(props: ScenarioBaseProps<Dataset>) {
        this.id = props.id
        this.name = props.name
        this.properties = props.properties
        this.dataset = props.dataset
    }

    public async launch(count?: number): Promise<void> {
        console.log(`Launching scenario ${this.name}`)

        // We'll send tasks in bulk of 30 tasks
        const bulkSize = 30
        const client = useClient()

        let tasks = await this.load()
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

    public async getTasksCount(): Promise<number> {
        const tasks = await this.load()
        return tasks.length
    }

    abstract load(): Promise<CreateTaskProps[]>
}
