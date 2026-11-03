import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge'});
const report=[];
for(const [label,url] of [['deployed','https://linktredjames.vercel.app/'],['before','http://127.0.0.1:5173']]) {
 for(const width of [320,375,390,430,1440]) {
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600,deviceScaleFactor:1,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try {
   await page.goto(url,{timeout:30000}); await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`artifacts/mobile-themes/${label}-${width}.png`,fullPage:true});
   report.push({label,width,errors,...await page.evaluate(()=>({name:document.querySelector('h1')?.textContent,links:[...document.querySelectorAll('.link-card')].map(a=>({href:a.href,text:a.textContent,rect:a.getBoundingClientRect().toJSON()})),body:getComputedStyle(document.body).background,overflow:document.documentElement.scrollWidth>innerWidth}))});
  } catch(e) {report.push({label,width,error:e.message});}
  await page.close();
 }
}
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await page.goto('http://127.0.0.1:5173');
const samples=[];
for(let i=0;i<12;i++) {samples.push(await page.evaluate(()=>({time:performance.now(),boot:document.querySelector('.boot-lines')?.textContent,name:document.querySelector('h1 [aria-hidden]')?.innerText,cards:[...document.querySelectorAll('.link-card')].map(a=>({opacity:getComputedStyle(a).opacity,transform:getComputedStyle(a).transform}))})));await page.waitForTimeout(150);}
await page.locator('.link-card').first().evaluate(el=>el.addEventListener('click',e=>e.preventDefault()));
const resting=await page.locator('.link-card').first().evaluate(el=>({border:getComputedStyle(el).borderColor,arrow:getComputedStyle(el.querySelector('.link-arrow')).transform}));
await page.locator('.link-card').first().tap();await page.waitForTimeout(300);
const tapped=await page.locator('.link-card').first().evaluate(el=>({border:getComputedStyle(el).borderColor,arrow:getComputedStyle(el.querySelector('.link-arrow')).transform}));
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
const reduced=await page.evaluate(()=>({animations:document.getAnimations().filter(a=>a.playState==='running').length,heading:document.querySelector('h1').innerText,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches}));
report.push({samples,resting,tapped,reduced});
await fs.writeFile('artifacts/mobile-themes/baseline.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report.filter(r=>r.label).map(({label,width,error,name,overflow,errors})=>({label,width,error,name,overflow,errors}))));
console.log(JSON.stringify({resting,tapped,reduced,sampleStart:samples[0],sampleEnd:samples.at(-1)}));
await browser.close();
