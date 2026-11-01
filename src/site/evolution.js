(() => {
  const scene=document.querySelector('#wallScene'),lamp=document.querySelector('#streetLamp');
  if(!scene||!lamp)return;
  const colors=[['sıcak sarı','255,210,95'],['pembe','255,89,165'],['mavi','85,174,255'],['mercan','255,111,72'],['yeşil','193,239,103']];
  let color=0,on=true,wheelAmount=0;
  function update(){
    scene.dataset.lamp=on?'on':'off';scene.style.setProperty('--lamp-rgb',colors[color][1]);
    lamp.setAttribute('aria-pressed',String(on));
    lamp.setAttribute('aria-label',`Duvar ışığını ${on?'kapat':'aç'}. Rengi değiştirmek için sağ ve sol ok tuşlarını kullan.`);
    document.querySelector('#lampStatus').textContent=`Duvar ışığı ${on?'açık':'kapalı'}, ${colors[color][0]}.`;
  }
  function change(amount){color=(color+amount+colors.length)%colors.length;update()}
  lamp.addEventListener('click',()=>{on=!on;update()});
  lamp.addEventListener('wheel',event=>{
    if(event.ctrlKey||event.metaKey||!on)return;
    event.preventDefault();wheelAmount+=event.deltaY;
    if(Math.abs(wheelAmount)>=35){change(wheelAmount>0?1:-1);wheelAmount=0}
  },{passive:false});
  lamp.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();change(event.key==='ArrowRight'?1:-1)}});
  update();
})();
(()=>{const scene=document.querySelector('#wallScene'),lamp=document.querySelector('#streetLamp');if(!scene||!lamp)return;function place(){const s=scene.getBoundingClientRect(),l=lamp.getBoundingClientRect();scene.style.setProperty('--lamp-x',(l.left-s.left+l.width*128/260)+'px');scene.style.setProperty('--lamp-y',(l.top-s.top+l.height*116/160)+'px')}new ResizeObserver(place).observe(scene);place()})();
