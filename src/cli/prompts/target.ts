import { VALID_TARGET_REGEX, HTTPS_URL_REGEX } from '@/constants'
import { input } from '@inquirer/prompts'

export async function promptTarget(prefilled?: string): Promise<string> {
    if (prefilled && prefilled.trim().length > 0) {
        // Validate
        if (prefilled.match(VALID_TARGET_REGEX)) {
            if (prefilled.match(/^https?:\/\//i)) {
                return prefilled
            }

            if (prefilled.match(HTTPS_URL_REGEX)) {
                return `https://${prefilled}`
            }

            return `http://${prefilled}`
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
        transformer: (input: string) => {
            // If it starts with http or https, return as is
            if (input.match(/^https?:\/\//i)) {
                return input
            }

            if (input.match(HTTPS_URL_REGEX)) {
                return `https://${input}`
            }

            return `http://${input}`
        },
    })

    if (target.match(/^https?:\/\//i)) {
        return target
    }

    if (target.match(HTTPS_URL_REGEX)) {
        return `https://${target}`
    }

    return `http://${target}`
}
