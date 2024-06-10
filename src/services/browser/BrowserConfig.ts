import {
    BrowserContextOptions,
    LaunchOptions,
    PageScreenshotOptions,
} from 'playwright'

const config: BrowserConfig = {
    type: 'chromium',
    options: {
        headless: false,
        args: ['--disable-web-security'],
    },
    context: {
        bypassCSP: true,
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
     * Type of browser to use (chromium, firefox, webkit)
     */
    type: BrowserType
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

export type BrowserType = 'chromium' | 'firefox' | 'webkit'
