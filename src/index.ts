import { Agent } from './agent'

function terminate(agent: Agent) {
    (async () => {
        await agent.destroy();
        process.exit(1);
    })();
}

async function init() {
    const agent = new Agent();
    await agent.initialize();

    process.on('unhandledRejection', (reason, promise) => {
        agent.error(reason, `Unhandled Rejection at Promise: ${promise}`);
        terminate(agent);
    });
    process.on('uncaughtException', error => {
        agent.error(error, 'Uncaught Exception thrown');
        terminate(agent);
    });

    ['SIGHUP', 'SIGINT', 'SIGKILL', 'SIGQUIT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
            agent.warn(`Received ${signal}, shutting down`);
            terminate(agent);
        });
    });

    await agent.run();

    await agent.destroy();
}

init()
