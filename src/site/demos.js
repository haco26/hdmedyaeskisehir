document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const group=button.closest('section');group.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;group.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});const status=group.querySelector('#filterStatus');if(status)status.textContent=count+' örnek seçenek'}));
const tabs={klinik:['Kliniğinizi ilk bakışta anlatın.','Mekânınızı, yaklaşımınızı ve ziyaret öncesinde gerekli bilgileri sakin bir akışta sunun.'],ekip:['Tanışma, güvenin başlangıcıdır.','Gerçek sitenizde ekibinizi kendi onaylı fotoğrafları ve özgeçmişleriyle tanıtabilirsiniz.'],iletisim:['İletişime giden yolu sadeleştirin.','Bu örnekte gerçek klinik randevusu alınmaz. Tasarımı kendi kliniğinize uyarlamak için stüdyoyla görüşebilirsiniz.']};
document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#tabTitle').textContent=tabs[button.dataset.tab][0];document.querySelector('#tabText').textContent=tabs[button.dataset.tab][1]}));
let sampleCount=0;document.querySelectorAll('.sample-cart').forEach(b=>b.addEventListener('click',()=>{sampleCount++;document.querySelector('#cartStatus').textContent=sampleCount+' örnek ürün deneme listenizde. Gerçek sipariş alınmaz.';b.textContent='Listeye eklendi';setTimeout(()=>b.textContent='Deneme listeme ekle',1100)}));
document.querySelector('#rhythmToggle')?.addEventListener('click',event=>{const button=event.currentTarget,on=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(on));document.querySelector('.visual-rhythm').classList.toggle('playing',on);button.textContent=on?'Görsel ritmi durdur':'Görsel ritmi başlat'});

