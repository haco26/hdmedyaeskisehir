import test from 'node:test';
import assert from 'node:assert/strict';
import ui from '../mimari.js';
import config from '../bilgiler.js';
import {applyExperience,sharedHeader,sharedFooter,contactForm} from './experience-system.mjs';
test('shared UI configuration changes every generated component and escapes untrusted text',()=>{
 const altered=structuredClone(ui);altered.primaryCta='Proje <test>';altered.forms.contact.submit='Tek bir metin';
 assert.match(sharedHeader(config,altered),/Proje &lt;test&gt;/);
 assert.match(sharedFooter(config,altered,2026),/Proje &lt;test&gt;/);
 assert.match(contactForm(config,altered),/Tek bir metin/);
 assert.doesNotMatch(sharedHeader(config,altered),/☰|Proje <test>/);
 const page=applyExperience('<main></main><form id="seoAnalysisForm">old</form>',config,altered,2026);
 assert.match(page,/id="analysisUrl"/);assert.match(page,/maxlength="2048"/);
 assert.match(page,/id="main-content"/);assert.doesNotMatch(page,/>old</);
});
test('configured navigation and footer local targets are readable links before JavaScript',()=>{
 const header=sharedHeader(config,ui),footer=sharedFooter(config,ui,2026);
 for(const item of ui.navigation)assert(header.includes(item.href));
 for(const item of ui.footer.legal)assert(footer.includes(item.href));
 assert.match(footer,/Hacer Durukan/);assert.match(footer,/Çamlıca/);assert.match(footer,/Batıkent/);
});
