import Agent from '@/Agent'
import Logger from '@/logger'

export function bindSignals(agent: Agent) {
    const terminate = async (code: number = 1) => {
        await agent.destroy()
        process.exit(code)
    }

    process.on('unhandledRejection', (reason: string) => {
        Logger.error(`Unhandled Rejection: ${reason}`)
        void terminate()
    })
    process.on('uncaughtException', (error) => {
        Logger.error(`Uncaught Exception: ${error.message}`)
        void terminate()
    })
    ;['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, () => {
            Logger.warn(`Received ${signal}, shutting down`)
            void terminate(0)
        })
    })
}
