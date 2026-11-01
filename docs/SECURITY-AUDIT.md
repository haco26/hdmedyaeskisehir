# Güvenlik incelemesi — yerel kaynak denetimi

1 Kasım 2026. Bu çalışma sızma testi, canlı DDoS testi veya güvenlik sertifikası değildir. Dış sistemlere saldırı veya trafik gönderilmedi. Kaynak kodu, statik üretim akışı ve yerel önizleme incelendi. Bulgular inceleme anındaki dosyalara aittir; yayın sonrası sunucu davranışı ayrıca doğrulanmalıdır.

## Sonuç ve kapsam

`node tools/security-audit.mjs` taramasında 117 metin dosyası incelendi. Tanımlanan yüksek güvenli kimlik bilgisi desenleriyle eşleşme bulunmadı. Bu sonuç bütün sırların bulunmadığını kanıtlamaz. Araç değerleri rapora yazmaz; eşleşme olursa dosya ve tür bildirir.

Dört HTML ekleme ifadesi üç dosyada gözden geçirildi: `latest-revision.js`, `navigation-loading.js`, `scene.js`. İncelenen atamalarda SVG/HTML sabit kod parçalarından geliyor. Form, sorgu veya hash içeriğinin bu atamalara taşındığı bir akış tespit edilmedi. Bu nedenle yalnız `innerHTML` bulunması saldırı açığı olarak raporlanmadı. Yeni dinamik içerik eklenirken bu karar yeniden gözden geçirilmelidir.

## Somut bulgular ve öncelikler

1. **Makale URL doğrulamasını sertleştirin.** İnceleme anındaki kök göreli URL dalı ters eğik çizgiyi kabul ediyordu. Tarayıcı bunu farklı bir ağ hedefi olarak yorumlayabilir. Mevcut bağlantı özelliği zaten dış HTTPS bağlantıya izin verdiği için bu gözlem tek başına XSS kanıtı değildir. Ters eğik çizgi, kontrol karakterleri ve URL kullanıcı bilgilerini reddetmek önerildi; düzeltme uygulandı ve URL saldırı denemeleri testlerden geçti.
2. **Yerel önizlemede gerçek dosya yolunu sınırlandırın.** Mevcut sözcüksel `path.relative` kontrolü üst dizin kaçışını sınırlandırıyor; ancak bir symlink/junction gerçek dosyayı başka yere yönlendirebilir. Sunucu yalnız `127.0.0.1` üzerinde dinliyor. Gerçek yol denetimi eklenmesi önerildi; gerçek yol sınırı uygulandı; üst dizin kaçışı yerel testte 403 verdi. Yerel önizleme üretim sunucusu sayılmamalıdır.
3. **CSP için gerçek tarayıcı testi yapın.** İlk incelemede CSP meta bulunmuyordu. Yerel betikler ve importmap için SHA-256 içerik karmalı CSP uygulandı; gerçek tarayıcıda monogram, materyaller ve formlar ihlal vermeden çalıştı. Yetkisiz inline betik engellendi. Görsel ve model için `data:`/`blob:`, Google fontları ve dinamik inline stiller mevcut tasarımın gereksinimleridir. Politika eklendikten sonra konsolda ihlaller ve monogram yükleme denenmelidir. Meta politika, sunucu yanıt başlıklarının yerini her yönden tutuyormuş gibi sunulmamalıdır; frame-ancestors veya başka yanıt başlıkları bu raporda uygulanmış sayılmıyor.
4. **Dış kaynakları içerik bağlantısından ayırın.** Google Fonts stil/font yüklemesi mevcut sayfalarda dış ağ bağımlılığıdır. Kaynak taramasında görülen Google, KVKK, OpenAI ve Perplexity belge bağlantıları ise okuyucu tıklaması içindir; bunları otomatik JavaScript bağımlılığı gibi değerlendirmemek gerekir. Fontları yerelleştirmek olası bir sonraki adımdır; hukuki metinler gerçek veri akışıyla tutarlı tutulmalıdır.
5. **Vendor güncelliğini ayrıca yönetin.** Three.js r161 yerel dosyadan yükleniyor, LICENSE mevcut. Bu denetimde upstream checksum/provenans veya bağımlılık güvenlik veritabanı karşılaştırması yapılmadı. Yerel olması güncel veya kusursuz olduğunu göstermez. Sürüm yükseltme, görsel model davranışı test edilerek yapılmalıdır.

