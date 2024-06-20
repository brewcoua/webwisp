import ActionReport from '@domain/ActionReport'
import CycleStatus from './CycleStatus'

export type CycleResult = CycleSuccess | CycleActionFailed | CycleFormatFailed
export default CycleResult

export type CycleSuccess = {
    status: CycleStatus.SUCCESS
    report: ActionReport
}

export type CycleActionFailed = {
    status: CycleStatus.ACTION_FAILED
    report: ActionReport
}

export type CycleFormatFailed = {
    status: CycleStatus.FORMAT_FAILED
}
