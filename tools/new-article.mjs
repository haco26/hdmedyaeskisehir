import { promises as fs } from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const slug=process.argv[2],title=process.argv.slice(3).join(' ');
if(!slug||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||!title||/[\r\n]/.test(title)){console.error('Kullanım: npm run makale:yeni -- yazi-adresi "Makale başlığı"');process.exit(1)}
const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Istanbul'}).format(new Date());
const dir=path.join(root,'content/makaleler');await fs.mkdir(dir,{recursive:true});
const target=path.join(dir,slug+'.md');
try{await fs.writeFile(target,`---\nbaslik: ${JSON.stringify(title)}\nadres: ${slug}\naciklama: "Yazının kısa ve açıklayıcı özetini buraya yazın."\nkategori: "Web Tasarım"\ntarih: ${date}\ntaslak: true\n---\n\nOkuyucunun sorusunu doğrudan yanıtlayan giriş paragrafı.\n\n## İlk konu başlığı\n\nİşe yarayan örneklerle açıklayın.\n\n## Bir sonraki adım\n\n[Projenizi HD Medya ile konuşun](/#teklif).\n`,{encoding:'utf8',flag:'wx'});console.log('Taslak oluşturuldu: '+target+'\nYazı tamamlandığında taslak: false yapıp npm run check çalıştırın.');}catch(e){console.error(e.code==='EEXIST'?'Bu adresle bir dosya zaten var; üzerine yazılmadı.':e.message);process.exitCode=1}
