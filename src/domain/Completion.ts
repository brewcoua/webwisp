import CalledAction from './CalledAction'

export type Completion = {
    reasoning?: string
    action: CalledAction
}

export default Completion
