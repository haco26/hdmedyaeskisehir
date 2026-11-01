// Mechanical migration. Existing tokens are preserved; future runs only add new copy.
import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import ui from '../mimari.js';
const root=path.resolve(import.meta.dirname,'..');
const catalog={...ui.copy};
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ');
function token(text){const clean=decode(text.trim());if(!clean||clean.includes('{{')||/^[\s↗↑↓→←↺↻✓✔+−!/?×✕]+$/u.test(clean))return text;const id='c_'+createHash('sha256').update(clean).digest('hex').slice(0,12);catalog[id]=clean;return text.replace(text.trim(),'{{ui.copy.'+id+'}}');}
function migrate(html) {
  // Shared chrome is generated once from mimari.js, never edited per page.
  html=html.replace(/<header\b[^>]*class="nav-shell[^">]*"[^>]*>[\s\S]*?<\/header>/i,'{{sharedHeader}}');
  if(!/<body[^>]*class="[^"]*demo-/.test(html)) html=html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i,'{{sharedFooter}}');
  const stack=[]; const targets=new Set(['h1','h2','button','a','label','option','summary','legend']);
  return html.replace(/<!--[\s\S]*?-->|<(script|style|svg|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<[^>]*>|[^<]+/gi,part=>{
    if(part.startsWith('<')){
      if(/^<!--[\s\S]*-->$|^<(?:script|style|svg|textarea)\b/i.test(part))return part;
      const close=/^<\/([\w-]+)/.exec(part),open=/^<([\w-]+)/.exec(part);
      if(close){const i=stack.lastIndexOf(close[1].toLowerCase());if(i>=0)stack.splice(i);}
      if(open&&!/\/$/.test(part.slice(0,-1))&&!/^(input|img|br|meta|link|hr|source)$/i.test(open[1]))stack.push(open[1].toLowerCase());
      if(open&&/^(input|textarea)$/i.test(open[1]))part=part.replace(/placeholder="([^"]+)"/,(_,s)=>'placeholder="'+token(s)+'"');
      return part;
    }
    return stack.some(s=>targets.has(s))?token(part):part;
  });
}
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(f.endsWith('.html')){const old=await readFile(f,'utf8'),next=migrate(old);if(old!==next)await writeFile(f,next);}}}
await walk(path.join(root,'src/site'));await walk(path.join(root,'templates'));
const config=await readFile(path.join(root,'mimari.js'),'utf8');
const start=config.lastIndexOf('  copy: ');if(start<0)throw Error('Missing central copy field');
await writeFile(path.join(root,'mimari.js'),config.slice(0,start)+'  copy: '+JSON.stringify(catalog,null,2)+'\n};\n');
console.log(Object.keys(catalog).length+' unique UI strings managed centrally.');
