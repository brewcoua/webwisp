import { Agent } from './agent'

async function init() {
    const agent = new Agent();
    await agent.initialize();

    await agent.run();

    await agent.destroy();
}

init()
