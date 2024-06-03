import { ElementHandle } from 'playwright'
import { None, Option, Some } from 'oxide.ts'
import fs from 'node:fs'
import * as path from 'node:path'

import { Grounding } from '../domain/Grounding'
import { CONFIG } from '../constants'
import { Logger } from '../logger'

// @ts-ignore
import SoMScript from '../../lib/SoM/dist/SoM.min.js'
// @ts-ignore
import SoMStyle from '../../lib/SoM/dist/SoM.min.css'

export class VisualGrounding extends Grounding {
    public async initialize(): Promise<void> {
        await this.page.addStyleTag({ content: SoMStyle })
        await this.page.addScriptTag({ content: SoMScript })
    }

    public async getScreenshot(): Promise<string> {
        // Check that window.SoM is defined
        const isDefined = await this.page.evaluate("typeof SoM !== 'undefined'")
        if (!isDefined) {
            await this.initialize()
        }

        await this.page.evaluate('SoM.display()')

        const imgPath = path.join(
            CONFIG.browser.screenshotsDir,
            `${new Date().toISOString()}.png`
        )
        await this.page.screenshot({
            path: imgPath,
        })

        // Workaround to make sure image is valid (buffer-only ends up being invalid in some cases)
        let img = fs.readFileSync(imgPath)
        return `data:image/png;base64,${img.toString('base64')}`
    }

    public async resolve(id: number): Promise<Option<ElementHandle>> {
        Logger.debug(`Resolving SoM ${id}`)
        const element = await this.page.$(`[data-SoM="${id}"]`)
        return element ? Some(element) : None
    }
}
