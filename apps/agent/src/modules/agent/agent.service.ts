import { Injectable } from "@nestjs/common";
import { Agent } from "@webwisp/lib";

@Injectable()
export default class AgentService {
    private readonly agent: Agent

    constructor() {
        this.agent = new Agent()
    }

    async initialize() {
        await this.agent.initialize()
    }

    async spawnRunner(target: string, prompt: string) {
        return this.agent.spawn(target, prompt)
    }
}