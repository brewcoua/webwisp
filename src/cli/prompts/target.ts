import { VALID_TARGET_REGEX, HTTPS_URL_REGEX } from '@/constants'
import { input } from '@inquirer/prompts'

export async function promptTarget(prefilled?: string): Promise<string> {
    if (prefilled && prefilled.trim().length > 0) {
        if (prefilled.match(VALID_TARGET_REGEX)) {
            return prefilled
        }

        throw new Error('Invalid URL, domain name, or IP address')
    }

    const target = await input({
        message: 'Target',
        validate: (input: string) => {
            if (input.match(VALID_TARGET_REGEX)) {
                return true
            }

            return 'Invalid URL, domain name, or IP address'
        },
    })

    return target
}
