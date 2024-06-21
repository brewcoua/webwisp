import { config } from 'dotenv'
config({
    override: true,
})

import WorkerService from './worker.service'

async function main() {
    const worker = new WorkerService()
    bindSignals(worker)
    await worker.initialize()
}

function bindSignals(worker: WorkerService) {
    process.on('SIGINT', async () => {
        await worker.close()
        process.exit(0)
    })

    process.on('SIGTERM', async () => {
        await worker.close()
        process.exit(0)
    })
    process.on('uncaughtException', async (error) => {
        console.error('Uncaught exception', error)
        await worker.close()
        process.exit(1)
    })
    process.on('unhandledRejection', async (reason) => {
        console.error('Unhandled rejection', reason)
        await worker.close()
        process.exit(1)
    })
    process.on('exit', async () => {
        await worker.close()
    })
}

main().catch(console.error)
