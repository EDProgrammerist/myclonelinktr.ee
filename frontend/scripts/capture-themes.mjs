import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'msedge'});
for(const width of [320,375,390,430,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600,deviceScaleFactor:1,reducedMotion:'reduce'});
 await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173'); await page.evaluate(()=>document.fonts.ready);
 await page.locator('.avatar-ring img').evaluate(img=>img.decode());
 for(const [theme,name] of [['green','Matrix Green'],['blue','Cyber Blue'],['red','Crimson Red']]) {
  await page.getByRole('button',{name,exact:true}).click();
  await page.screenshot({path:`artifacts/mobile-themes/${theme}-${width}.png`,fullPage:true});
 }
 await page.close();
}
await browser.close();
