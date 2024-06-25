import { CycleReport } from './task.types'

export type CycleResult = CycleSuccess | CycleActionFailed | CycleFormatFailed
export default CycleResult

export type CycleSuccess = {
    status: CycleStatus.SUCCESS
    report: CycleReport
}

export type CycleActionFailed = {
    status: CycleStatus.ACTION_FAILED
    report: CycleReport
}

export type CycleFormatFailed = {
    status: CycleStatus.FORMAT_FAILED
}

export enum CycleStatus {
    SUCCESS = 'success',
    ACTION_FAILED = 'action_fail',
    FORMAT_FAILED = 'format_fail',
}
