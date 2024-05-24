import { ElementHandle } from 'playwright'
import fs from 'node:fs'
import { None, Option, Some } from 'oxide.ts'
import { Grounding } from '../domain/Grounding'
import { useConfig } from '../hooks'
import * as path from 'node:path'
import sharp from 'sharp'

export class VisualGrounding extends Grounding {
    public async initialize(): Promise<void> {
        const script = fs.readFileSync('public/SoM/SoM.js', 'utf-8')
        const style = fs.readFileSync('public/SoM/SoM.css', 'utf-8')

        await this.page.addStyleTag({ content: style })
        await this.page.addScriptTag({ content: script })
    }

    public async getScreenshot(): Promise<string> {
        // Check that window.SoM is defined
        const defined = await this.page.evaluate('typeof window.SoM !== \'undefined\'')
        if (!defined) {
            await this.initialize()
        }

        await this.page.evaluate('window.SoM.display()')

        const imgPath = path.join(useConfig().browser.screenshotsDir, `${new Date().toISOString()}.png`)
        await this.page.screenshot({
            path: imgPath,
        })

        await this.page.evaluate('window.SoM.hide()')

        let img = fs.readFileSync(imgPath)

        const config = useConfig().fine_tuning
        if (config.resize) {
            img = await sharp(img)
                .resize(
                    config.resize.width,
                    config.resize.height,
                    {
                        fit: config.resize.keep_aspect_ratio ? 'inside' : 'cover',
                    },
                )
                .toBuffer()

            fs.writeFileSync(imgPath, img)
        }

        return `data:image/png;base64,${img.toString('base64')}`
    }

    public async resolve(id: number): Promise<Option<ElementHandle>> {
        this.logger.debug(`Resolving SoM ${id}`)
        const element = await this.page.$(`[data-SoM="${id}"]`)
        return element ? Some(element) : None
    }
}