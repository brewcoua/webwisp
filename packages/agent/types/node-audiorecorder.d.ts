declare module 'node-audiorecorder' {
    export default class AudioRecorder {
        constructor(options: any, console: any)
        on(event: string, callback: (...args: any[]) => void): void
        start(): AudioRecorder
        stream(): AudioStream
    }
    export class AudioStream {
        pipe(stream: any): void
    }
}
