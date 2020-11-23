import { Browser, launch } from 'puppeteer';
import { findGroupSubmissions, markAsDone } from './findGroupSubmissions';
import openMoodle from './openMoodle';
import { openSubmissions } from './openSubmissions';
import { provide, Provider } from './provider';
import { submitCorrection } from './submitCorrection';
import { config } from 'dotenv';
import { requirePropery } from './requireProperty';

/**
 * Configure .env
 * 
 * The file can contain:
 * - USERNAME: the moodle username
 * - PASSWORD: the moodle password
 * - FOLDER: the path to the root folder with the submissions
 * - WEEK: the week (beginning at 1)
 * - HEADLESS: if set to true, chrome will be launched in the background.
 */
config()


let browserProvider : Provider<Browser> = provide(() => launch({ 
    headless: (process.env as any).HEADLESS ?? false
}))

async function main() {
    const folder = await requirePropery<string>(process.env.FOLDER, 'What is the root folder?')
    const user = await requirePropery<string>(process.env.USERNAME, 'Please provide the moodle username.')
    const pass = await requirePropery<string>(process.env.PASSWORD, 'Please provide the moodle password.')
    const week = await requirePropery<number>(process.env.WEEK, 'What week are you correcting?', parseInt)

    console.log(folder, user, pass, week);
    
    const submissions = await findGroupSubmissions(folder)
    const page = await openPage()
    console.log("Found a total of", submissions.length, 'files to upload.');
    

    await openMoodle(page, user, pass)
    await openSubmissions(page, week)
    for(const submission of submissions) {
        console.log('Submitting for group', submission.groupId, 'which scored', submission.points)
        await submitCorrection(page, browserProvider, submission)
        await markAsDone(submission)
    }

    await browserProvider.retrieve()
        .then((browser) => browser.close())
}

async function openPage() {
    const browser = await browserProvider.retrieve()
    return browser.newPage()
}


main()
