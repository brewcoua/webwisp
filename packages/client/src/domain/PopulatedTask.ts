import ActionReport from './ActionReport'
import { Task } from './Task'

export default interface PopulatedTask extends Task {
    actions: ActionReport[]
}
