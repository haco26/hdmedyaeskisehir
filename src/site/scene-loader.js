// The page and finished poster work before the optional 3D engine is requested.
const stage = document.querySelector('#heroStage');
if (stage) {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const economical = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
  let started = false;
  stage.dataset.scene = economical ? 'deferred' : 'scheduled';
  const optIn = document.createElement('button');
  optIn.type = 'button';
  optIn.className = 'scene-activate';
  optIn.textContent = window.HD_MEDYA?.ui?.sceneActivate || 'Monogramı 3D keşfedin';
  optIn.hidden = !economical;
  stage.append(optIn);
  async function launch() {
    if (started) return;
    started = true;
    optIn.hidden = true;
    stage.dataset.scene = 'loading';
    stage.dataset.loadDetail = 'engine';
    performance.mark?.('hd-scene-start');
    try {await import('./scene.js?v=performance-2');}
    catch {stage.dataset.scene = 'failed';stage.classList.add('scene-failed');}
  }
  optIn.addEventListener('click',launch);
  stage.addEventListener('pointerdown', () => {if (!economical) launch();}, {once:true,passive:true});
  const poster = stage.querySelector('.hero-art img');
  const painted = () => new Promise(resolve => requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  async function schedule() {
    if (poster && !poster.complete) await new Promise(resolve => {
      poster.addEventListener('load',resolve,{once:true});
      poster.addEventListener('error',resolve,{once:true});
    });
    await painted();
    if (economical) return;
    const begin = () => {
      if ('requestIdleCallback' in window) requestIdleCallback(launch,{timeout:1800});
      else setTimeout(launch,350);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();begin();}
      },{rootMargin:'200px'});
      observer.observe(stage);
    } else begin();
  }
  schedule();
  new MutationObserver(() => {
    if (stage.dataset.scene === 'ready' && !stage.dataset.performanceMeasured) {
      stage.dataset.performanceMeasured='true';
      performance.mark?.('hd-scene-ready');
      try {performance.measure('hd-scene-preparation','hd-scene-start','hd-scene-ready');} catch {}
    }
  }).observe(stage,{attributes:true,attributeFilter:['data-scene']});
}
