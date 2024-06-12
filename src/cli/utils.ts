import Agent from '@/Agent'

export function bindSignals(agent: Agent) {
    const terminate = async (code: number = 1) => {
        await agent.destroy()
        process.exit(code)
    }

    process.on('unhandledRejection', (reason: string) => {
        agent._logger.error(`Unhandled Rejection: ${reason}`, { reason })
        void terminate()
    })
    process.on('uncaughtException', (error) => {
        agent._logger.error(`Uncaught Exception: ${error.message}`, { error })
        void terminate()
    })
    ;['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, () => {
            agent._logger.warn(`Received signal ${signal}, terminating...`, {
                signal,
            })
            void terminate(0)
        })
    })
}
