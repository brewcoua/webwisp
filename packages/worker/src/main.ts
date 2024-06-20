import { config } from 'dotenv'
config({
    override: true,
})

import WorkerService from './worker.service'

async function main() {
    const worker = new WorkerService()
    await worker.initialize()
}

main().catch(console.error)
