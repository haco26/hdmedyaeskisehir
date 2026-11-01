import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from './build-static.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = path.join(projectRoot, '.build', 'tests');

async function fixture(run) {
  await fs.mkdir(fixtures, { recursive: true });
  const root = await fs.mkdtemp(path.join(fixtures, 'fixture-'));
  try {
    await fs.mkdir(path.join(root, 'src/site/rehber'), { recursive: true });
    await fs.mkdir(path.join(root, 'src/site/ornekler'), { recursive: true });
    await fs.writeFile(path.join(root, 'package.json'), '{"type":"module"}');
    const config = {
      business: { name: 'HD & Medya', description: 'Yazılım ve web tasarım.', domain: 'https://hdmedyaeskisehir.com.tr', phoneDisplay: '0536 883 58 67', phoneE164: '+905368835867', whatsappNumber: '905368835867', instagramUrl: 'https://www.instagram.com/hdmedyaeskisehir/', addresses: [
        { label: 'Çamlıca', streetAddress: 'Tombakzade Cad. No:57/A', addressLocality: 'Tepebaşı', addressRegion: 'Eskişehir', addressCountry: 'TR' },
        { label: 'Batıkent', streetAddress: 'Kısmettepe Sok. No:8/A', addressLocality: 'Tepebaşı', addressRegion: 'Eskişehir', addressCountry: 'TR' }
      ] },
      references: [{ id: 'sonar', name: 'Sonar', url: 'https://sonarteknoloji.com.tr' }],
      services: [{ title: 'İşletme sitesi', items: [{ label: 'Mobil kullanım' }] }],
      faq: [{ question: 'Nerede?', answer: 'Eskişehir’de.' }],
      softwareApplication: { name: 'Tasarım örnekleri', url: 'https://hdmedyaeskisehir.com.tr/#tasarim-ornekleri', applicationCategory: 'DesignApplication', operatingSystem: 'Web' },
      bots: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot'],
      build: { styles: ['a.css', 'b.css'] }
    };
    await fs.writeFile(path.join(root, 'bilgiler.js'), `export default ${JSON.stringify(config)};`);
    await fs.writeFile(path.join(root, 'src/site/index.html'), '<!doctype html><html lang="tr"><head><link rel="stylesheet" href="a.css"><link rel="stylesheet" href="b.css"><link rel="canonical" href="{{site.origin}}/"><script type="application/ld+json">{{organizationSchema}}</script><script type="application/ld+json">{{softwareSchema}}</script></head><body><h1>{{business.name}}</h1><a href="{{links.phone}}">{{business.phoneDisplay}}</a><a href="{{referencesById.sonar.url}}">Sonar</a><a href="/rehber/">Rehber</a><script src="/app.js"></script><div>{{addressesHtml}}</div><section>{{faqHtml}}</section>{{#each services}}<h2>{{title}}</h2>{{#each items}}<p>{{label}}</p>{{/each}}{{/each}}</body></html>');
    await fs.writeFile(path.join(root, 'src/site/rehber/index.html'), '<html><head><link rel="canonical" href="{{site.origin}}/rehber/"></head><body><h1>Rehber</h1><a href="/#teklif">Teklif</a></body></html>');
    await fs.writeFile(path.join(root, 'src/site/ornekler/index.html'), '<html><head><meta name="robots" content="noindex,follow"><link rel="canonical" href="{{site.origin}}/ornekler/"></head><body><h1>Kurgu</h1></body></html>');
    await fs.writeFile(path.join(root, 'src/site/a.css'), '.a{background:url("/assets/a.webp")}');
    await fs.writeFile(path.join(root, 'src/site/b.css'), '.b{color:red}');
    await fs.writeFile(path.join(root, 'src/site/demos.css'), '.demo{color:blue}');
    await fs.writeFile(path.join(root, 'src/site/app.js'), 'const page="/rehber/"; const phone=window.HD_MEDYA.links.phone;');
    await run(root, config);
  } finally {
    const relative = path.relative(fixtures, root);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Unsafe fixture cleanup path');
    await fs.rm(root, { recursive: true, force: true });
  }
}

