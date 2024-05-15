import { Agent } from './handlers/agent'

async function init() {
    const agent = await Agent.getInstance();
    await agent.run();
}

init()
