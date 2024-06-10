import chalk from 'chalk'

export default class WebwispError extends Error {
    private context: Error | null = null

    constructor(message: string) {
        super(message)
        this.name = 'WebwispError'
    }

    public withContext(context: Error): WebwispError {
        this.context = context
        return this
    }
    public getContext(): Error | null {
        return this.context
    }

    public get full(): string {
        const message = [
            `${chalk.red.bold(`${this.name}:`)} ${chalk.whiteBright(this.message)}`,
        ]

        if (this.context) {
            message.push(chalk.red.italic('Caused by:'))

            const contexts = [this.context]
            let currentContext = this.context
            while (
                currentContext instanceof WebwispError &&
                currentContext.getContext()
            ) {
                const context = currentContext.getContext() as Error

                contexts.push(context)
                currentContext = context
            }

            for (const context of contexts) {
                message.push(
                    `\t${chalk.red(
                        `${context.name}:`
                    )} ${chalk.white(context.message)}`
                )
            }
        }

        // Add stack trace
        message.push(
            chalk.gray.italic(this.stack?.split('\n').slice(1).join('\n')) || ''
        )

        return message.join('\n')
    }
}
