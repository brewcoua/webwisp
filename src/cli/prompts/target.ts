import { input } from '@inquirer/prompts'

export async function promptTarget(prefilled?: string): Promise<string> {
    if (prefilled && prefilled.trim().length > 0) {
        try {
            const url = new URL(prefilled)
            return url.href
        } catch (err) {
            throw new Error('Invalid URL, domain name, or IP address')
        }
    }

    const target = await input({
        message: 'Target',
        validate: (input: string) => {
            try {
                new URL(input)
                return true
            } catch (err) {
                return 'Invalid URL, domain name, or IP address'
            }
        },
    })

    return new URL(target).href
}
