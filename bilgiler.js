/**
 * HD Medya'nın TEK bilgi kaynağı.
 * Telefonu, adresleri, referansları, fiyatları ve hizmetleri burada değiştirin.
 * Sonra: npm run build
 * HTML, şemalar, site-data.js, robots.txt ve sitemap.xml birlikte üretilir.
 * GitHub Pages PHP çalıştırmaz; bu dosya derleme sırasında okunur.
 */
const name = 'HD Medya';
const contactName = 'Hacer Durukan';
const instagramUrl = 'https://www.instagram.com/hdmedyaeskisehir/';
const xUrl = 'https://x.com/hdmedyaesk';
const facebookUrl = 'https://www.facebook.com/share/1J6rT41G4T/?mibextid=wwXIfr';
const domain = 'https://hdmedyaeskisehir.com.tr';
const phoneE164 = '+905368835867';
const digits = phoneE164.replace(/\D/g, '');
const national = digits.startsWith('90') ? '0' + digits.slice(2) : phoneE164;
const phoneDisplay = /^0\d{10}$/.test(national)
  ? national.replace(/^(0\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4')
  : phoneE164;
const addresses = [
  {
    "streetAddress": "Çamlıca Mah. Tombakzade Cad. No:57/A",
    "addressLocality": "Tepebaşı",
    "addressRegion": "Eskişehir",
    "addressCountry": "TR",
    "label": "Çamlıca"
  },
  {
    "streetAddress": "Batıkent Mah. Kısmettepe Sok. No:8/A",
    "addressLocality": "Tepebaşı",
    "addressRegion": "Eskişehir",
    "addressCountry": "TR",
    "label": "Batıkent"
  }
];
const references = [
  {
    "id": "sonar",
    "name": "Sonar Teknoloji",
    "url": "https://sonarteknoloji.com.tr"
  },
  {
    "id": "topCleaning",
    "name": "Top Cleaning",
    "url": "https://bvtopcleaning.be"
  },
  {
    "id": "ertorun",
    "name": "Ertorun İnşaat",
    "url": "https://ertoruninsaat.com.tr"
  },
  {
    "id": "durukanInsaat",
    "name": "Durukan İnşaat",
    "url": "https://durukaninsaat.com.tr"
  },
  {
    "id": "durukanEmlak",
    "name": "Durukan Emlak",
    "url": "https://durukanemlak.com"
  }
];
const pricing = [
  {
    "id": "single",
    "name": "Tek Sayfa",
    "amount": 9900,
    "audience": "Yeni işletmeler ve tek hizmet sunanlar için.",
    "features": [
      "Tek sayfa yapı",
      "Mobil uyumlu tasarım",
      "Temel SEO altyapısı"
    ]
  },
  {
    "id": "corporate",
    "name": "Kurumsal",
    "amount": 19900,
    "audience": "Hizmetlerini ve ekibini anlatmak isteyen şirketler için.",
    "features": [
      "Çok sayfalı yapı",
      "Mobil uyumlu tasarım",
      "SEO temel kurulumu"
    ]
  },
  {
    "id": "advanced",
    "name": "Gelişmiş",
    "amount": 34900,
    "audience": "Daha kapsamlı içerik ve özel ihtiyaçları olan markalar için.",
    "features": [
      "Gelişmiş sayfa ve bileşenler",
      "Özelleştirilmiş arayüz",
      "İhtiyaca göre teknik kapsam"
    ]
  }
].map(plan => ({...plan, amountDisplay: new Intl.NumberFormat('tr-TR').format(plan.amount)}));
const automationPricing = {
  eyebrow: 'İŞİNİZE GÖRE OTOMASYON',
  title: 'Tekrarlanan işi azaltın. Ekibinize alan açın.',
  description: 'Tek bir iş akışından başlayın veya birden fazla süreci aynı panelde buluşturun. Önce kapsamı, sonra ilk sürümü birlikte seçelim.',
  note: 'Başlangıç fiyatlarıdır; simülasyon içindeki senaryo bütçesinden bağımsızdır. Kullanıcı sayısı, veri aktarımı, entegrasyonlar, lisanslar, üçüncü taraf ücretleri, bakım ve vergiler yazılı teklifte ayrıca netleştirilir.',
  cta: 'Bu Akışı Birlikte Kuralım ↗',
  plans: [
    {id:'single-flow', label:'İLK AKIŞ', name:'Tek Süreç', amount:24900, audience:'Tekrarlanan tek bir işi düzenlemek isteyen işletmelere.', features:['Bir iş akışı ve temel kayıt ekranları','Durum takibi ve temel kullanıcı rolleri','İlk sürüm kapsamı ve kullanım senaryosu']},
    {id:'operations', label:'BİRLİKTE ÇALIŞAN SÜREÇLER', name:'Operasyon Paneli', amount:49900, audience:'Talep, görev ve müşteri takibini birleştirmek isteyen ekiplere.', features:['Birbirine bağlı talep ve görev akışları','Rol bazlı erişim ve durum ekranları','Temel raporlama ve bildirim kapsamı']},
    {id:'connected', label:'İŞİNİZE ÖZEL SİSTEM', name:'Entegre Operasyon', amount:89900, audience:'Birden fazla veri kaynağını aynı akışta yönetmek isteyen şirketlere.', features:['Birden fazla süreç için özel iş kuralları','Entegrasyon ihtiyaç analizi ve veri haritası','Aşamalı geliştirme ve kabul senaryoları']}
  ].map(plan => ({...plan, amountDisplay: new Intl.NumberFormat('tr-TR').format(plan.amount)}))
};
const socialMediaPricing = {
  eyebrow: 'DÜZENLİ İÇERİK. TUTARLI MARKA.',
  title: 'Sosyal medyada görünür olun. Hikâyenizi birlikte büyütelim.',
  description: 'İçerik takvimi, markanıza uygun tasarımlar ve düzenli paylaşım planı. Web sitenizle aynı dili konuşan bir sosyal medya akışı oluşturalım.',
  period: 'TL / ay’dan',
  cta: 'Markam İçin Planlayalım ↗',
  service: 'Sosyal Medya',
  note: 'Aylık başlangıç fiyatlarıdır. Paylaşım sayıları aylık toplam içerik adedidir; platform başına ayrı üretim anlamına gelmez. Hesap ve içerik kapsamı yazılı teklifte belirlenir. Reklam bütçesi, profesyonel çekim, ücretli görsel/müzik lisansları, kapsam dışı video üretimi, platform araç ücretleri ve vergiler ayrıca değerlendirilir. Erişim, takipçi veya arama sıralaması garantisi verilmez; hesap yetkileri ve paylaşım onayı işletmenizle birlikte planlanır.',
  plans: [
    {id:'social-start',label:'DÜZENLİ BAŞLANGIÇ',name:'Marka Ritmi',amount:6900,audience:'Markasını düzenli ve tutarlı biçimde anlatmak isteyen işletmelere.',features:['Aylık içerik takvimi ve 8 özgün paylaşım','Marka diline uygun görsel ve açıklama metinleri','Hesap izinlerine uygun yayın planlama','Aylık temel performans özeti']},
    {id:'social-growth',label:'İÇERİKTE GÜÇLÜ ADIM',name:'İçerik Atölyesi',amount:11900,audience:'Hizmetlerini farklı içerik formatlarıyla anlatmak isteyen markalara.',features:['Aylık içerik takvimi ve 12 özgün paylaşım','Gönderi ve kaydırmalı içerik tasarımları','Web sitesi hizmetleriyle uyumlu konu planı','Yayın planlama ve aylık değerlendirme görüşmesi']},
    {id:'social-brand',label:'BÜTÜNSEL MARKA AKIŞI',name:'Dijital Marka',amount:19900,audience:'Web sitesi ve sosyal medya iletişimini birlikte planlamak isteyen şirketlere.',features:['Aylık içerik takvimi ve 20 özgün paylaşım','Kampanya dönemleri için içerik serileri','SEO içerikleriyle uyumlu site bağlantı planı','Hesap izinleriyle yayın planlama ve ayrıntılı rapor']}
  ].map(plan=>({...plan,amountDisplay:new Intl.NumberFormat('tr-TR').format(plan.amount)}))
};
const services = [
  {
    "id": "business",
    "title": "İşletme Web Sitesi",
    "description": "İşletmenizin hizmetlerini, çalışma bölgesini ve iletişim yolunu tek yerde toplayın. Tek sayfa veya çok sayfalı yapı, içeriğinize göre belirlenir.",
    "visual": "service-web.webp"
  },
  {
    "id": "commerce",
    "title": "E-Ticaret Web Sitesi",
    "description": "Ürünlerinizi düzenli bir katalogda sunun. Sepet, ödeme, kargo ve diğer entegrasyon ihtiyaçlarını teklif öncesinde ayrı ayrı netleştirelim.",
    "visual": "service-commerce.webp"
  },
  {
    "id": "corporate",
    "title": "Kurumsal Web Sitesi",
    "description": "Şirketinizin uzmanlığını, ekibini ve projelerini anlaşılır bir yapıda gösterin. Hizmet sayfaları, diller ve içerik yönetimi ihtiyacınıza göre planlanır.",
    "visual": "service-brand.webp"
  },
  {
    "id": "software",
    "title": "Özel Web Yazılımı",
    "description": "Tekrarlanan bir iş akışını yönetim paneli, form veya katalogla kolaylaştırın. Kullanıcı rolleri, veri ve entegrasyon gereksinimleri proje kapsamında değerlendirilir.",
    "visual": "service-brand.webp"
  },
  {
    "id": "renewal",
    "title": "Web Sitesi Yenileme",
    "description": "Mevcut sitenizi, korumak istediğiniz içeriklerle birlikte değerlendirelim. Tasarım, mobil kullanım, sayfa bağlantıları ve yeni işlevler için yenileme kapsamını seçelim.",
    "visual": "service-renewal.webp"
  }
].map(service => ({...service, description: service.description.replaceAll('HD Medya', name)}));
const faq = [
  {
    "question": "HD Medya bir yazılım şirketi mi?",
    "answer": "Evet. HD Medya, Eskişehir merkezli bir yazılım ve web tasarım şirketidir. Web sitesi, e-ticaret ve işletmeye özel web yazılımı projeleri geliştirir."
  },
  {
    "question": "HD Medya hangi işletmeler için web sitesi hazırlar?",
    "answer": "HD Medya, küçük yerel işletmeler ve kurumsal firmalar için web sitesi hazırlar. Hizmet işletmeleri, mağazalar, inşaat ve emlak firmaları gibi farklı sektörlerin ihtiyaçlarına göre kapsam belirlenir."
  },
  {
    "question": "Eskişehir dışında hizmet alabilir miyim?",
    "answer": "Evet. Türkiye’nin farklı şehirlerindeki ve yurt dışındaki işletmelerle projeler uzaktan planlanabilir. Görüşmeler, içerik paylaşımı ve geri bildirim adımları çevrim içi yürütülür."
  },
  {
    "question": "Özel web yazılımı nedir?",
    "answer": "Özel web yazılımı, bir işletmenin kendi ihtiyacına göre geliştirilen tarayıcı tabanlı çözümdür. Yönetim paneli, form, katalog veya entegrasyon gibi işlevler proje kapsamına göre belirlenir."
  },
  {
    "question": "Web tasarım fiyatı nasıl belirlenir?",
    "answer": "Web tasarım fiyatı; sayfa sayısı, içerik hazırlığı, dil seçenekleri, özel işlevler ve entegrasyonlara göre belirlenir. Nihai kapsam, vergiler ve ücret yazılı teklifte netleştirilir."
  },
  {
    "question": "Ücretsiz SEO ön analizi nasıl istenir?",
    "answer": "Site adresinizi yazıp WhatsApp’tan ücretsiz SEO ön incelemesi talep edebilirsiniz. Mesajı kontrol edip siz gönderirsiniz; incelenmesini istediğiniz sayfaları veya görünürlük sorununuzu da ekleyebilirsiniz."
  },
  {
    "question": "HD Medya ile nasıl iletişim kurabilirim?",
    "answer": ''
  },
  {
    "question": "HD Medya’nın Eskişehir adresleri nelerdir?",
    "answer": ''
  }
];
faq[0].answer = `Evet. ${name}, Eskişehir merkezli bir yazılım ve web tasarım şirketidir. Web sitesi, e-ticaret ve işletmeye özel web yazılımı projeleri geliştirir.`;
faq[6].answer = `${name}’ya ${phoneDisplay} numarasından telefon veya WhatsApp ile ulaşabilirsiniz. Projenizi, istediğiniz site türünü ve önceliklerinizi paylaşarak teklif isteyebilirsiniz.`;
faq[7].answer = `${name} adresleri: ${addresses.map(a => `${a.streetAddress}, ${a.addressLocality}/${a.addressRegion}`).join(' ve ')}.`;
faq.push(
  {
    question: 'Teklif almak için hangi bilgileri paylaşmalıyım?',
    answer: 'İşletmenizin ne yaptığını, hedef müşterinizi ve sitenizde ziyaretçinin ne yapmasını istediğinizi yazın. Varsa mevcut siteyi, örnek beğenileri, içerik durumunu ve bütçe aralığını ekleyin. Teknik bir dosya hazırlamanız gerekmez; eksik başlıkları birlikte belirleyebiliriz.'
  },
  {
    question: 'Paket fiyatına alan adı, barındırma ve ek özellikler dahil mi?',
    answer: 'Buradaki tutarlar başlangıç fiyatlarıdır. Sayfa sayısı, içerik, dil, alan adı, barındırma, ücretli araçlar, entegrasyonlar ve vergiler yazılı teklifte ayrıca netleştirilir. Bir özelliğin örnekte bulunması, seçtiğiniz pakete dahil olduğu anlamına gelmez.'
  },
  {
    question: 'Örnek sitelerdeki randevu ve ödeme akışları gerçek mi?',
    answer: 'Tasarım örnekleri, olası kullanıcı akışlarını göstermek için hazırlanmış denemelerdir; gerçek randevu, ödeme veya sipariş alınmaz. Canlı bir sistem için iş kuralları, veri yönetimi, gerekli hizmetler ve entegrasyonlar ayrıca değerlendirilir.'
  },
  {
    question: 'Web sitesi ne zaman teslim edilir, yayın sonrası işler nasıl belirlenir?',
    answer: 'Takvim; sayfa ve özellik kapsamına, içeriklerin hazır olmasına ve değerlendirme adımlarına göre oluşturulur. İlk tasarım, geliştirme, kontrol ve yayın aşamaları birlikte planlanır. Erişimler, içerik güncellemeleri, bakım ve ek işlerin kapsamı teklif görüşmesinde netleştirilir.'
  }
);
// Ad, telefon ve adres değişiklikleri diğer cevaplara da yansır.
faq.forEach(item => { item.question = item.question.replaceAll('HD Medya', name); item.answer = item.answer.replaceAll('HD Medya', name); });
const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': ['SoftwareApplication', 'WebApplication'],
  '@id': domain + '/#tasarim-onizleme',
  name: `${name} Etkileşimli Tasarım Örnekleri`,
  url: domain + '/#tasarim-ornekleri',
  description: `${name}’nın farklı sektörler için hazırladığı etkileşimli web tasarım örneklerini gösteren tarayıcı tabanlı önizleme alanı. Katalog, filtre ve örnek kullanıcı akışları içerir; gerçek randevu veya sipariş alınmaz.`,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web tarayıcısı',
  inLanguage: 'tr',
  isAccessibleForFree: true,
  publisher: {'@id': domain + '/#organization'},
  featureList: ['Sektöre göre tasarım önizleme', 'Örnek ilan ve ürün filtreleri', 'Örnek sayfa içi etkileşimler']
};
export default {
  business: {
    contactName, contactRole: 'Kurucu', name, nameEncoded: encodeURIComponent(name),
    wordmark: name.replace(/^HD\s*/i, '').toLocaleUpperCase('tr-TR'),
    domain, phoneE164, phoneDisplay, whatsappNumber: digits,
    description: `${name}, Eskişehir merkezli bir yazılım ve web tasarım şirketidir. Web sitesi, e-ticaret ve işletmeye özel web yazılımı projeleri geliştirir.`,
    xUrl, xHandle: new URL(xUrl).pathname.replaceAll('/', ''), facebookUrl, instagramUrl, instagramHandle: new URL(instagramUrl).pathname.replaceAll('/', ''),
    addresses
  },
  seo: {
    title: `Eskişehir Web Tasarım ve Yazılım Şirketi | ${name}`,
    description: `Eskişehir’de işletme ve kurumsal web sitesi, e-ticaret ve özel yazılım. ${name} ile proje kapsamınızı konuşun: ${phoneDisplay}.`
  },
  positioning: {
    heroPreline: 'Eskişehir’de yazılım ve web tasarım.',
    heroCopy: `İşinizi doğru anlatan bir web sitesi. Ekibinize zaman kazandıran bir iş akışı. ${name} ile web tasarım, e-ticaret ve özel yazılımı işletmenizin ihtiyacına göre planlayın. Eskişehir’de yüz yüze; Türkiye ve yurt dışındaki projelerde uzaktan birlikte çalışalım.`
  },
  references, pricing, automationPricing, socialMediaPricing, services, faq, softwareApplication,
  legal: { version: '2026-11-01', controllerName: 'Hacer Durukan', registrationNumber: '', acknowledgement: 'İletişim talebine ilişkin aydınlatma metnini okudum.' },
  organization: {founder: {'@type':'Person',name:contactName}, logo: domain + '/assets/hd-monogram.svg', contactPoint: {'@type':'ContactPoint', telephone: phoneE164, contactType:'Proje ve teklif', availableLanguage:'tr'}},
  bots: ['OAI-SearchBot','GPTBot','ChatGPT-User','PerplexityBot','Perplexity-User','Googlebot','Bingbot','ClaudeBot','Claude-SearchBot','Claude-User','CCBot','Google-Extended','Applebot','Applebot-Extended','Amazonbot'],
  build: {basePath: '', cname: true, styles: [
  "style.css",
  "ref.css",
  "finish.css",
  "cards.css",
  "update.css",
  "refinement.css",
  "wall.css",
  "atelier.css",
  "neon.css",
  "wall-neon.css",
  "orbit-polish.css",
  "final-direction.css",
  "content-finish.css",
  "evolution.css",
  "pages.css",
  "hero-evolution.css",
  "designer-refinement.css",
  "lead-analysis.css",
  "wall-signature.css",
  "showcase.css",
  "spontaneous.css",
  "material-studio.css",
  "relief-performance.css",
  "entity.css",
  "header-finish.css",
  "section-composition.css",
  "navigation-loading.css",
  "latest-revision.css"
]}
};
