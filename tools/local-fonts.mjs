// One-off asset preparation, not required during publishing builds.
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../src/site/assets/fonts');
await mkdir(root,{recursive:true});
const ua='Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36';
let css='/* Local OFL fonts. See assets/fonts/*-OFL.txt. */\n';
for(const [family,slug] of [['Manrope','manrope'],['DM Sans','dmsans']]) {
  const response=await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(' ','+')}:wght@400..800&display=swap`,{headers:{'User-Agent':ua}});
  if(!response.ok)throw Error('Font CSS '+response.status);
  const body=await response.text(); let number=0;
  for(const match of body.matchAll(/\/\* (latin(?:-ext)?) \*\/\s*(@font-face\s*\{[^}]+\})/g)) {
    const remote=/url\(([^)]+)\)/.exec(match[2])[1];
    const name=`${slug}-${match[1]}-${number++}.woff2`;
    const data=await fetch(remote);if(!data.ok)throw Error('Font download');
    await writeFile(path.join(root,name),Buffer.from(await data.arrayBuffer()));
    css+=match[2].replace(remote,`/assets/fonts/${name}`)+'\n';
  }
  if(!number)throw Error('No Latin font subsets: '+family);
  const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`);if(!license.ok)throw Error('Font license');
  await writeFile(path.join(root,slug+'-OFL.txt'),await license.text());
}
await writeFile(path.resolve(root,'../../local-fonts.css'),css);
console.log('Local font assets prepared');
