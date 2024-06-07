import Action from '../services/runner/domain/Action'

export type Completion = {
    reasoning?: string
    action: Action
}

export default Completion
