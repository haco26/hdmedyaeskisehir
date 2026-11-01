// Optional asset preparation; regular builds need no image library.
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const modulePath=process.argv[2];
const {default:sharp}=await import(modulePath?pathToFileURL(modulePath).href:'sharp');
const assets=path.resolve(import.meta.dirname,'../src/site/assets');
for(const width of [640,960,1280]) {
  const result=await sharp(path.join(assets,'hero-sculpture.webp')).resize({width,withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(path.join(assets,`hero-poster-${width}.webp`));
  console.log(width,result.size);
}
