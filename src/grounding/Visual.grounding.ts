import { ElementHandle } from 'playwright'
import { None, Option, Some } from 'oxide.ts'
import fs from 'node:fs'
import * as path from 'node:path'

import { Grounding } from '../domain/Grounding'
import { useConfig } from '../constants'
import { Logger } from '../logger'

// @ts-ignore
import SoMScript from '../../lib/SoM/dist/SoM.min.js'

export class VisualGrounding extends Grounding {
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

            const imgPath = path.join(
                useConfig().browser.screenshotsDir,
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

    public async resolve(id: number): Promise<Option<ElementHandle>> {
        Logger.debug(`Resolving SoM ${id}`)
        const element = await this.page.$(`[data-SoM="${id}"]`)
        return element ? Some(element) : None
    }
}
