import { EventEmitter } from 'node:events'
import OpenAI from 'openai'
import { ClickableElement, PlaywrightService } from '../services/Playwright.service'
import { match } from 'oxide.ts'

export enum CompletionStreamEvent {
    Chunk = 'chunk',
    Completed = 'completed',
}

/**
 * Data emitted when a completion stream is done
 * @property reason The reason the completion stream finished
 * @property message The generated message
 * @property tool_outputs The outputs of the tools called by the model
 * @property usage The usage of the completion
 */
export type CompletionStreamData = {
    // The reason the completion stream finished
    reason: OpenAI.ChatCompletionChunk.Choice['finish_reason'],
    // The generated message
    message: string,
    // The outputs of the tools called by the model
    tool_outputs: OpenAI.ChatCompletionMessageParam[],
    // The usage of the completion
    usage: OpenAI.CompletionUsage | null,
}

export class CompletionStreamHandler extends EventEmitter {
    private message_buffer: string = ''
    private tool_call = {
        id: '',
        name: '',
        buffer: '',
    }
    private tool_outputs: OpenAI.ChatCompletionMessageParam[] = []
    private usage: OpenAI.CompletionUsage | null = null
    private ongoing_events = 0

    constructor(private pw: PlaywrightService, private pageId: number) {
        super()
        this.on(CompletionStreamEvent.Chunk, this.onChunk)
    }

    /**
     * Handle a completion chunk from an ongoing completion stream
     * @param chunk The completion chunk
     */
    public async onChunk(chunk: OpenAI.ChatCompletionChunk) {
        if (chunk.usage) {
            this.usage = chunk.usage
        }

        if (chunk.choices.length === 0) {
            this.pw.warn('No choices in completion chunk')
            return
        }

        this.ongoing_events += 1

        const choice = chunk.choices[0]
        const delta = choice.delta

        if (delta.content) {
            this.message_buffer += delta.content
        }

        if (delta.tool_calls) {
            const ToolMap: Record<string, (params: any) => Promise<string>> = {
                click: async (params: any) => this.click(params),
                type: async (params: any) => this.type(params),
            }

            const outputs = (await Promise.all(
                delta.tool_calls.map(async (tool_call) => {
                    if (tool_call.id) {
                        this.tool_call.id = tool_call.id
                    }
                    if (tool_call.function?.name) {
                        this.tool_call.name = tool_call.function.name
                    }

                    this.tool_call.buffer += tool_call?.function?.arguments || ''

                    try {
                        const args = JSON.parse(this.tool_call.buffer)

                        const tool = ToolMap[this.tool_call.name]
                        if (!tool) {
                            this.pw.error(`Tool '${this.tool_call.name}' not found`)
                            return {
                                tool_call_id: this.tool_call.id || '',
                                role: 'tool',
                                content: 'Tool not implemented, avoid calling it'
                            }
                        }

                        const result = await tool(args)

                        this.pw.debug({
                            tool_call_id: this.tool_call.id,
                        }, `Called tool '${this.tool_call.name}' with result '${result}'`)

                        return {
                            tool_call_id: this.tool_call.id || '',
                            role: 'tool',
                            content: result,
                        }

                    } catch (err) {
                        if (!(err instanceof SyntaxError)) {
                            this.pw.error(err, 'Error handling tool call');
                        }
                    }
                })
            )).filter(Boolean) as OpenAI.ChatCompletionMessageParam[]

            this.tool_outputs.push(...outputs)
        }

        if (choice.finish_reason) {
            this.pw.debug(`Completion stream finished with reason '${choice.finish_reason}'`)
            this.emit(CompletionStreamEvent.Completed, {
                reason: choice.finish_reason,
                message: this.message_buffer,
                tool_outputs: this.tool_outputs,
                usage: this.usage,
            } as CompletionStreamData)
        }

        this.ongoing_events -= 1
    }

    // Functions for tool calls

    private async click({ role, name }: { role: ClickableElement, name: string}): Promise<string> {
        const element = await this.pw.resolve_element(this.pageId, role, name)

        if (element.isNone()) {
            return 'Could not find element'
        } else {
            await element.unwrap().click()
            return 'Successfully clicked'
        }
    }

    private async type({ text, name }: { text: string, name: string }): Promise<string> {
        const element = await this.pw.resolve_element(this.pageId, 'input', name)

        if (element.isNone()) {
            return 'Could not find element'
        } else {
            await element.unwrap().fill(text)
            return 'Successfully typed'
        }
    }
}