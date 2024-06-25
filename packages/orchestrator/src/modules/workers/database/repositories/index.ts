import { Provider } from '@nestjs/common'

import { WORKER_QUEUES_REPOSITORY } from '../../workers.tokens'
import WorkerQueuesRepository from './queues.repository'

export const Repositories: Provider[] = [
    {
        provide: WORKER_QUEUES_REPOSITORY,
        useClass: WorkerQueuesRepository,
    },
]
