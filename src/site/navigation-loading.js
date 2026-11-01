/* Local progressive artwork and compact page utilities. No network actions. */
(() => {
  if (document.documentElement.dataset.navigationLoading === 'ready') return;
  document.documentElement.dataset.navigationLoading = 'ready';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 850px)');
  const header = document.querySelector('.nav-shell');
  const stage = document.querySelector('#heroStage');
  if (stage) {
    const status = document.createElement('span');
    status.className = 'hero-load-status';
    status.setAttribute('role', 'status');
    stage.append(status);
    const updateArtwork = () => {
      const failed = stage.classList.contains('scene-failed') || stage.dataset.scene === 'failed';
      const ready = stage.classList.contains('ready') && stage.dataset.materialWarm === 'true';
      const next = failed ? 'fallback' : ready ? 'complete' : stage.dataset.reliefVertices ? 'surface' : stage.querySelector('.hero-art img')?.complete ? 'poster' : 'waiting';
      if (stage.dataset.loadPhase === next) return;
      stage.dataset.loadPhase = next;
      status.textContent = next === 'complete' ? 'Etkileşimli monogram hazır.' : next === 'fallback' ? 'Monogram önizlemesi.' : 'Monogram hazırlanıyor';
    };
    new MutationObserver(updateArtwork).observe(stage, {attributes:true, attributeFilter:['class','data-scene','data-material-warm','data-relief-vertices']});
    stage.querySelector('.hero-art img')?.addEventListener('load', updateArtwork, {once:true});
    updateArtwork();
  }

  const contact = document.querySelector('a.floating-contact');
  const dock = document.createElement('nav');
  dock.className = 'utility-dock';
  dock.setAttribute('aria-label', 'Sayfada gezinme ve iletişim');
  const arrow = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M6 13 14 5 22 12M14 6 13 24"/></svg>';
  for (const direction of [-1, 1]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'utility-scroll ' + (direction < 0 ? 'utility-up' : 'utility-down');
    button.dataset.scrollDirection = String(direction);
    button.setAttribute('aria-label', direction < 0 ? 'Bir ekran yukarı kaydır' : 'Bir ekran aşağı kaydır');
    button.title = button.getAttribute('aria-label');
    button.innerHTML = arrow;
    button.addEventListener('click', () => scrollBy({top:direction * innerHeight * .85, behavior:reduce.matches ? 'instant' : 'smooth'}));
    dock.append(button);
  }
  dock.addEventListener('keydown', event => {
    if (!['Home','End'].includes(event.key)) return;
    event.preventDefault();
    scrollTo({top:event.key === 'Home' ? 0 : document.documentElement.scrollHeight, behavior:reduce.matches ? 'instant' : 'smooth'});
  });
  if (contact) {
    const label = document.createElement('span');
    label.className = 'utility-contact-label';
    label.textContent = 'WhatsApp';
    contact.innerHTML = '<svg class="utility-contact-icon" viewBox="0 0 28 28" aria-hidden="true"><path d="M23 13a9 9 0 0 1-13 8l-6 2 2-6a9 9 0 1 1 17-4Z"/><path d="m10 8-1 3c1 4 3 6 7 7l3-2-3-2-1 1c-2-1-3-2-3-4l1-1Z"/></svg>';
    contact.append(label);
    dock.append(contact);
  }
  document.body.append(dock);
  const up = dock.querySelector('.utility-up'), down = dock.querySelector('.utility-down');
  let lastY = Math.max(0, scrollY), anchorY = lastY, direction = 0, frame = 0;
  function update() {
    frame = 0;
    const limit = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const y = Math.min(limit, Math.max(0, scrollY));
    up.disabled = y < 3;
    down.disabled = y >= limit - 3;
    dock.style.setProperty('--page-progress', String(limit ? y / limit : 0));
    const nextDirection = Math.sign(y - lastY);
    if (nextDirection && nextDirection !== direction) {direction = nextDirection; anchorY = lastY;}
    const open = document.querySelector('#navLinks')?.classList.contains('open');
    const focused = header?.contains(document.activeElement) && document.activeElement?.matches(':focus-visible');
    if (!mobile.matches || y < 100 || open || focused) header?.classList.remove('nav-is-hidden');
    else if (Math.abs(y - anchorY) > 9) header?.classList.toggle('nav-is-hidden', direction > 0 && y > 160);
    lastY = y;
  }
  function schedule() {if (!frame) frame = requestAnimationFrame(update);}
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  mobile.addEventListener('change', schedule);
  header?.addEventListener('focusin', () => header.classList.remove('nav-is-hidden'));
  document.querySelector('#menuToggle')?.addEventListener('click', () => {header?.classList.remove('nav-is-hidden'); schedule();});
  update();
})();
