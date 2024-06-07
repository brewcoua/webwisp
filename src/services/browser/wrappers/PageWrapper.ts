import { ElementHandle, Page } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'

import config from '../BrowserConfig'

import Action from '@/services/runner/domain/Action'
import ActionType from '@/services/runner/domain/ActionType'
import ActionStatus from '@/services/runner/domain/ActionStatus'

const SoMUrl =
    'https://raw.githubusercontent.com/brewcoua/web-som/master/dist/SoM.min.js'

export default class PageWrapper {
    constructor(private readonly page: Page) {}

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
            await this.page.close()
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

    /**
     * Take a screenshot of the current page @async
     * @returns {string | null} - The screenshot as a base64 encoded url or null if the screenshot failed
     */
    public async screenshot(): Promise<string | null> {
        try {
            const path = (
                config.screenshot.path || './screenshots/{{timestamp}}.png'
            ).replace('{{timestamp}}', Date.now().toString())

            // Make sure the directory exists
            mkdirSync(path, { recursive: true })

            await this.page.screenshot({
                ...config.screenshot,
                path: path,
            })

            const buf = readFileSync(path)

            return `data:image/${
                config.screenshot.type || 'png'
            };base64,${buf.toString('base64')}`
        } catch (err) {
            return null
        }
    }

    /**
     * Navigate to a url @async
     * @param url - The url to navigate to
     * @returns {boolean} - True if the navigation was successful, false otherwise
     */
    public async goto(url: string): Promise<boolean> {
        try {
            await this.page.goto(url, {
                waitUntil: 'domcontentloaded',
            })
            return true
        } catch (err) {
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
     * Perform an action on the page @async
     * @param action - The action to perform
     * @param element - The element to perform the action on (if applicable)
     * @returns {ActionStatus} - The status of the action
     */
    public async perform(
        action: Action,
        element?: ElementHandle
    ): Promise<ActionStatus> {
        try {
            if (action.type === ActionType.Scroll) {
                await this.page.evaluate(
                    `window.scrollBy({ top: ${
                        action.arguments.direction === 'down' ? '' : '-'
                    }((window.innerHeight / 3) * 2) })`
                )
            } else if (action.type === ActionType.PressEnter) {
                await this.page.keyboard.press('Enter')
            } else if (action.type === ActionType.Back) {
                await this.page.goBack({
                    waitUntil: 'domcontentloaded',
                })
            } else if (action.type === ActionType.Forward) {
                await this.page.goForward({
                    waitUntil: 'domcontentloaded',
                })
            } else if (
                action.type === ActionType.Click ||
                action.type === ActionType.Type
            ) {
                if (!element) {
                    return ActionStatus.Failed
                }

                switch (action.type) {
                    case ActionType.Click:
                        await element.click()
                        break
                    case ActionType.Type:
                        await element.fill(action.arguments.text as string)
                        break
                }
            }

            return ActionStatus.Success
        } catch (err) {
            return ActionStatus.Failed
        }
    }
}
