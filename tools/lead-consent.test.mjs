import test from 'node:test';
import assert from 'node:assert/strict';
import {injectLeadConsent, legalIdentityHtml} from './lead-consent.mjs';
test('shared notice precedes submit and acknowledgement never gates the service', () => {
  const html = '<head></head><form id="contactForm"><input name="name"><button type="submit">Gönder</button><p class="form-legal">Eski</p></form>';
  const result = injectLeadConsent(html, {legal:{version:'v1'}});
  assert.equal((result.match(/data-lead-consent /g) || []).length, 1);
  assert(result.indexOf('privacyAcknowledgement') < result.indexOf('type="submit"'));
  assert(!result.includes(' required'));
  assert(!result.includes('Eski'));
  assert(result.includes('lead-consent.js'));
  assert.equal(injectLeadConsent(result, {}), result);
});
test('demos and direct contact links remain usable without artificial consent walls', () => {
  const demo = '<form id="demo"><button>Örnek</button></form>';
  const link = '<a href="https://wa.me/123">İletişim</a>';
  assert.equal(injectLeadConsent(demo, {}), demo);
  assert.equal(injectLeadConsent(link, {}), link);
  assert.match(legalIdentityHtml({business:{name:'HD Medya',contactName:'Hacer Durukan'}}), /Hacer Durukan/);
  assert.doesNotMatch(legalIdentityHtml({}), /doğrulanmadığından|sicil/);
});
