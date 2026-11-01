export function pricingSection(config){
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const plans=config.pricing||[];if(!plans.length)return '';
 return `<section class="shared-pricing prices section" id="fiyatlar" data-shared-pricing><div class="section-head"><div><p class="eyebrow">İŞİNİZE UYGUN BAŞLANGIÇ</p><h2>Web tasarım paketleri.</h2></div><p><span class="section-copy-ink">Sayfaları, işlevleri ve bütçenize uygun kapsamı birlikte belirleyelim.</span></p></div><div class="price-grid">${plans.map((p,i)=>`<article class="price-card ${i===1?'featured':''}"><div class="price-top">${['BAŞLANGIÇ','PROFESYONEL','İLERİ SEVİYE'][i]||'PAKET'}</div><h3>${esc(p.name)}</h3><p>${esc(p.audience)}</p><div class="amount">${esc(p.amountDisplay||p.amount)} <small>TL’den</small></div><ul>${(p.features||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul><a class="price-link" href="/#teklif" data-plan="${esc(p.name)}">Bu Paket İçin Teklif İste ↗</a></article>`).join('')}</div><p class="price-note">Başlangıç fiyatlarıdır. İçerik, dil, özel işlevler, vergiler, alan adı, barındırma ve üçüncü taraf hizmetleri yazılı teklifte netleştirilir.</p></section>`;
}

export function automationPricingSection(config, currentPage='') {
 const data=config.automationPricing;if(!data?.plans?.length)return '';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const target=currentPage==='deneyim/otomasyon/index.html'?'#automation-quote':'/deneyim/otomasyon/#automation-quote';
 return `<section class="shared-pricing automation-pricing section" id="otomasyon-paketleri" data-automation-pricing><div class="section-head"><div><p class="eyebrow">${esc(data.eyebrow)}</p><h2>${esc(data.title)}</h2></div><p><span class="section-copy-ink">${esc(data.description)}</span></p></div><div class="price-grid">${data.plans.map((p,i)=>`<article class="price-card ${i===1?'featured':''}"><div class="price-top">${esc(p.label)}</div><h3>${esc(p.name)}</h3><p>${esc(p.audience)}</p><div class="amount">${esc(p.amountDisplay||p.amount)} <small>TL’den</small></div><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><a class="price-link" href="${target}" data-automation-plan="${esc(p.name)}">${esc(data.cta)}</a></article>`).join('')}</div><p class="price-note">${esc(data.note)}</p></section>`;
}

// Place related packages after the complete web-pricing section, including nested sections.
export function insertAutomationPricing(content, config, currentPage) {
 const eligible=currentPage==='index.html'||currentPage==='deneyim/otomasyon/index.html'||currentPage==='hizmetler/ozel-web-yazilimi/index.html'||/^rehber\/otomasyon-[^/]+\/index\.html$/.test(currentPage);
 if(!eligible||content.includes('data-automation-pricing'))return content;
 const extra=automationPricingSection(config,currentPage);if(!extra)return content;
 const tags=/<\/?section\b[^>]*>/gi;let match,depth=0,inside=false;
 while((match=tags.exec(content))){
  if(!inside){if(!/^<\//.test(match[0])&&/\bid=["']fiyatlar["']/.test(match[0])){inside=true;depth=1;}continue;}
  depth+=/^<\//.test(match[0])?-1:1;
  if(depth===0)return content.slice(0,tags.lastIndex)+'\n'+extra+content.slice(tags.lastIndex);
 }
 throw new Error('Automation packages require a complete #fiyatlar section: '+currentPage);
}

export function socialMediaPricingSection(config) {
 const data=config.socialMediaPricing;if(!data?.plans?.length)return '';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<section class="shared-pricing social-media-pricing section" id="sosyal-medya-paketleri" data-social-media-pricing><div class="section-head"><div><p class="eyebrow">${esc(data.eyebrow)}</p><h2>${esc(data.title)}</h2></div><p><span class="section-copy-ink">${esc(data.description)}</span></p></div><div class="price-grid">${data.plans.map((p,i)=>`<article class="price-card ${i===1?'featured':''}"><div class="price-top">${esc(p.label)}</div><h3>${esc(p.name)}</h3><p>${esc(p.audience)}</p><div class="amount">${esc(p.amountDisplay||p.amount)} <small>${esc(data.period)}</small></div><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><a class="price-link" href="/?service=Sosyal%20Medya&amp;plan=${encodeURIComponent(p.name)}#teklif" data-service="${esc(data.service)}" data-plan="${esc(p.name)}">${esc(data.cta)}</a></article>`).join('')}</div><p class="price-note">${esc(data.note)}</p></section>`;
}
export function insertSocialMediaPricing(content, config, currentPage) {
 const eligible=['index.html','deneyim/otomasyon/index.html','rehber/index.html'].includes(currentPage)||currentPage.startsWith('seo/');
 if(!eligible||content.includes('data-social-media-pricing'))return content;
 const extra=socialMediaPricingSection(config);if(!extra)return content;
 const anchor=content.includes('data-automation-pricing')?'otomasyon-paketleri':'fiyatlar';
 const tags=/<\/?section\b[^>]*>/gi;let match,depth=0,inside=false;
 while((match=tags.exec(content))){
  if(!inside){if(!/^<\//.test(match[0])&&new RegExp('\\bid=["\']'+anchor+'["\']').test(match[0])){inside=true;depth=1;}continue;}
  depth+=/^<\//.test(match[0])?-1:1;
  if(depth===0)return content.slice(0,tags.lastIndex)+'\n'+extra+content.slice(tags.lastIndex);
 }
 throw new Error('Social media packages require complete pricing anchor: '+currentPage);
}
