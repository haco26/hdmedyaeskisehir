/* Local, optional enhancements. Business information stays in generated data. */
(() => {
  if (document.documentElement.dataset.latestRevision === 'ready') return;
  document.documentElement.dataset.latestRevision = 'ready';
  const hero = document.querySelector('main#ust > section.hero');
  if (hero && !document.querySelector('.service-current')) {
    const items = [
      ['Web tasarım', 'İşinizin dijital sahnesi.', '/hizmetler/isletme-web-sitesi/'],
      ['E-ticaret', 'Ürünleriniz öne çıksın.', '/hizmetler/e-ticaret-web-sitesi/'],
      ['Kurumsal web', 'Markanız güçlü görünsün.', '/hizmetler/kurumsal-web-sitesi/'],
      ['Site yenileme', 'Yeni bir başlangıca yer açın.', '/hizmetler/web-sitesi-yenileme/'],
      ['Özel yazılım', 'İş akışınıza göre düşünelim.', '/hizmetler/ozel-web-yazilimi/'],
      ['SEO ve görünürlük', 'Doğru soruda karşılarına çıkın.', '/seo/']
    ];
    const section = document.createElement('section');
    section.className = 'service-current';
    section.setAttribute('aria-label', 'İşinize göre dijital çözümler');
    const heading = document.createElement('div'); heading.className = 'service-current-heading';
    const caption = document.createElement('p'); caption.textContent = 'İŞİNİZ BİR KALIBA SIĞMAZ.';
    const toggle = document.createElement('button');toggle.type = 'button';toggle.className = 'service-current-toggle';toggle.textContent = 'Akışı durdur';toggle.setAttribute('aria-pressed', 'false');
    toggle.addEventListener('click', () => {const paused = section.classList.toggle('is-paused');toggle.setAttribute('aria-pressed', String(paused));toggle.textContent = paused ? 'Akışı sürdür' : 'Akışı durdur';});
    heading.append(caption,toggle);
    const window = document.createElement('div');window.className = 'service-current-window';
    const track = document.createElement('div');track.className = 'service-current-track';
    for (let copy = 0; copy < 2; copy++) {
      const group = document.createElement('div');group.className = 'service-current-group';
      if (copy) {group.setAttribute('aria-hidden','true');}
      for (const [name, slogan, href] of items) {
        const card = document.createElement(copy ? 'div' : 'a');card.className = 'service-current-card';
        if (!copy) card.href = href; else card.addEventListener('click', () => location.assign(href));
        const label = document.createElement('small');label.textContent = name;
        const title = document.createElement('strong');title.textContent = slogan;
        const action=document.createElement('span');action.className='service-current-action';action.textContent='Çözümü incele ↗';card.append(label,title,action);group.append(card);
      }
      track.append(group);
    }
    window.append(track);section.append(heading,window);hero.after(section);
  }
  const proof = document.querySelector('.reference-proof');
  if (proof) {
    const references = [...proof.querySelectorAll('a')].map(a => ({href:a.href,name:a.textContent.replace('↗','').trim()}));
    for (let i=references.length-1;i>0;i--) {const j=Math.floor(Math.random()*(i+1));[references[i],references[j]]=[references[j],references[i]];}
    const caption = proof.querySelector('p');
    const header = document.createElement('div');header.className='reference-flow-heading';header.append(caption);
    const pause=document.createElement('button');pause.type='button';pause.textContent='Akışı durdur';pause.setAttribute('aria-pressed','false');
    pause.addEventListener('click',()=>{const stopped=proof.classList.toggle('reference-paused');pause.setAttribute('aria-pressed',String(stopped));pause.textContent=stopped?'Akışı sürdür':'Akışı durdur';});header.append(pause);
    const viewport=document.createElement('div');viewport.className='reference-flow-window';proof.replaceChildren(header,viewport);proof.classList.add('reference-flow');
    function fillReferences(){
      const track=document.createElement('div');track.className='reference-flow-track';
      const count=Math.max(references.length,Math.ceil(proof.clientWidth/220)+2);
      for(let copy=0;copy<2;copy++){
        const group=document.createElement('div');group.className='reference-flow-group';if(copy)group.setAttribute('aria-hidden','true');
        for(let i=0;i<count;i++){
          const ref=references[i%references.length],duplicate=Boolean(copy||i>=references.length);
          const card=document.createElement(duplicate?'div':'a');card.className='reference-flow-card';
          if(duplicate){card.setAttribute('aria-hidden','true');card.addEventListener('click',()=>window.open(ref.href,'_blank','noopener,noreferrer'));}
          else {card.href=ref.href;card.target='_blank';card.rel='noopener noreferrer';}
          const name=document.createElement('strong');name.textContent=ref.name;
          const emblem=document.createElement('span');emblem.className='reference-icon';emblem.setAttribute('aria-hidden','true');
          const drawing=ref.name.includes('Sonar')?'<path d="M4 19V9l5 3V6l5 5V4h6v15Z"/><path d="M7 16h2m4 0h2"/>':ref.name.includes('Cleaning')?'<path d="M4 4h12v16H4Zm0 8h12M10 4v16m9-13 2 3-2 3-2-3Z"/>':ref.name.includes('Emlak')?'<path d="m3 11 9-8 9 8M6 9v12h12V9m-8 12v-7h4v7"/>':'<path d="M5 21V7l7-4 7 4v14M3 21h18M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1"/>';
          emblem.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+drawing+'</svg>';
          const domain=document.createElement('small');domain.textContent=new URL(ref.href).hostname;
          const action=document.createElement('span');action.textContent='Canlı siteyi incele ↗';card.append(emblem,name,domain,action);group.append(card);
        }track.append(group);
      }viewport.replaceChildren(track);
    }
    fillReferences();let proofWidth=proof.clientWidth;
    new ResizeObserver(()=>{if(proofWidth!==proof.clientWidth){proofWidth=proof.clientWidth;fillReferences();}}).observe(proof);
  }
  const dock = document.querySelector('.utility-dock');
  const action = document.querySelector('.nav-shell .nav-cta');
  if (!dock) return;
  function alignDock() {
    if (!action) return;
    const right = Math.max(12, innerWidth - action.getBoundingClientRect().right);
    dock.style.setProperty('--utility-right', `${right.toFixed(2)}px`);
  }
  let lastY = Math.max(0,scrollY), anchor = lastY, direction = 0, frame = 0, engaged = false;
  function updateDock() {
    frame = 0;
    const limit = Math.max(0,document.documentElement.scrollHeight - innerHeight);
    const y = Math.max(0,Math.min(limit,scrollY));
    document.querySelector('.nav-shell')?.toggleAttribute('data-below-top',y>4);
    const next = Math.sign(y-lastY);
    if (next && next !== direction) {anchor = lastY;direction = next;}
    const protectedUse = engaged || dock.contains(document.activeElement) || document.querySelector('#navLinks.open');
    if (y < 100 || y > limit-100 || protectedUse || direction < 0) dock.classList.remove('dock-is-hidden');
    else if (direction > 0 && y-anchor > 14) dock.classList.add('dock-is-hidden');
    lastY = y;
  }
  const schedule = () => {if (!frame)frame=requestAnimationFrame(updateDock);};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',()=>{alignDock();schedule();},{passive:true});
  dock.addEventListener('pointerenter',()=>{engaged=true;dock.classList.remove('dock-is-hidden');});
  dock.addEventListener('pointerleave',()=>{engaged=false;});
  dock.addEventListener('pointerdown',()=>{engaged=true;dock.classList.remove('dock-is-hidden');},{passive:true});
  dock.addEventListener('pointerup',()=>{engaged=false;},{passive:true});
  dock.addEventListener('pointercancel',()=>{engaged=false;},{passive:true});
  dock.addEventListener('focusin',()=>dock.classList.remove('dock-is-hidden'));
  dock.addEventListener('focusout',schedule);
  if (action) new ResizeObserver(alignDock).observe(action);
  document.fonts?.ready.then(alignDock);
  alignDock();updateDock();
})();
