import ActionReport from '../types/ActionReport'
import TaskResult from './TaskResult'
import PartialRunner from './PartialRunner'

export default interface Runner extends PartialRunner {
    actions: ActionReport[]
    result?: TaskResult
}