// Browser-local sector experiences. No customer data leaves this page.
(() => {
  const forms=[...document.querySelectorAll('[data-demo-action]')];
  if(!forms.length)return;
  const day=new Date(); day.setMinutes(day.getMinutes()-day.getTimezoneOffset());
  const today=day.toISOString().slice(0,10);
  forms.forEach(form=>form.querySelectorAll('input[type=date]').forEach(input=>{input.value=today;input.min=today}));
  let feedTimer,beatTimer,audio;
  const setlist=[],agenda=[];
  const positive=(value,label)=>{const n=Number(value);if(!Number.isFinite(n)||n<=0)throw new Error(label+' sıfırdan büyük olmalı.');return n};
  function calendar(data){
    const start=new Date(data.get('date')+'T'+data.get('time'));
    if(!Number.isFinite(start.getTime()))throw new Error('Geçerli gün ve saat seçin.');
    const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const escape=value=>String(value).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/[,;]/g,' ');
    const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//HD Medya//Tasarim Ornegi//TR','BEGIN:VEVENT','UID:'+Date.now()+'@demo.invalid','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(new Date(start.getTime()+30*60000)),'SUMMARY:'+escape(data.get('title')),'DESCRIPTION:Kurgusal tasarim onizlemesi. Gercek randevu degildir.','END:VEVENT','END:VCALENDAR'].join('\r\n');
    const url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='ornek-takvim-notu.ics';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  forms.forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault(); const data=new FormData(form),out=form.querySelector('output');
    try{
      switch(form.dataset.demoAction){
        case 'appointment': out.textContent=data.get('service')+' · '+data.get('date')+' · '+data.get('time')+'\nÖrnek saat seçildi. Gerçek randevu oluşturulmadı.';break;
        case 'installment': {const total=positive(data.get('amount'),'Tutar'),months=Number(data.get('months'));out.textContent=months+' örnek ödeme × '+(total/months).toLocaleString('tr-TR',{style:'currency',currency:'TRY'})+'\nFaiz ve ücret içermeyen arayüz hesabı; gerçek teklif değildir.';break;}
        case 'checklist': {const count=data.getAll('checked').length,total=form.querySelectorAll('input[type=checkbox]').length;out.textContent=count+'/'+total+' adım hazır.'+(count===total?' Hazırlık listeniz tamamlandı.':' Kalan adımları işaretleyebilirsiniz.');break;}
        case 'route': out.textContent=data.get('first')+' → '+data.get('channel')+' ile iletişim → Uygun günün birlikte belirlenmesi.\nBu akış yalnız örnektir.';break;
        case 'calendar':calendar(data);out.textContent='Örnek takvim dosyası hazırlandı. İndirdiğiniz not gerçek randevu onayı değildir.';break;
        case 'feeding': {clearInterval(feedTimer);const target=new Date();const [h,m]=data.get('time').split(':').map(Number);target.setHours(h,m,0,0);if(target<=new Date())target.setDate(target.getDate()+1);const update=()=>{const remaining=target-Date.now();out.textContent=remaining<=0?data.get('note')+' — Şimdi zamanı!':data.get('note')+' · '+Math.ceil(remaining/60000)+' dakika sonra. Hatırlatma bu açık sekmede gösterilir.';if(remaining<=0)clearInterval(feedTimer)};update();feedTimer=setInterval(update,15000);break;}
        case 'stock': {const days=Math.floor(positive(data.get('grams'),'Stok')/positive(data.get('daily'),'Günlük miktar'));out.textContent='Girdiğiniz miktarlara göre yaklaşık '+days+' gün. Bu hesap beslenme miktarı önermez.';break;}
        case 'recurring': {const next=new Date();next.setDate(next.getDate()+Number(data.get('days')));out.textContent=data.get('product')+' için sonraki örnek alışveriş: '+next.toLocaleDateString('tr-TR')+'. Abonelik veya sipariş oluşturulmadı.';break;}
        case 'budget': {const total=positive(data.get('price'),'Fiyat')*positive(data.get('quantity'),'Adet'),budget=positive(data.get('budget'),'Bütçe');out.textContent='Örnek sepet: '+total.toLocaleString('tr-TR')+' TL. '+(total<=budget?'Kalan bütçe: '+(budget-total).toLocaleString('tr-TR')+' TL.':'Bütçeyi '+(total-budget).toLocaleString('tr-TR')+' TL aşıyor.');break;}
        case 'profile':out.textContent=data.get('name')+' / '+data.get('type')+'\nSevdiği aktivite: '+data.get('activity')+'\nKart yalnız bu sayfada gösterilir.';break;
        case 'agenda': agenda.push(String(data.get('question')).trim());out.textContent=agenda.map((item,i)=>(i+1)+'. '+item).join('\n');break;
        case 'readability': {const sizes={'Standart':'15px','Büyük':'18px','Daha büyük':'21px'};document.querySelectorAll('.doctor-story p,.doctor-heading .intro').forEach(p=>p.style.setProperty('font-size',sizes[data.get('size')],'important'));out.textContent='Tanışma metinleri için '+String(data.get('size')).toLocaleLowerCase('tr-TR')+' okuma boyutu uygulandı.';break;}
        case 'setlist': {if(!setlist.includes(data.get('track')))setlist.push(data.get('track'));out.textContent=setlist.map((track,i)=>(i+1)+'. '+track).join('\n')+'\nSıra, seçtiğiniz parça sırasına göre oluşur.';break;}
        case 'metronome': {if(beatTimer){clearInterval(beatTimer);beatTimer=null;out.textContent='Ritim durduruldu.';break;}const bpm=positive(data.get('bpm'),'Tempo');if(bpm<40||bpm>180)throw new Error('Tempo 40–180 BPM arasında olmalı.');const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Bu tarayıcı ses önizlemesini desteklemiyor.');audio??=new Audio();audio.resume();let count=0;const beat=()=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=count%4===0?880:660;gain.gain.setValueAtTime(.045,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.06);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.07);out.textContent=bpm+' BPM · Vuruş '+(++count)+' / Örnek metronom';if(count>=64){clearInterval(beatTimer);beatTimer=null;out.textContent+=' · Önizleme tamamlandı.'}};beat();beatTimer=setInterval(beat,60000/bpm);break;}
        case 'booking':out.textContent=data.get('event')+' · '+data.get('date')+' · '+positive(data.get('audience'),'İzleyici')+' kişi\nÖrnek etkinlik brifi hazır; hiçbir yere gönderilmedi.';break;
        case 'theme': {const colors={'Koral':'#ff443f','Elektrik mavisi':'#6098ff','Asit sarısı':'#e8f74b'};document.body.style.setProperty('--accent',colors[data.get('theme')]);document.querySelector('.music-copy h1').style.color=colors[data.get('theme')];out.textContent=data.get('theme')+' sahne atmosferi uygulandı.';break;}
      }
    }catch(error){out.textContent=error.message}
  }));
  addEventListener('pagehide',()=>{clearInterval(feedTimer);clearInterval(beatTimer);audio?.close()},{once:true});
})();
