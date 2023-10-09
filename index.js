const puppeteer = require('puppeteer-extra') 
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const {executablePath} = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: executablePath(),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();
    await page.goto("https://quotes.toscrape.com");

    while (true) {
        await page.waitForSelector('.quote span:nth-child(1)');
        const titles = await page.$$eval('.quote span:nth-child(1)', title => title.map(title => title.innerText));
        console.log(titles);

        const nextButton = await page.$('ul.pager li.next a');
        if (!nextButton) {
            console.log('Next button not found. Closing browser.');
            await browser.close();
            break;
        }
        await nextButton.click();
    }
})();