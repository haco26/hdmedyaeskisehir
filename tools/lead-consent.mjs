import architecture from '../mimari.js';
export function injectLeadConsent(html, config) {
 return injectRequestNotice(html, config);
}
export function legalIdentityHtml(config){return `<p>Veri sorumlusu: <strong>${escapeHtml(config.legal?.controllerName || config.business?.contactName || 'Hacer Durukan')}</strong> · ${escapeHtml(config.business?.name || 'HD Medya')}.</p>`;}
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function injectRequestNotice(html, config) {
 const notice=config.ui?.legalNotice || architecture.legalNotice;
 let used=false;
 html=html.replace(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi,(all,attrs,body)=>{
  const id=/\bid="([^"]+)"/.exec(attrs)?.[1];
  if(!['contactForm','seoAnalysisForm','auto-quote-form'].includes(id)||body.includes('data-lead-consent'))return all;
  used=true;body=body.replace(/<p class="form-legal"[^>]*>[\s\S]*?<\/p>/g,'');
  const component=`<div class="lead-trap" aria-hidden="true"><label for="${id}-website-confirm">Website confirmation<input id="${id}-website-confirm" name="website_confirm" type="text" tabindex="-1" autocomplete="off"></label></div><div class="consent-card" data-lead-consent data-version="${escapeHtml(config.legal?.version||'2026-11-01')}"><p class="consent-copy">${escapeHtml(notice.copy)} <a href="/yasal/kvkk/" target="_blank" rel="noopener">${escapeHtml(notice.link)}</a></p><label for="${id}-ack"><input id="${id}-ack" type="checkbox" name="privacyAcknowledgement" value="${escapeHtml(config.legal?.version||'2026-11-01')}"><span class="consent-copy">${escapeHtml(notice.acknowledgement)} <small>${escapeHtml(notice.optional)}</small></span></label><div class="consent-links"><a href="/yasal/gizlilik/" target="_blank" rel="noopener">${escapeHtml(notice.privacy)} ↗</a><a href="tel:${escapeHtml(config.business?.phoneE164||'+905368835867')}">${escapeHtml(notice.phone)} ↗</a></div><span class="lead-message" data-lead-message role="status"></span></div>`;
  return `<form${attrs} data-lead-form>${body.replace(/<button\b[^>]*type="submit"[^>]*>/i,match=>component+match)}</form>`;
 });
 if(used&&!html.includes('src="/lead-consent.js"'))html=html.replace('</head>','<script src="/lead-consent.js" defer></script>\n</head>');
 return html;
}
