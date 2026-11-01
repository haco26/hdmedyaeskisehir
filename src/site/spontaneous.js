/* Small, non-repeating gestures. Navigation and input remain native. */
(() => {
  if (document.documentElement.dataset.spontaneousReady === 'true') return;
  document.documentElement.dataset.spontaneousReady = 'true';
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const variants = ['ink', 'glint', 'lift', 'sketch', 'echo'];
  const selector = [
    '.hero-content h1', '.hero-copy', '.hero-points > span',
    '.section-head h2', '.section-head > p', '.move-intro h2', '.move-intro > p',
    '.glass-card', '.project-item', '.sector-card', '.price-card',
    '.project-journey details', '.move-options details', '.coverage-routes > a',
    '.coverage-grid > div:first-child h2', '.coverage-grid > div:first-child > p',
    '.guide-card', '.faq-list details', '.analysis-intro h2', '.analysis-intro > p',
    '.contact > div > h2', '.contact > div > p', '.contact-direct > a',
    '.reader-intro h1', '.reader-intro > p', '.reader-body h2', '.reader-body p',
    '.reader-cta', '.service-regions article', '.reader-links > a',
    'a.btn', 'button.btn', '.price-link', '.nav-cta', '.nav-links > a',
    '.wall-button', '.text-link', 'footer > a'
  ].join(',');
  const surface = '.glass-card,.price-card,.project-journey details,.move-options details,.coverage-routes > a,.faq-list details,.reader-cta,.service-regions article';
  const state = new WeakMap();
  function choose(previous) {
    const candidates = variants.filter(value => value !== previous);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  function activate(element, method) {
    const current = state.get(element);
    if (!current) return;
    if (method === 'pointer') current.pointer = true;
    else current.focus = true;
    element.dataset.reaction = choose(element.dataset.reaction);
    element.dataset.reactCount = String(Number(element.dataset.reactCount || 0) + 1);
    element.classList.toggle('sp-static', motion.matches || method === 'focus');
    element.classList.add('sp-active');
  }
  function deactivate(element, method) {
    const current = state.get(element);
    if (!current) return;
    current[method] = false;
    if (!current.pointer && !current.focus) {
      element.classList.remove('sp-active', 'sp-static');
      element.style.removeProperty('--sp-x');
      element.style.removeProperty('--sp-y');
    }
  }
  function prepare(element) {
    if (state.has(element) || element.closest('.nav-shell,#heroStage,.street-lamp,input,textarea,select')) return;
    state.set(element, { pointer: false, focus: false });
    element.classList.add('sp-reactive');
    element.dataset.reactCount = '0';
    element.dataset.reactKind = element.matches('.project-item,.sector-card') ? 'project' :
      element.matches('.guide-card') ? 'guide' : element.matches(surface) ? 'surface' :
      element.matches('a,button') ? 'link' : 'text';
    if (element.matches('.guide-card')) {
      const heading = element.querySelector('h3');
      if (heading && !heading.querySelector('.sp-brush-text')) {
        const lettering = document.createElement('span');
        lettering.className = 'sp-brush-text';
        while (heading.firstChild) lettering.append(heading.firstChild);
        heading.append(lettering);
      }
    }
    element.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || !finePointer.matches) return;
      activate(element, 'pointer');
    }, { passive: true });
    element.addEventListener('pointerleave', () => deactivate(element, 'pointer'), { passive: true });
    element.addEventListener('focusin', event => {
      if (element.contains(event.relatedTarget)) return;
      activate(element, 'focus');
    });
    element.addEventListener('focusout', event => {
      if (element.contains(event.relatedTarget)) return;
      deactivate(element, 'focus');
    });
    if (element.dataset.reactKind === 'surface' || element.dataset.reactKind === 'project') {
      let pending = false, x = 50, y = 30;
      element.addEventListener('pointermove', event => {
        if (!finePointer.matches || motion.matches || event.pointerType === 'touch') return;
        const box = element.getBoundingClientRect();
        x = Math.max(0, Math.min(100, (event.clientX - box.left) / Math.max(1, box.width) * 100));
        y = Math.max(0, Math.min(100, (event.clientY - box.top) / Math.max(1, box.height) * 100));
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          element.style.setProperty('--sp-x', x.toFixed(1) + '%');
          element.style.setProperty('--sp-y', y.toFixed(1) + '%');
          pending = false;
        });
      }, { passive: true });
    }
  }
  document.querySelectorAll(selector).forEach(prepare);
  // New demo tiles may be inserted by a page-level gallery without a full load.
  const observer = new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.matches(selector)) prepare(node);
      node.querySelectorAll(selector).forEach(prepare);
    }
  });
  observer.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
  motion.addEventListener('change', () => {
    document.querySelectorAll('.sp-reactive.sp-active').forEach(element => element.classList.toggle('sp-static', motion.matches));
  });
  addEventListener('pagehide', () => observer.disconnect(), { once: true });
})();
