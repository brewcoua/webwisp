import { Page } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'
import { Logger } from 'winston'

import config, { REMOTE_PORT } from '../browser.config'
import { Action, ActionStatus, ActionType } from '@domain/action.types'

const SoMUrl = 'https://unpkg.com/@brewcoua/web-som@1.2.4/SoM.min.js'

export default class PageWrapper {
    private readonly logger: Logger

    constructor(
        private readonly id: number,
        private readonly page: Page,
        logger: Logger
    ) {
        this.logger = logger.child({
            context: 'PageWrapper',
            pageId: id,
        })
    }

    public async initialize(): Promise<void> {
        const SoM = await fetch(SoMUrl).then((res) => res.text())
        const script = `(function() { ${SoM} })()`

        // Set the script to be automatically injected into the page
        await this.page.addInitScript({
            // Add a scoped self-invoking function to the page
            content: script,
        })

        // Force the current page to load the SoM script
        await this.page.evaluate(script)
    }

    public async destroy(): Promise<boolean> {
        try {
            await this.page?.close()
            return true
        } catch (error) {
            return false
        }
    }

    public get url(): string | null {
        try {
            return this.page.url()
        } catch (err) {
            return null
        }
    }

    public async title(): Promise<string | null> {
        try {
            return this.page.title()
        } catch (err) {
            return null
        }
    }

    public async getPageId(): Promise<string | null> {
        const pages = await fetch(`http://localhost:${REMOTE_PORT}/json`)
            .then((res) => res.json())
            .catch(() => [])

        const title = await this.title()
        const page = pages.find(
            (p: any) =>
                p.type === 'page' && p.url === this.url && p.title === title
        )

        return page ? page.id : null
    }

    public async getQueryText(query: string): Promise<string | null> {
        try {
            // Query selector with innerText
            const element = await this.page.$(query)
            return element ? element.innerText() : null
        } catch (err) {
            return null
        }
    }

    public async getContent(): Promise<string | null> {
        try {
            const content = await this.page.content()
            return content
        } catch (err) {
            return null
        }
    }

    public async evaluate(script: string): Promise<any> {
        try {
            return this.page.evaluate(script)
        } catch (err) {
            return null
        }
    }

    public unwrap(): Page {
        return this.page
    }

    /**
     * Take a screenshot of the current page
     *
     * @remarks
     * This method will attempt to take a screenshot of the current page. If the screenshot fails, it will retry up to 3 times before giving up.
     *
     * @returns The screenshot as a base64 encoded url or null if the screenshot failed
     */
    public async screenshot(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            let failCount = 0
            let lastError = null
            while (failCount < 3) {
                const path = (
                    config.screenshot.path || './screenshots/{{timestamp}}.png'
                ).replace('{{timestamp}}', Date.now().toString())

                try {
                    // Make sure the directory exists
                    mkdirSync(path.substring(0, path.lastIndexOf('/')), {
                        recursive: true,
                    })

                    // Now we call the SoM to display
                    await this.page.evaluate(`SoM.display()`)

                    await this.page.screenshot({
                        ...config.screenshot,
                        path: path,
                    })

                    this.logger.debug(`Screenshot saved to ${path}`)

                    const buf = readFileSync(path)

                    return resolve(
                        `data:image/${
                            config.screenshot.type || 'png'
                        };base64,${buf.toString('base64')}`
                    )
                } catch (err) {
                    failCount++
                    lastError = err
                }

                // Keep a delay between retries
                await new Promise((resolve) => setTimeout(resolve, 500))
            }

            return reject(lastError)
        })
    }

    /**
     * Navigate to a url
     * @param url - The url to navigate to
     * @returns True if the navigation was successful, false otherwise
     */
    public async goto(url: string): Promise<boolean> {
        try {
            await this.page.goto(url, {
                waitUntil: 'domcontentloaded',
            })
            return true
        } catch (err: any) {
            this.logger.error("Failed to navigate to url '" + url, {
                stack: err.stack,
            })
            return false
        }
    }

    /**
     * Wait for the page to load, regardless of current state
     */
    public async waitToLoad(): Promise<void> {
        try {
            // Then, make sure EVERYTHING is loaded and that the page is idle
            await this.page.waitForLoadState('load')
            return
        } catch (err) {
            return
        }
    }

    /**
     * Perform an action on the page
     * @param action - The action to perform
     * @param element - The element to perform the action on (if applicable)
     * @returns The status of the action
     */
    public async perform(action: Action): Promise<ActionStatus> {
        try {
            if (action.type === ActionType.SCROLL) {
                await this.page.evaluate(
                    `window.scrollBy({ top: ${
                        action.arguments.direction === 'down' ? '' : '-'
                    }((window.innerHeight / 3) * 2) })`
                )
            } /*else if (action.type === ActionType.PRESS_ENTER) {
                await this.page.keyboard.press('Enter')
            }*/ else if (action.type === ActionType.BACK) {
                await this.page.goBack({
                    waitUntil: 'domcontentloaded',
                })
            } else if (action.type === ActionType.FORWARD) {
                await this.page.goForward({
                    waitUntil: 'domcontentloaded',
                })
            } else if (
                action.type === ActionType.CLICK ||
                action.type === ActionType.TYPE ||
                action.type === ActionType.HOVER ||
                action.type === ActionType.SELECT
            ) {
                const element = await this.page.$(
                    `[data-som="${action.arguments.label}"]`
                )
                if (!element) {
                    return ActionStatus.FAILED
                }

                switch (action.type) {
                    case ActionType.CLICK:
                        await element.click()
                        break
                    case ActionType.TYPE:
                        await element.fill(action.arguments.text as string)
                        break
                    case ActionType.HOVER:
                        await element.hover()
                        break
                    case ActionType.SELECT:
                        await element.selectOption(
                            action.arguments.option as string
                        )
                        break
                }
            }

            return ActionStatus.COMPLETED
        } catch (err: any) {
            this.logger.debug('Failed to perform action: ' + err.message)
            return ActionStatus.FAILED
        }
    }
}
