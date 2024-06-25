import {
    AbstractAction,
    AbstractArgumentType,
} from '@domain/action.abstract-types'
import { ActionType } from '@domain/action.types'

const config: RunnerConfig = {
    cycles: {
        total: 10,
        failed: {
            total: 5,
            action: 3,
            format: 3,
        },
    },
    actions: {
        click: {
            description: 'Click on an element on the page.',
            example: 'click 3',
            arguments: [
                {
                    name: 'label',
                    type: AbstractArgumentType.NUMBER,
                    required: true,
                },
            ],
        },
        type: {
            description:
                'Type text into an editable, striped, element on the page.',
            example: 'type 3 "Hello, World!"',
            arguments: [
                {
                    name: 'label',
                    type: AbstractArgumentType.NUMBER,
                    required: true,
                },
                {
                    name: 'text',
                    type: AbstractArgumentType.STRING,
                    required: true,
                },
            ],
        },
        press_enter: {
            description:
                'Press the enter key on the keyboard. This does not type anything and may be used to submit forms.',
            example: 'press_enter',
        },
        scroll: {
            description:
                'Scroll the page up or down, for 2/3 of the viewport height.',
            arguments: [
                {
                    name: 'direction',
                    type: AbstractArgumentType.STRING,
                    enum: ['up', 'down'],
                    required: true,
                },
            ],
            example: 'scroll up',
        },
        back: {
            description: 'Go back to the previous page in the browser history.',
            example: 'back',
        },
        forward: {
            description:
                'Go forward to the next page in the browser history. This requires going back first.',
            example: 'forward',
        },
        done: {
            description:
                'End the task and give the final verdict on the task completion',
            example: 'done success "Name is found in the page"',
            arguments: [
                {
                    name: 'status',
                    type: AbstractArgumentType.STRING,
                    enum: ['success', 'failure'],
                    required: true,
                },
                {
                    name: 'reason',
                    type: AbstractArgumentType.STRING,
                    required: true,
                },
                {
                    name: 'value',
                    type: AbstractArgumentType.STRING,
                    required: false,
                },
            ],
        },
    },
}
export default config

/**
 * Runner configuration
 */
export type RunnerConfig = {
    /** Delay between each cycle in millisecds */
    delay?: number
    /** Settings related to the number of cycles to run for a task */
    cycles: {
        /** Maximum number of cycles to run for a task, regardless of success. (e.g. 10, means a maximum of 10 actions for a task) */
        total: IntRange<1, 100>
        failed: {
            /** Maximum number of failed cycles before the task is considered failed */
            total: IntRange<1, 100>
            /** Maximum number of failed actions before the task is considered failed */
            action: IntRange<1, 10>
            /** Maximum number of failed formats before the task is considered failed */
            format: IntRange<1, 10>
        }
    }
    /** Definitions of actions that can be performed */
    actions: {
        [key in ActionType]: AbstractAction
    }
}

declare global {
    type Enumerate<
        N extends number,
        Acc extends number[] = [],
    > = Acc['length'] extends N
        ? Acc[number]
        : Enumerate<N, [...Acc, Acc['length']]>

    type IntRange<F extends number, T extends number> = Exclude<
        Enumerate<T>,
        Enumerate<F>
    >
}
