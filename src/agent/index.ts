import { OpenAIService } from '../services/openai.service'
import { PlaywrightService } from '../services/playwright.service'
import { Service } from '../domain/service'

import pino, { Logger } from 'pino'
import { useConfig, usePrompts } from '../hooks'
import { RunStreamHandler } from './events'

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

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async run() {
        this.debug('Running agent');

        const config = useConfig();

        const pageId = await this.pw.make_page(config.target);

        const thread = await this.openai.make_thread();

        const seenMessages = new Set<string>();

        const url = await this.pw.url(pageId);

        const steps = config.tasks?.at(0)?.scenario[0] as string[];
        let currentStep = 0;
        while (currentStep < steps.length) {
            const step = steps[currentStep];
            this.info(`Step ${currentStep}: ${step}`);

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
                .replace("%%URL%%", url);

            const screenshotPath = `dist/run/${currentStep}.png`;
            await this.pw.screenshot(pageId, screenshotPath);

            const fileId = await this.openai.upload_file(thread.id, screenshotPath);

            // Add message to thread
            const message = await this.openai.add_message(thread.id, {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: prompt,
                    },
                    {
                        type: 'image_file',
                        image_file: {
                            file_id: fileId,
                            detail: 'low'
                        }
                    }
                ]
            })

            // Launch run on thread
            const handler = new RunStreamHandler(this.openai, this.pw, pageId);
            const stream = await this.openai.stream_run(thread.id);
            this.debug('Stream run started');
            for await (const event of stream) {
                handler.emit('event', event);
            }

            // Wait till run is done
            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (handler.done) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 1000);
            });

            currentStep++;

            // Output messages in console
            const messages = await this.openai.list_messages(thread.id);
            for (const message of messages.data.reverse()) {
                if (!seenMessages.has(message.id)) {
                    seenMessages.add(message.id);
                    this.info(null, `[${message.role}] ${message.content.map((content) =>
                        content.type === 'text' ? content.text.value : `[${content.type}]`
                    ).join('\n')}`);
                }
            }

            // Delete user message (with image file) to avoid overwhelming context
            await this.openai.delete_message(thread.id, message.id);

            await this.sleep(5000);
        }

        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });

        this.debug('Agent ran');
    }
}