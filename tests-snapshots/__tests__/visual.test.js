const puppeteer = require('puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

describe('Visual tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await page.close();
        await browser.close();
    });

    test('Snapshot pantalla completa', async () => {
        await page.goto('https://example.com',{
            waitUntil: 'networkidle0',
        });
        await page.waitForSelector('h1');
        const image = await page.screenshot({type:"png"});
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500
        });
    });

    test('Snapshot de un elemento', async () => {
        await page.goto('https://example.com',{
            waitUntil: 'networkidle0',
        });
        const h1 = await page.waitForSelector('h1');
        const image = await h1.screenshot();
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        });
    });
    
    test('Snapshot removiendo un elemento', async () => {
        await page.goto('https://example.com',{
            waitUntil: 'networkidle0',
        });
        await page.evaluate(() => {
            const h1 = document.querySelector('h1');
            h1.remove();
        });      
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500
        });
    });

    test.only('Snapshot de iPhone', async ()=>{
        await page.goto('https://example.com',{
            waitUntil: 'networkidle0',
        });
        await page.waitForSelector('h1');
        await page.emulate(puppeteer.KnownDevices['iPhone 6']);
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500
        });
    });
});
