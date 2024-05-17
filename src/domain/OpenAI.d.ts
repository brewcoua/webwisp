import OpenAI from 'openai'

export type Beta = OpenAI.Beta

// Completions
export type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam

export type ChatCompletionTool = OpenAI.ChatCompletionTool

export type ChatCompletionChunk = OpenAI.ChatCompletionChunk

// Files
export type FileObject = OpenAI.Files.FileObject

// Assistants
export type Assistant = OpenAI.Beta.Assistant
export type AssistantStream = AsyncIterable<OpenAI.Beta.AssistantStreamEvent>

// Threads
export type Thread = OpenAI.Beta.Thread

export type Message = OpenAI.Beta.Threads.Message
export type MessagesPage = OpenAI.Beta.Threads.MessagesPage
export type MessageCreateParams = OpenAI.Beta.Threads.MessageCreateParams

export type Run = OpenAI.Beta.Threads.Run
export type RunStreamEvent = OpenAI.Beta.RunStreamEvent
export type RequiredActionFunctionToolCall = OpenAI.Beta.Threads.RequiredActionFunctionToolCall
export type ToolCall = OpenAI.Beta.Threads.Runs.ToolCall
export type FunctionToolCall = OpenAI.Beta.Threads.Runs.FunctionToolCall
export type ToolOutput = OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput

export type FunctionToolCallFunction = OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall.Function