## Makale ve üretim sınırları

Markdown ham HTML'yi kaçırıyor; `javascript:`, `data:` ve protokolsüz dış bağlantı denemeleri testlerde reddediliyor. H1 gövdesine ve yanlış başlık sırasına izin verilmiyor. Slug, tarih, metin uzunlukları, kapak yolu, görsel boyutu ve etiket sayısı sınırları bulunuyor. SVG kapaklar script, olay işleyicisi, foreignObject ve dış referans işaretlerine karşı kontrol ediliyor. Bu kontrol genel amaçlı, her SVG özelliğini kapsayan bir sanitizasyon kütüphanesi olarak sunulmamalıdır. Makale yazarının depo yazma yetkisi zaten güven sınırıdır.

Builder geçersiz girdi durumunda önceki çalışan `dist` sürümünü değiştirmeden hata verir. Üretilen HTML, JSON-LD, kart ve sitemap için testler mevcuttur. Depo içinde yapılandırma JavaScript olduğundan `bilgiler.js` bir kullanıcı formu değil, güvenilen kaynak kodudur. Şifre, API anahtarı veya gizli token bu dosyaya konmamalıdır.

## Formlar, spam ve kişisel veriler

İncelenen iletişim akışı sunucuya kayıt yapan bir backend değildir; alanlar tarayıcıda bir WhatsApp mesaj taslağına dönüştürülür. Metin URL için kodlanır; form değerleri HTML içine yazılmaz. Kullanıcının WhatsApp'ta göndermesi ayrı bir adımdır. WhatsApp bağlantısındaki metin, kullanıcının tarayıcı geçmişinde ve platform tarafında bulunabilir; hassas veri istenmemelidir.

Form içi honeypot veya kısa bekleme kontrolü, varsa yalnız basit istemci etkileşimini azaltır. JavaScript'i atlayan bir istemciyi veya doğrudan WhatsApp spamini engellemez. CAPTCHA, sunucu hız sınırı, kötüye kullanım veritabanı veya firewall uygulanmış gibi iddia edilmemelidir. Böyle bir backend eklenirse doğrulama ve hız sınırlaması sunucuda ayrıca tasarlanmalıdır.

## GitHub ve yayın

İncelenen Pages iş akışı yalnız `workflow_dispatch` ile çalışır; beş GitHub Action tam 40 karakter commit referansına sabitlenmiştir. Build işi salt okunur depo izni, deploy işi yalnız gereken Pages/OIDC izinlerini kullanır. Checkout kimlik bilgilerinin kalıcı tutulması kapalıdır. Bu, hesap güvenliğini veya Action içeriğinin tümüyle güvenli olduğunu kanıtlamaz.

Git geçmişi, GitHub hesabı, branch korumaları, ortam onay kuralları, DNS ve gerçek HTTP yanıtları bu denetim kapsamı dışındadır. Yayından önce GitHub'ın gizli bilgi taraması ve hesap erişimleri ayrıca kontrol edilmelidir. Kaynak veya `dist` içine `.env`, yedekler, SSH anahtarları ve çalışma notları konmamalıdır. README/AGENTS yayın çıktısından çıkarıldı. Hassas dosya adı bulunursa build durur; önceki çalışan çıktı korunur.

## Tekrarlanabilir kontroller

- `node tools/security-audit.mjs`: kaynak desen taraması; gizli değerleri yazdırmaz.
- `node --test tools/security-audit.test.mjs`: tespit, çıktı gizliliği, Markdown saldırı denemeleri ve mevcut kaynak kontrolleri.
- Normal build ve tarayıcı testleri: CSP/model, formlar, bağlantılar, mobil görünüm ve erişilebilirlik.
- Yayından sonra: HTTPS, gerçek yanıt başlıkları, erişim izinleri ve yönlendirmeler için ayrı doğrulama.

Sertleştirmeler tamamlandı. Sonuçlar DENETIM-SONUCLARI.md dosyasında kayıtlıdır. Formlarda honeypot ve form başına 30 saniye istemci bekleme kontrolü vardır; sayfa yenilenerek aşılabilir. Bu rapor “site güvenlidir”, “saldırılara dayanır” veya “veri ihlali olmaz” garantisi vermez.
