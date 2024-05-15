import { Agent } from './agent'

async function init() {
    const agent = await Agent.getInstance();

    // Wait for terminal interaction before starting
    console.log('Press any key to start');
    process.stdin.setRawMode(true);
    process.stdin.resume();

    await agent.run();
}

init()
