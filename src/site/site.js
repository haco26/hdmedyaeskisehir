/* Shared, optional-page interactions. Business data is generated from bilgiler.js. */
(() => {
  const one = selector => document.querySelector(selector);
  const menu = one('#menuToggle');
  const links = one('#navLinks');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  menu?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });
  links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
  document.querySelectorAll('#year').forEach(year => year.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-plan]').forEach(link => link.addEventListener('click', () => {
    const select = one('#projectSelect');
    if (select) { const value=link.dataset.service||link.dataset.plan; if (![...select.options].some(o=>o.value===value)) select.add(new Option(value,value)); select.value=value; if(link.dataset.service){ const message=one('#contactForm textarea[name=message]');if(message&&!message.value.trim())message.value=link.dataset.plan+' paketi hakkında bilgi almak istiyorum.'; } }
  }));

  const requestedService=new URLSearchParams(location.search).get('service');
  if(requestedService==='Sosyal Medya'&&one('#projectSelect')){one('#projectSelect').value=requestedService;const plan=new URLSearchParams(location.search).get('plan');if(plan&&!one('#contactForm textarea').value.trim())one('#contactForm textarea').value=plan+' paketi hakkında bilgi almak istiyorum.';}
  function whatsapp(lines) {
    const text = window.HDConsent?.message(lines.filter(Boolean).join('\n')) || lines.filter(Boolean).join('\n');
    window.open(window.HD_MEDYA.links.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  }
  one('#contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    whatsapp([
      `Merhaba ${window.HD_MEDYA.business.name}, web sitesi veya yazılım projem için bilgi almak istiyorum.`,
      'Ad / İşletme: ' + String(data.get('name')).trim(),
      'Proje türü: ' + data.get('project'),
      data.get('email') ? 'E-posta: ' + String(data.get('email')).trim() : '',
      'Proje: ' + String(data.get('message')).trim()
    ]);
    one('#formStatus').textContent = 'WhatsApp mesajınız hazırlandı. Açılan ekrandan gönderebilirsiniz.';
  });

  const analysis = one('#seoAnalysisForm');
  const address = one('#analysisUrl');
  address?.addEventListener('input', () => {
    address.setCustomValidity('');
    one('#analysisStatus').textContent = '';
  });
  analysis?.addEventListener('submit', event => {
    event.preventDefault();
    address.setCustomValidity('');
    let url;
    try {
      let value = address.value.trim();
      if (!/^https?:\/\//i.test(value)) value = 'https://' + value;
      url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password || /\s/.test(value)) throw new Error('Invalid site address');
    } catch {
      address.setCustomValidity('Geçerli bir site adresi yazın. Örnek: isletmeniz.com');
      address.reportValidity();
      return;
    }
    whatsapp([
      `Merhaba ${window.HD_MEDYA.business.name}, web sitem için ücretsiz SEO ön analizi istiyorum.`,
      'Site adresi: ' + url.href
    ]);
    one('#analysisStatus').textContent = 'WhatsApp mesajınız hazır. Açılan ekrandan gönderebilirsiniz.';
  });

  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    one('.nav-shell')?.classList.toggle('scrolled', scrollY > 40);
    const progress = one('#progress');
    if (progress) progress.style.width = (100 * scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) + '%';
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  updateScroll();

  document.querySelectorAll('.glass-card').forEach(card => {
    let frame = 0, x = 0, y = 0;
    card.addEventListener('pointermove', event => {
      if (motion.matches || event.pointerType === 'touch') return;
      const box = card.getBoundingClientRect();
      x = (event.clientX - box.left - box.width / 2) / box.width * 10;
      y = -(event.clientY - box.top - box.height / 2) / box.height * 8;
      if (!frame) frame = requestAnimationFrame(() => {
        card.style.setProperty('--card-rx', y + 'deg');
        card.style.setProperty('--card-ry', x + 'deg');
        frame = 0;
      });
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.style.setProperty('--card-rx', '0deg');
      card.style.setProperty('--card-ry', '0deg');
    });
  });
})();

// Wall flip state and keyboard focus; lamp controls are independent.
(() => {
  const scene = document.querySelector('#wallScene');
  const rotor = scene?.querySelector('.wall-rotor');
  const front = document.querySelector('#wallFront');
  const reverse = document.querySelector('#wallReveal');
  const open = document.querySelector('#wallButton');
  const back = document.querySelector('#wallBack');
  if (!scene || !rotor || !front || !reverse || !open || !back) return;
  let fallback, removeEndListener, generation = 0;
  function flipWall(show) {
    const token = ++generation;
    clearTimeout(fallback);
    removeEndListener?.();
    rotor.style.removeProperty('transition');
    scene.classList.add('turning');
    scene.setAttribute('aria-busy', 'true');
    document.dispatchEvent(new CustomEvent('hd:wall-transition', {detail:{active:true}}));
    scene.classList.toggle('flipped', show);
    open.setAttribute('aria-expanded', String(show));
    front.inert = show;
    reverse.inert = !show;
    front.setAttribute('aria-hidden', String(show));
    reverse.setAttribute('aria-hidden', String(!show));
    function finish(event) {
      if (event && (event.target !== rotor || event.propertyName !== 'transform')) return;
      if (token !== generation) return;
      clearTimeout(fallback);
      removeEndListener?.();
      // A busy GPU may delay the compositor beyond the fallback timer.
      // Commit the destination before exposing its controls and clearing busy.
      if (!event) {
        rotor.style.setProperty('transition', 'none', 'important');
        getComputedStyle(rotor).transform;
        requestAnimationFrame(() => {
          if (token === generation) rotor.style.removeProperty('transition');
        });
      }
      scene.classList.remove('turning');
      scene.removeAttribute('aria-busy');
      document.dispatchEvent(new CustomEvent('hd:wall-transition', {detail:{active:false}}));
      (show ? back : open).focus({preventScroll:true});
    }
    rotor.addEventListener('transitionend', finish);
    removeEndListener = () => rotor.removeEventListener('transitionend', finish);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else fallback = setTimeout(() => finish(), 680);
  }
  open.addEventListener('click', () => flipWall(true));
  back.addEventListener('click', () => flipWall(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && scene.classList.contains('flipped')) flipWall(false);
  });
})();
