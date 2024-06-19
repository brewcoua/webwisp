import AbstractAction from '@domain/AbstractAction'
import { AbstractArgumentType } from '@domain/AbstractArgument'
import ActionType from '@domain/ActionType'

const config: RunnerConfig = {
    cycles: {
        max: 10,
        failed: 3,
        format: 3,
    },
    actions: {
        click: {
            description: 'Click on an element on the page.',
            example: 'click 3',
            arguments: [
                {
                    name: 'label',
                    type: AbstractArgumentType.Number,
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
                    type: AbstractArgumentType.Number,
                    required: true,
                },
                {
                    name: 'text',
                    type: AbstractArgumentType.String,
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
                    type: AbstractArgumentType.String,
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
                    type: AbstractArgumentType.String,
                    enum: ['success', 'failure'],
                    required: true,
                },
                {
                    name: 'reason',
                    type: AbstractArgumentType.String,
                    required: true,
                },
                {
                    name: 'value',
                    type: AbstractArgumentType.String,
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
        max: IntRange<1, 100>
        /** Maximum number of failed cycles before stopping the task. (e.g. 3, means if 3 cycles fail, the task is stopped) */
        failed: IntRange<1, 10>
        /** Maximum number of retries for format errors (e.g. model not following the format, leading to parsing errors) */
        format: IntRange<1, 10>
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
