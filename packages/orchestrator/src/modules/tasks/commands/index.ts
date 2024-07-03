import { Provider } from '@nestjs/common'

import { BulkTasksHttpController } from './bulk-tasks/bulk-tasks.http.controller'
import { CreateTaskHttpController } from './create-task/create-task.http.controller'
import { DeleteTaskHttpController } from './delete-task/delete-task.http.controller'
import { CreateTaskGroupHttpController } from './create-group/create-group.http.controller'

import { BulkTasksService } from './bulk-tasks/bulk-tasks.service'
import { CreateTaskService } from './create-task/create-task.service'
import { DeleteTaskService } from './delete-task/delete-task.service'
import { CreateTaskGroupService } from './create-group/create-group.service'

export const CommandHttpControllers = [
    BulkTasksHttpController,
    CreateTaskHttpController,
    DeleteTaskHttpController,

    CreateTaskGroupHttpController,
]

export const CommandHandlers: Provider[] = [
    BulkTasksService,
    CreateTaskService,
    DeleteTaskService,
    CreateTaskGroupService,
]
