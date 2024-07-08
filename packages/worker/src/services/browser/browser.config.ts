import {
    BrowserContextOptions,
    LaunchOptions,
    PageScreenshotOptions,
} from 'playwright'

export const REMOTE_PORT = 6000

const config: BrowserConfig = {
    options: {
        headless: true,
        args: [
            '--disable-web-security',
            `--remote-debugging-port=${REMOTE_PORT}`,
            `--remote-allow-origins=http://localhost:${REMOTE_PORT}`,
        ],
    },
    context: {
        bypassCSP: true,
        recordVideo: {
            dir: '/data/videos',
            size: {
                width: 1280,
                height: 720,
            },
        },
    },
    screenshot: {
        path: './dist/img/{{timestamp}}.png',
        type: 'png',
        caret: 'initial',
        scale: 'css',
    },
    viewport: {
        width: 1280,
        height: 720,
    },
}

export default config

/**
 * Configuration for the browser service
 */
export type BrowserConfig = {
    /**
     * Options to use when launching the browser
     */
    options?: LaunchOptions
    /**
     * Context options to use when creating a new context
     */
    context?: BrowserContextOptions
    /**
     * Viewport size to use when creating a new page
     */
    viewport?: {
        width: number
        height: number
    }
    /**
     * Options for taking screenshots of the page
     */
    screenshot: RequiredProps<PageScreenshotOptions, 'path'>
}

export type PartialRequired<T, K extends keyof T> = Partial<T> &
    Required<Pick<T, K>>

export type RequiredProps<T, K extends keyof T> = Omit<T, K> &
    Required<Pick<T, K>>
