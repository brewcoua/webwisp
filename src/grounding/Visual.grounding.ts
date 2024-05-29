import { ElementHandle } from 'playwright'
import { None, Option, Some } from 'oxide.ts'
import fs from 'node:fs'
import * as path from 'node:path'

import { Grounding } from '../domain/Grounding'
import { CONFIG, SoM } from '../constants'
import { Logger } from '../logger'

export class VisualGrounding extends Grounding {
    public async initialize(): Promise<void> {
        await this.page.addStyleTag({ content: SoM.style })
        await this.page.addScriptTag({ content: SoM.script })
    }

    public async getScreenshot(): Promise<string> {
        // Check that window.SoM is defined
        const defined = await this.page.evaluate(
            "typeof window.SoM !== 'undefined'"
        )
        if (!defined) {
            await this.initialize()
        }

        await this.page.evaluate('window.SoM.display()')

        const imgPath = path.join(
            CONFIG.browser.screenshotsDir,
            `${new Date().toISOString()}.png`
        )
        await this.page.screenshot({
            path: imgPath,
        })

        await this.page.evaluate('window.SoM.hide()')

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
