import { OpenAIService } from '../services/openai.service'
import { PlaywrightService } from '../services/playwright.service'
import { Service } from '../domain/service'

import pino, { Logger } from 'pino'
import { useConfig, usePrompts } from '../hooks'
import { EventHandler } from './events'

export class Agent extends Service {
    private openai!: OpenAIService;
    private pw!: PlaywrightService;

    constructor() {
        super(
            pino({
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            }).child({ service: 'agent' }),
            "agent",
        )
    }

    async initialize() {
        this.debug('Initializing agent');

        this.openai = new OpenAIService(this.logger);
        this.pw = new PlaywrightService(this.logger);

        await Promise.all([
            this.openai.initialize(),
            this.pw.initialize()
        ]);

        this.debug('Agent initialized');
    }

    async destroy() {
        this.debug('Destroying agent');

        await Promise.all([
            this.openai.destroy(),
            this.pw.destroy()
        ]);

        this.debug('Agent destroyed');
    }

    async run() {
        this.debug('Running agent');

        const config = useConfig();

        const pageId = await this.pw.make_page(config.target);
        const thread = await this.openai.make_thread();

        const steps = config.tasks?.at(0)?.scenario[0] as string[];
        let currentStep = 0;
        while (currentStep < steps.length) {
            const step = steps[currentStep];
            this.debug(`Running step ${currentStep}: ${step}`);

            const prompt = usePrompts().user
                .join('\n')
                .replace("%%STEPS%%",
                    steps.map((s, i) => {
                        if (i === currentStep) {
                            return `${i+1}. ++${s}++`;
                        }
                        return `${i+1}. ${s}`;
                    }).join('\n')
                )

            const screenshot = await this.pw.screenshot(pageId);

            const handler = new EventHandler(this.openai, this.pw, pageId);


            currentStep++;
        }

        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });

        this.debug('Agent ran');
    }
}