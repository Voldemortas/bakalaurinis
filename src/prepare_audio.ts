import playwright, {Page} from 'playwright';
import fs from 'fs';
import {AUDIO_OUTPUT, AUDIO_SRC, MAKE_JSON_URL, PORT} from './config';

(async () => {
    const browser = await playwright['webkit'].launch();
    const context = await browser.newContext({ignoreHTTPSErrors: true});
    const page = await context.newPage();
    const directories = fs.readdirSync(`${__dirname}/${AUDIO_SRC}`);
    for await (let directory of directories){
        try {
            const files = fs.readdirSync(`${__dirname}/${AUDIO_SRC}/${directory}`);
            const data = [];
            for await (let file of files) {
                const json = await scrap(page, `/${directory}/${file}`);
                data.push(JSON.parse(json!.replace('\n', '')));
            }
            fs.writeFileSync(
                `${__dirname}/${AUDIO_OUTPUT}/${directory}.json`,
                JSON.stringify(data.flat(), null, 1)
            );
        }catch (error) {
            console.log({error})
        }
    }
    await browser.close()
})();

async function scrap(page: Page, url: string){
    await page.goto(`https://localhost:${PORT}/${MAKE_JSON_URL}?song=${AUDIO_SRC}${url}`);
    await page.waitForSelector('#formants')
    const pre = await page.$('#formants');
    return await pre?.evaluate(el => el.textContent)
}