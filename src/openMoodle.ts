import { Page } from 'puppeteer'

/**
 * Opens moodle and navigates until the login.
 */
export default async function openMoodle(page: Page, user: string, pass: string) {
    await page.goto('https://www.moodle.tum.de/course/view.php?id=58087', { waitUntil: 'networkidle0' })
    
    await page.click('a[title="TUM LOGIN"]')
    await page.waitForSelector('input#username')

    await page.type('input#username', user)
    await page.type('input#password', pass)

    await page.click('button#btnLogin')
    await page.waitForNavigation()
}