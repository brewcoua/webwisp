import { ScenarioBase } from '@domain/logic/scenario.base'

import {
    VisualWebArenaData,
    VisualWebArenaDataset,
} from '../../datasets/vwa.dataset'
import { VWAClassifiedsEntity } from './vwa-classifieds.entity'
import { CreateTaskProps } from '@domain/task.types'

export class VWAClassifiedsScenario extends ScenarioBase<
    VisualWebArenaData,
    VWAClassifiedsEntity,
    VisualWebArenaDataset
> {
    public entities: VWAClassifiedsEntity[] = []

    constructor() {
        super({
            id: 'vwa-classified',
            name: 'VWA Classified',
            properties: {
                filters: {
                    site: 'classifieds',
                    evals: ['url_match', 'program_html'].join(', '),
                },
            },
            dataset: new VisualWebArenaDataset(),
        })
    }

    async initialize(): Promise<void> {
        const data = await this.dataset.getDataset()

        this.entities = data
            .map((item) => new VWAClassifiedsEntity(item))
            .filter((entity) => !entity.isFiltered())
    }

    toTasks(): CreateTaskProps[] {
        return this.entities.map((entity) => entity.toTask())
    }
}
