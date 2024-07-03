import { Provider } from '@nestjs/common'

import {
    TASK_GROUP_REPOSITORY,
    TASK_QUEUES_REPOSITORY,
    TASK_REPOSITORY,
    TRACES_REPOSITORY,
} from '../../tasks.tokens'
import TaskRepository from './task.repository'
import TaskQueuesRepository from './queues.repository'
import { TracesRepository } from './traces.repository'
import TaskGroupRepository from './group.repository'

export const Repositories: Provider[] = [
    {
        provide: TASK_REPOSITORY,
        useClass: TaskRepository,
    },
    {
        provide: TASK_QUEUES_REPOSITORY,
        useClass: TaskQueuesRepository,
    },
    {
        provide: TRACES_REPOSITORY,
        useClass: TracesRepository,
    },
    {
        provide: TASK_GROUP_REPOSITORY,
        useClass: TaskGroupRepository,
    },
]
