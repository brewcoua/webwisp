import { Page } from 'playwright'
import { LoginScript } from '.'

export default class ClassifiedsScript implements LoginScript {
    private readonly credentials = {
        username: 'blake.sullivan@gmail.com',
        password: 'Password.123',
    }

    async run(page: Page): Promise<void> {
        const url = new URL(page.url())
        await page.goto(`${url.origin}/index.php?page=login`)
        await page.locator('#email').fill(this.credentials.username)
        await page.locator('#password').fill(this.credentials.password)
        await page.getByRole('button', { name: 'Log in' }).click()
    }
}
