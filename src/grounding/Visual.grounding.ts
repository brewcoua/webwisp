import { ElementHandle, Page } from 'playwright'
import fs from 'node:fs'
import { None, Option, Some } from 'oxide.ts'
import { Grounding } from '../domain/Grounding'

export class VisualGrounding extends Grounding {
    public async initialize(): Promise<void> {
        const script = fs.readFileSync('public/SoM/SoM.js', 'utf-8')
        const style = fs.readFileSync('public/SoM/SoM.css', 'utf-8')

        await this.page.addStyleTag({ content: style })
        await this.page.addScriptTag({ content: script })
    }

    public async getScreenshot(): Promise<string> {
        await this.page.evaluate("window.SoM.display()")

        const screenshot = await this.page.screenshot()

        fs.writeFileSync('screenshot.png', screenshot)

        await this.page.evaluate("window.SoM.hide()")

        return `data:image/png;base64,${screenshot.toString('base64')}`
    }

    public async resolve(id: number): Promise<Option<ElementHandle>> {
        this.logger.debug(`Resolving SoM ${id}`)
        const element = await this.page.$(`[data-SoM="${id}"]`)
        return element ? Some(element) : None
    }
}