test('one bilgiler.js change updates pre-rendered HTML, runtime data and schemas', async () => fixture(async (root, config) => {
  let result = await buildSite({ projectRoot: root });
  assert.equal(result.htmlPages, 3);
  assert.equal(result.sitemapUrls.length, 2);
  let html = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.match(html, /HD &amp; Medya/);
  assert.match(html, /Mobil kullanım/);
  assert.equal((html.match(/href="\/site\.css"/g) || []).length, 1);
  assert.doesNotMatch(html, /href="[ab]\.css"/);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.equal(schemas[0].address.length, 2);
  assert.equal(schemas[1].publisher['@id'], schemas[0]['@id']);
  assert.match(await fs.readFile(path.join(root, 'dist/sitemap.xml'), 'utf8'), /hdmedyaeskisehir\.com\.tr\/rehber\//);
  assert.doesNotMatch(await fs.readFile(path.join(root, 'dist/sitemap.xml'), 'utf8'), /ornekler/);
  assert.match(await fs.readFile(path.join(root, 'dist/robots.txt'), 'utf8'), /User-agent: \*\nAllow: \/[\s\S]*User-agent: GPTBot\nAllow: \//);
  assert.equal(await fs.readFile(path.join(root, 'dist/CNAME'), 'utf8'), 'hdmedyaeskisehir.com.tr\n');
  assert.equal(await fs.readFile(path.join(root, 'dist/.nojekyll'), 'utf8'), '');
  await fs.access(path.join(root, 'dist/demos.css'));
  await assert.rejects(fs.access(path.join(root, 'dist/a.css')));
  config.business.phoneE164 = '+905551112233';
  config.business.phoneDisplay = '0555 111 22 33';
  config.business.whatsappNumber = '905551112233';
  await fs.writeFile(path.join(root, 'bilgiler.js'), `export default ${JSON.stringify(config)};`);
  result = await buildSite({ projectRoot: root });
  html = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.match(html, /tel:\+905551112233/);
  assert.doesNotMatch(html, /905368835867/);
  const runtime = await fs.readFile(path.join(root, 'dist/site-data.js'), 'utf8');
  assert.match(runtime, /905551112233/);
  assert.doesNotMatch(runtime, /"build"/);
}));

test('repository previews rewrite root paths without changing target-domain canonicals', async () => fixture(async root => {
  const result = await buildSite({ projectRoot: root, basePath: '/hdmedyaeskisehir/' });
  assert.equal(result.basePath, '/hdmedyaeskisehir');
  const html = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.match(html, /href="\/hdmedyaeskisehir\/site\.css"/);
  assert.match(html, /href="\/hdmedyaeskisehir\/rehber\/"/);
  assert.match(html, /src="\/hdmedyaeskisehir\/app\.js"/);
  assert.match(html, /href="https:\/\/hdmedyaeskisehir\.com\.tr\/"/);
  assert.match(await fs.readFile(path.join(root, 'dist/site.css'), 'utf8'), /url\("\/hdmedyaeskisehir\/assets\/a\.webp"\)/);
  assert.match(await fs.readFile(path.join(root, 'dist/app.js'), 'utf8'), /"\/hdmedyaeskisehir\/rehber\/"/);
  assert.match(await fs.readFile(path.join(root, 'dist/rehber/index.html'), 'utf8'), /href="\/hdmedyaeskisehir\/#teklif"/);
}));

test('invalid templates fail without replacing a previous working output', async () => fixture(async root => {
  await buildSite({ projectRoot: root });
  const previous = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
  await fs.writeFile(path.join(root, 'src/site/index.html'), '<h1>{{business.missing}}</h1>');
  await assert.rejects(buildSite({ projectRoot: root }), /unknown template token/);
  assert.equal(await fs.readFile(path.join(root, 'dist/index.html'), 'utf8'), previous);
  await assert.rejects(buildSite({ projectRoot: root, outputDir: '..' }), /must be a child directory/);
}));

test('check mode validates a complete build without replacing dist', async () => fixture(async root => {
  const result = await buildSite({ projectRoot: root, check: true });
  assert.equal(result.checkedOnly, true);
  await assert.rejects(fs.access(path.join(root, 'dist/index.html')));
}));

 test('sensitive source file fails build and keeps previous working output',async()=>{await fixture(async root=>{await buildSite({projectRoot:root});const previous=await fs.readFile(path.join(root,'dist/index.html'),'utf8');await fs.writeFile(path.join(root,'src/site/.env'),'PRIVATE_VALUE=do-not-publish');await assert.rejects(buildSite({projectRoot:root}),/Sensitive/);assert.equal(await fs.readFile(path.join(root,'dist/index.html'),'utf8'),previous);});});
