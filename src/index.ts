import { chromium, LaunchOptions } from 'playwright'

const options = {
    headless: false,
    slowMo: 50,
} satisfies LaunchOptions

async function init() {
    const browser = await chromium.launch(options)

    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('https://example.com')

    await waitTill(5000)

    await browser.close()
}

const waitTill = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

init()
