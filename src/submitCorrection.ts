import { Browser, ElementHandle, Page } from "puppeteer";
import { Group } from "./findGroupSubmissions";
import { Provider } from "./provider";
import { wait } from "./wait";


export async function submitCorrection(page: Page, browser: Provider<Browser>, group: Group) {
    const links = await page.$$eval('tr', (elements, group) => {
        const groupMemebers = elements.filter(el => (el.querySelector("td.c6") || {}).textContent == `Group_${group.groupId}`)
        return groupMemebers.map(el => el.querySelector('td.c7 a').getAttribute('href'))
    }, group)

    if(links.length !== 0)
        await handleSubmissionTab(browser, links[0], group)

    // We only want to submit one correction per group. Hence, we dont do:
    // await Promise.all(links.map(link => handleSubmissionTab(browser, link, group)))
}

async function handleSubmissionTab(browser: Provider<Browser>, link: string, group: Group) {
    const page = await browser.retrieve().then(browser => browser.newPage())
    await page.goto(link, { waitUntil: 'domcontentloaded' })

    await page.waitForSelector('input#id_grade')    
    await page.type('input#id_grade', group.points.toString())

    await page.waitForSelector('div[data-region=grade-panel]')

    while(true) {
        try{
            await page.$eval('div[data-region=grade-panel]', function(el) {el.scrollBy(0, 1500)})
            await wait(500)
            await page.$eval('div[data-region=grade-panel]', function(el) {el.scrollBy(0, 1500)})
            await wait(500)
            await page.waitForSelector('.dndupload-arrow')
            const filesHandle = await page.$('.dndupload-arrow')
            await filesHandle.focus()
            await filesHandle.click()
            break
        } catch(e) {
            await wait(500)
            console.log("Wait one more round");
        }
    }

    

    await page.waitForSelector('input[type=file]')
    await page.type('.fp-saveas input', group.correctionFileName)
    
    const fileInput = await page.$('input[type=file]') as ElementHandle<HTMLInputElement>
    await fileInput.uploadFile(group.correctionFile)
    
    await page.waitForSelector('button.fp-upload-btn')
    await page.click('button.fp-upload-btn')
    
    await page.waitForSelector('.fp-file.fp-hascontextmenu', { timeout: 60000 })
    await page.select('select#id_workflowstate', 'readyforreview')
    await page.click('form[data-region=grading-actions-form] input[type=checkbox]')
    await page.click('button[name=savechanges]')
    await page.waitForSelector("button[data-action=cancel]")
    page.close()
}