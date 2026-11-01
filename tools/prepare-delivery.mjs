import {cp,mkdir,rename,access} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const delivery=path.resolve(root,'../../teslim');
const roots=['src','tools','templates','content','docs','.github'];
const files=['package.json','bilgiler.js','mimari.js','README.md','AGENTS.md','.gitignore'];
for(const name of ['GITHUB-YUKLE','HD-Medya-Kaynak']) {
 const target=path.resolve(delivery,name);
 if(path.dirname(target)!==delivery)throw Error('Invalid delivery destination');
 await mkdir(target,{recursive:true});
 for(const entry of [...roots,...files])await cp(path.join(root,entry),path.join(target,entry),{recursive:true,force:true});
}
const staticTarget=path.join(delivery,'HD-Medya-Statik');
if(path.dirname(path.resolve(staticTarget))!==delivery)throw Error('Invalid static destination');
await mkdir(path.join(root,'.build'),{recursive:true});
try{await access(staticTarget);await rename(staticTarget,path.join(root,'.build','previous-delivery-'+Date.now()));}catch(e){if(e.code!=='ENOENT')throw e;}
await cp(path.join(root,'dist'),staticTarget,{recursive:true,force:true});
console.log('Source: '+path.join(delivery,'GITHUB-YUKLE'));
console.log('Static: '+staticTarget);
