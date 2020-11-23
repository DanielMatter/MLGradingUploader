import { Page } from "puppeteer";

export async function openSubmissions(page: Page, sectionNumber: number) {
    await page.click(`#section-${sectionNumber} h3 a`)
    await page.waitForSelector('li.modtype_assign a')

    await page.click('li.modtype_assign a')
    await page.waitForSelector('div.submissionlinks a:first-child')

    await page.click('div.submissionlinks a:first-child')
    await page.waitForSelector('div.gradingtable')
}