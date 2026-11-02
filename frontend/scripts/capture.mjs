import { chromium } from '@playwright/test';
const browser = await chromium.launch({channel:'msedge', headless:true});
const page = await browser.newPage({viewport:{width:360,height:731}, reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:5173');
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'artifacts/pass-2-360.png',fullPage:true});
console.log(await page.locator('.link-card').first().boundingBox());
await browser.close();

