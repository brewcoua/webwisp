import { Provider } from '@nestjs/common'

import { GetTaskHttpController } from './get-task/get-task.http.controller'
import { GetTasksHttpController } from './get-tasks/get-tasks.http.controller'
import { GetTraceHttpController } from './get-trace/get-trace.http.controller'
import { SubscribeHttpController } from './subscribe/subscribe.http.controller'
import { ViewerHttpController } from './viewer/viewer.http.controller'
import { GetGroupsHttpController } from './get-groups/get-groups.http.controller'

import { GetTaskQueryHandler } from './get-task/get-task.query-handler'
import { GetTasksQueryHandler } from './get-tasks/get-tasks.query-handler'
import { GetTraceQueryHandler } from './get-trace/get-trace.query-handler'
import { GetGroupsQueryHandler } from './get-groups/get-groups.query-handler'

export const QueryHttpControllers = [
    GetTaskHttpController,
    GetTasksHttpController,
    GetTraceHttpController,
    SubscribeHttpController,
    ViewerHttpController,
    GetGroupsHttpController,
]

export const QueryHandlers: Provider[] = [
    GetTaskQueryHandler,
    GetTasksQueryHandler,
    GetTraceQueryHandler,
    GetGroupsQueryHandler,
]
