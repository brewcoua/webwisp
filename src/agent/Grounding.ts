import { ElementHandle, Page } from 'playwright'
import fs from 'node:fs'
import { join as joinPath } from 'node:path'

import Logger from '@/logger'
import { getConfig } from '@/domain/Config'

// @ts-ignore - This is imported raw, as a string to be injected into the page
import SoMScript from '../../lib/SoM/dist/SoM.min.js'

export default class Grounding {
    constructor(private readonly page: Page) {}

    public async initialize(): Promise<void> {
        await this.page.addScriptTag({
            content: `(function() { ${SoMScript} })()`,
        })
    }

    public async getScreenshot(): Promise<string> {
        try {
            const isDefined = await this.page.evaluate(
                'typeof window.SoM !== "undefined"'
            )
            if (!isDefined) {
                await this.initialize()
            }

            await this.page.evaluate('window.SoM.display()')

            const imgPath = joinPath(
                getConfig().browser.screenshotsDir,
                `${new Date().toISOString()}.png`
            )
            await this.page.screenshot({
                path: imgPath,
            })

            // Workaround to make sure image is valid (buffer-only ends up being invalid in some cases)
            let img = fs.readFileSync(imgPath)
            return `data:image/png;base64,${img.toString('base64')}`
        } catch (e) {
            Logger.error(`Failed to take screenshot: ${e}`)
            return ''
        }
    }

    public async resolve(id: number): Promise<ElementHandle | null> {
        Logger.debug(`Resolving SoM ${id}`)
        return this.page.$(`[data-SoM="${id}"]`)
    }
}
