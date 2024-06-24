import { Provider } from '@nestjs/common'

import { TASK_QUEUES_REPOSITORY, TASK_REPOSITORY } from '../../tasks.tokens'
import TaskRepository from './task.repository'
import TaskQueuesRepository from './queues.repository'

export const Repositories: Provider[] = [
    {
        provide: TASK_REPOSITORY,
        useClass: TaskRepository,
    },
    {
        provide: TASK_QUEUES_REPOSITORY,
        useClass: TaskQueuesRepository,
    },
]
