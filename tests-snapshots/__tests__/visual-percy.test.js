const puppeteer = require('puppeteer')
const percySnapshot = require('@percy/puppeteer');

describe('Visual Percy', () => {
    let browser, page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Snapshot con Percy', async () => {
        await page.goto('http://example.com');
        await page.waitForSelector('h1');
        await percySnapshot(page, 'Example page');
    });

    test.only('Snapshot con Percy quitando un elemento', async () => {
        await page.goto('http://example.com');
        await page.waitForSelector('h1');
        await page.evaluate(() => {
            document.querySelector('h1').remove();
        });
        await percySnapshot(page, 'Example page');
    });

});