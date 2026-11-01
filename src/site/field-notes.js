/* Browser-local movable idea notes. No storage, network or tracking. */
(() => {
  if (document.documentElement.dataset.fieldNotes === 'ready') return;
  document.documentElement.dataset.fieldNotes = 'ready';
  let gesture = null, suppressUntil = 0, layer = 12000;
  const clamp = (n,a,b) => Math.max(a, Math.min(n, Math.max(a,b)));
  function bounds(note, left, top) {
    const width = note.offsetWidth, height = note.offsetHeight;
    note.style.left = clamp(left,8,document.documentElement.clientWidth-width-8)+'px';
    note.style.top = clamp(top,8,Math.max(innerHeight,document.documentElement.scrollHeight)-height-8)+'px';
  }
  function resize(note, step) {
    note.style.width = clamp(note.offsetWidth+step,Math.min(220,innerWidth-16),Math.min(540,innerWidth-16))+'px';
    note.style.height = clamp(note.offsetHeight+step*.65,210,560)+'px';
    bounds(note,parseFloat(note.style.left),parseFloat(note.style.top));
  }
  function makeNote(card, left, top, focus = false) {
    const note=document.createElement('aside');note.className='field-note';
    const name=card.querySelector('small')?.textContent || 'Hizmet';
    note.setAttribute('aria-label',name+' fikir notu');note.style.zIndex=String(++layer);
    note.style.width=Math.min(290,innerWidth-16)+'px';note.style.height='260px';
    const header=document.createElement('div');header.className='field-note-header';
    const grip=document.createElement('button');grip.type='button';grip.className='field-note-grip';grip.textContent='NOT';
    grip.setAttribute('aria-label',name+' notunu taşı. Odaktayken ok tuşlarıyla hareket ettirin.');
    const tools=document.createElement('div');tools.className='field-note-tools';
    for(const [kind,label,text] of [['shrink','Notu küçült','−'],['grow','Notu büyüt','+'],['close','Notu kaldır','×']]){
      const button=document.createElement('button');button.type='button';button.className='field-note-'+kind;button.textContent=text;button.setAttribute('aria-label',label);
      button.addEventListener('click',()=>{
        if(kind==='close') {note.remove();card.querySelector('.field-pin-toggle')?.focus({preventScroll:true});}
        else resize(note,kind==='grow'?40:-40);
      });tools.append(button);
    }
    header.append(grip,tools);
    const content=document.createElement('div');content.className='field-note-content';
    const label=document.createElement('small');label.textContent=name;
    const title=document.createElement('h3');title.textContent=card.querySelector('strong')?.textContent || name;
    const link=document.createElement('a');link.href=card.dataset.fieldHref;link.textContent='Çözümü incele ↗';
    content.append(label,title,link);note.append(header,content);document.body.append(note);
    bounds(note,left,top);
    note.addEventListener('pointerdown',()=>note.style.zIndex=String(++layer));
    grip.addEventListener('pointerdown',event=>beginNoteDrag(event,note,grip));
    grip.addEventListener('keydown',event=>{
      const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
      if(!moves[event.key])return;event.preventDefault();const [x,y]=moves[event.key],distance=event.shiftKey?50:10;
      bounds(note,parseFloat(note.style.left)+x*distance,parseFloat(note.style.top)+y*distance);
    });
    if(window.ResizeObserver)new ResizeObserver(()=>bounds(note,parseFloat(note.style.left),parseFloat(note.style.top))).observe(note);
    if(focus)grip.focus({preventScroll:true});
    return note;
  }
  function beginNoteDrag(event,note,target) {
    if(event.button!==0||gesture)return;
    event.preventDefault();
    const rect=note.getBoundingClientRect();
    gesture={kind:'note',id:event.pointerId,target,note,dx:event.clientX-rect.left,dy:event.clientY-rect.top};
    target.setPointerCapture(event.pointerId);note.classList.add('field-note-moving');
  }
  function finish(event) {
    if(!gesture || event.pointerId!==gesture.id)return;
    const current=gesture;gesture=null;
    current.section?.classList.remove('field-is-dragging');
    current.note?.classList.remove('field-note-moving');
    if(current.dragged)suppressUntil=performance.now()+350;
    if(current.target.hasPointerCapture(event.pointerId))current.target.releasePointerCapture(event.pointerId);
  }
  document.addEventListener('pointermove',event=>{
    if(!gesture || event.pointerId!==gesture.id)return;
    const g=gesture;
    if(g.kind==='card'&&!g.dragged){
      if(Math.hypot(event.clientX-g.x,event.clientY-g.y)<9)return;
      g.dragged=true;g.section.classList.add('field-is-dragging');
      g.note=makeNote(g.card,event.pageX-100,event.pageY-22);g.note.classList.add('field-note-moving');g.dx=100;g.dy=22;
    }
    if(g.note){event.preventDefault();bounds(g.note,event.pageX-g.dx,event.pageY-g.dy);}
  },{passive:false});
  document.addEventListener('pointerup',finish);
  document.addEventListener('pointercancel',finish);
  document.addEventListener('click',event=>{
    if(performance.now()<suppressUntil && event.target.closest('.service-current-card')){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  function prepare() {
    const section=document.querySelector('.service-current');
    if(!section || section.dataset.fieldNotes==='ready')return;
    section.dataset.fieldNotes='ready';
    const original=[...section.querySelectorAll('.service-current-group:not([aria-hidden]) .service-current-card')];
    const targets=original.map(c=>c.href);
    section.querySelectorAll('.service-current-group').forEach((group,groupIndex)=>{
      [...group.querySelectorAll('.service-current-card')].forEach((old,index)=>{
        const href=old.href || targets[index%targets.length];
        const card=document.createElement('article');card.className=old.className;card.dataset.fieldHref=href;
        while(old.firstChild)card.append(old.firstChild);
        old.replaceWith(card);
        const action=card.querySelector('.service-current-action');
        if(!groupIndex){const link=document.createElement('a');link.className=action.className;link.href=href;link.textContent=action.textContent;action.replaceWith(link);}
        const pin=document.createElement(groupIndex?'span':'button');pin.className='field-pin-toggle';pin.textContent='Not olarak tuttur';
        if(!groupIndex){pin.type='button';pin.setAttribute('aria-label',card.querySelector('small').textContent+' kartını not olarak tuttur');}
        pin.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();makeNote(card,innerWidth/2-145,scrollY+Math.max(120,innerHeight*.32),!groupIndex);});
        card.append(pin);
        card.addEventListener('click',event=>{if(!event.target.closest('a,button,.field-pin-toggle'))location.assign(href);});
        card.addEventListener('pointerdown',event=>{
          if(event.pointerType!=='mouse'||event.button!==0||gesture||event.target.closest('a,button,.service-current-action,.field-pin-toggle'))return;
          event.preventDefault();gesture={kind:'card',id:event.pointerId,target:card,card,section,x:event.clientX,y:event.clientY,dragged:false};
          card.setPointerCapture(event.pointerId);
        });
        card.addEventListener('dragstart',event=>event.preventDefault());
        card.addEventListener('lostpointercapture',finish);
      });
    });
  }
  prepare();new MutationObserver(prepare).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});
  addEventListener('resize',()=>document.querySelectorAll('.field-note').forEach(note=>{
    if(note.offsetWidth>innerWidth-16)note.style.width=(innerWidth-16)+'px';bounds(note,parseFloat(note.style.left),parseFloat(note.style.top));
  }));
})();
