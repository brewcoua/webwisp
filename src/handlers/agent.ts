import { BrowserHandler } from './browser'
import { useConfig } from '../config'
import { OpenAIHandler } from './openai'
import { PROMPT, PROMPTS } from '../prompts'

export class Agent {
    private static instance: Agent
    private browser: BrowserHandler
    private openai: OpenAIHandler

    private constructor(browser: BrowserHandler, openai: OpenAIHandler) {
        this.browser = browser
        this.openai = openai
    }

    public static async getInstance(): Promise<Agent> {
        if (!this.instance) {
            const params = await this._init()
            this.instance = new Agent(...params)
        }

        return this.instance
    }

    private static async _init(): Promise<[BrowserHandler, OpenAIHandler]> {
        const browser = await BrowserHandler.getInstance()
        const openai = await OpenAIHandler.getInstance()

        return [browser, openai]
    }

    private async wait(time: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, time)
        })
    }

    async run() {
        const config = useConfig();

        await this.browser.goto(config.target);

        const steps = config.tasks?.at(0)?.scenario[0] as string[];

        const formatSteps = (steps: string[], current: number) => {
            return steps.map((step, index) => {
                if (index === current) {
                    return `${index + 1}. ++${step}++`
                } else {
                    return `${index + 1}. ${step}`
                }
            });
        }

        const thread = await this.openai.makeThread();

        const formattedPrompt = PROMPT.replace("%%STEPS%%", formatSteps(steps, 0).join("\n"));

        const screenshot = await this.browser.screenshot();

        const message = await this.openai.makeMessage(thread.id, formattedPrompt, screenshot);

        console.log(message);

        let run = await this.openai.startRun(thread.id);

        console.log(run);

        const messages = await this.openai.getMessages(thread.id);
        messages.data.reverse().forEach((message) => {
            const content = message.content.filter((content) => content.type === 'text')
                .map((content) => (content as any).text).join("\n");
            console.log(`[${message.created_at}| ${message.role}] ${content}`);
        });

        if (run.status !== 'completed') {
            await this.openai.cancelRun(thread.id, run.id);
        }
        await this.openai.deleteThread(thread.id);

        await this.browser.close();
        await this.openai.close();
    }
}