import { Provider } from '@nestjs/common'

import { GetQueuedTasksHttpController } from './get-queued-tasks/get-queued-tasks.http.controller'
import { GetTaskHttpController } from './get-task/get-task.http.controller'
import { GetTasksHttpController } from './get-tasks/get-tasks.http.controller'
import { GetTraceHttpController } from './get-trace/get-trace.http.controller'
import { SubscribeHttpController } from './subscribe/subscribe.http.controller'
import { ViewerHttpController } from './viewer/viewer.http.controller'

import { GetQueuedTasksQueryHandler } from './get-queued-tasks/get-queued-tasks.query-handler'
import { GetTaskQueryHandler } from './get-task/get-task.query-handler'
import { GetTasksQueryHandler } from './get-tasks/get-tasks.query-handler'
import { GetTraceQueryHandler } from './get-trace/get-trace.query-handler'

export const QueryHttpControllers = [
    GetQueuedTasksHttpController,
    GetTaskHttpController,
    GetTasksHttpController,
    GetTraceHttpController,
    SubscribeHttpController,
    ViewerHttpController,
]

export const QueryHandlers: Provider[] = [
    GetQueuedTasksQueryHandler,
    GetTaskQueryHandler,
    GetTasksQueryHandler,
    GetTraceQueryHandler,
]
