const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const root=process.cwd(), output=path.join(root,'docs/qa');await fs.mkdir(output,{recursive:true});
 const files=await fs.readdir(path.join(root,'dist'),{recursive:true});
 const routes=files.filter(file=>file.endsWith('.html')).map(file=>'/'+file.replaceAll('\\','/').replace(/index\.html$/,''));
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const results=[];
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 let cursor=0;
 async function worker(){const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
 while(cursor<routes.length){const route=routes[cursor++];errors=[];
 try{const response=await page.goto('http://127.0.0.1:4185'+route,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(350);
 const dimensions=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth}));
 const overflow=dimensions.scrollWidth>dimensions.width+2;
 const contrasts=await page.locator('.price-card.featured').evaluateAll(cards=>cards.map(card=>({background:getComputedStyle(card).backgroundColor,text:getComputedStyle(card).color,title:card.querySelector('h3')?getComputedStyle(card.querySelector('h3')).color:null})));
 results.push({route,status:response.status(),...dimensions,overflow,errors:[...errors],contrasts});
 }catch(e){results.push({route,error:e.message,errors:[...errors]});}}
 await page.close();}
 await Promise.all([worker(),worker(),worker()]);
 const page=await context.newPage();await page.goto('http://127.0.0.1:4185/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(800);
 await page.screenshot({path:path.join(output,'mobile-home.png')});
 for(const [selector,name] of [['#teklif','mobile-form'],['footer','mobile-footer']]){const el=page.locator(selector);if(await el.count()){await el.scrollIntoViewIfNeeded();await page.waitForTimeout(200);await page.screenshot({path:path.join(output,name+'.png')});}}
 await page.goto('http://127.0.0.1:4185/rehber/eskisehir-dugun-salonu-web-sitesi/',{waitUntil:'domcontentloaded'});await page.screenshot({path:path.join(output,'mobile-article.png')});
 const desktop=await browser.newContext({viewport:{width:1440,height:1000}}), dp=await desktop.newPage();
 for(const [route,name] of [['/','desktop-home'],['/rehber/','desktop-guide'],['/deneyim/otomasyon/','desktop-automation'],['/seo/','desktop-seo']]){await dp.goto('http://127.0.0.1:4185'+route,{waitUntil:'domcontentloaded'});await dp.waitForTimeout(250);const size=await dp.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));results.push({route,desktop:true,...size,overflow:size.scrollWidth>size.width+2});await dp.screenshot({path:path.join(output,name+'.png')});}
 await fs.writeFile(path.join(output,'mobile-audit.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({routes:routes.length,checked:results.length,failures:results.filter(x=>x.overflow||x.error||x.errors?.length||x.status>=400),contrastSamples:results.filter(x=>x.contrasts?.length).slice(0,3)},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
