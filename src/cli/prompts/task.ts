import { input } from '@inquirer/prompts'
import { promptVoice } from './voice'

export async function promptTask(
    prefilled?: string,
    voice?: boolean
): Promise<string> {
    if (prefilled && prefilled.trim().length > 0) {
        if (prefilled.split(' ').length >= 3) {
            return prefilled
        }

        throw new Error('Task must have at least 3 words')
    }

    if (voice) {
        return await promptVoice()
    }

    return input({
        message: 'Task',
        validate: (input: string) => {
            // Check that task must have a few words
            if (input.split(' ').length >= 3) {
                return true
            }

            return 'Task must have at least 3 words'
        },
    })
}
