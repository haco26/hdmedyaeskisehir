# HD Medya — kaynak kod, makaleler ve GitHub Pages kullanım kılavuzu

Bu proje **statik bir sitedir**. Veritabanı, PHP, yönetim paneli, mesaj gönderen sunucu veya ücretli bir API bağlantısı içermez. Hazırlık ve denetim yerelde yapılmıştır; GitHub’a push, DNS değişikliği veya canlı yayın yapılmamıştır.

## 1. Hangi klasörü GitHub’a yükleyeceğim?

Önerilen teslim klasörü: **`HD-Medya-Kaynak`**. Bu klasörün **içindekileri deponun köküne** yükleyin. Depoda `package.json`, `bilgiler.js`, `src`, `tools`, `content`, `templates`, `docs` ve **`.github/workflows/pages.yml`** aynı kökten erişilebilir olmalıdır. Bunları bir üst `HD-Medya-Kaynak/` klasörünün içinde bırakmayın. Windows’ta noktayla başlayan `.github` klasörünün de yüklendiğini kontrol edin.

`HD-Medya-Statik` ayrı, önceden üretilmiş yayın çıktısıdır. Yalnız statik dosyaları yayınlayan farklı bir yöntem seçerseniz kullanılabilir; kaynak düzenlemek ve makale eklemek için **Kaynak** klasörünü saklayın. ZIP’i doğrudan depoya yüklemek içindeki siteyi açmaz; önce çıkarın.

Kaynak tesliminde `.git`, `.openai`, `.build`, kişisel çalışma klasörleri, kimlik bilgileri ve `node_modules` bulunmaz. `dist` derleme sırasında yeniden oluşur. Şifre, özel anahtar veya token hiçbir kaynak dosyasına konmamalıdır; bu sitedeki bütün tarayıcı dosyaları ziyaretçilerce okunabilir.

## 2. İlk yayın: GitHub üzerinden

1. Kendi GitHub hesabınızda depo oluşturun veya kullanılacak depoyu açın.
2. Kaynak klasörünün içeriğini köke yükleyin/commit edin. `main` farklıysa aşağıdaki adımlarda kendi dalınızı seçin.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions** seçin. Hesap/organizasyon politikalarının Pages ve Actions kullanımına izin vermesi gerekir.
4. **Actions → Publish static site to GitHub Pages → Run workflow** açın; doğru dalı seçip çalıştırın.
5. Test ve build yeşil olmadan deploy çalışmaz. Başarısızsa ilgili adımın hata kaydını okuyun; hata veren sürümü zorla yayınlamayın.
6. Başarılı deploy’un verdiği URL’yi tarayıcıda açın. Menü, görseller, telefon, formlar, rehber ve 404 sayfasını kontrol edin.

İş akışı **yalnız elle çalışır** (`workflow_dispatch`). Dosya yüklemek veya commit etmek tek başına canlı siteyi değiştirmez. Özel alan adı için Pages ayarlarındaki domain sahipliği/doğrulama ve DNS yönergelerini izleyin; `CNAME` dosyası tek başına DNS ayarı yapmaz. SSL sertifikası hazır olunca Pages’te **Enforce HTTPS** durumunu kontrol edin.

Hedef domain `bilgiler.js → business.domain` için kullanılan `domain` sabitidir: `https://hdmedyaeskisehir.com.tr`. Başka gerçek domain kullanırsanız burada değiştirin. Kanonik URL ve sitemap bu değerden üretilir. Repository alt yolu `configure-pages` çıktısından workflow’a otomatik aktarılır. Yerel alt yol testi için `node tools/build-static.mjs --base-path /depo-adi/` kullanılabilir; hedef domaini sırf yerel önizleme için localhost yapmayın.

## 3. Bilgisayarda çalıştırma ve kontrol

Node.js 24 önerilir; proje 22 ve üzerini destekler. Terminali kaynak klasöründe açın. Projenin npm çalışma bağımlılığı yoktur; normal kullanımda `npm install` gerekmez.

```sh
npm test
npm run check
npm run build
npm run audit:site
npm run audit:security
npm run preview
```

Önizleme: `http://127.0.0.1:4173/`. Durdurmak için Ctrl+C. Port doluysa `npm run preview -- --port 4174`. `file://` ile HTML’yi çift tıklayarak test etmeyin; modüller ve kök bağlantılar doğru çalışmayabilir.

- `check`: geçici çıktı üzerinde build doğrular; çalışan `dist` sürümünü değiştirmez.
- `build`: başarılı sonuçta `dist` klasörünü yeniler. Hatalı içerik önceki başarılı çıktının üzerine yazılmaz.
- `audit:site`: **önce build** edilmiş `dist` içindeki başlık, açıklama, canonical, şema, sitemap, yerel dosya ve bağlantı hedeflerini kontrol eder.
- `audit:security`: tanımlı anahtar/token desenleri, HTML ekleme noktaları ve Action sabitlemelerini inceler. Bu, eksiksiz bir penetrasyon testi veya güvenlik garantisi değildir.

## 4. Sistem mimarisi — ne nereden değişir?

**1 Kasım revizyonu:** Menü, footer, ortak form alanları, buton/başlık kataloğu, kaydırma çubuğu ve yükleme metinleri `mimari.js` dosyasından yönetilir. İşletme/fiyat bilgileri yine `bilgiler.js` içindedir. Adım adım yönetim haritası: [MIMARI-YONETIM.md](docs/MIMARI-YONETIM.md). Araştırma ve kararlar: [STRATEJI-ARASTIRMA.md](docs/STRATEJI-ARASTIRMA.md).

| Dosya / klasör | Görevi |
|---|---|
| `bilgiler.js` | Şirket adı, telefon, adresler, sosyal hesaplar, referanslar, fiyatlar, hizmetler, SSS ve yasal bileşen sürümünün tek veri kaynağı |
| `mimari.js` | Ortak menü, footer, formlar, yükleme ve gezinme etiketleri, renkler, 738 statik arayüz metni |
| `tools/experience-system.mjs` | Ortak header/footer/form üreticileri; her sayfaya build sırasında uygulanır |
| `src/site/index.html` | Ana sayfa bölümleri; ortak kabuk ve metinler merkezi veriden gelir |
| `src/site/` | Eski HTML hizmet/rehber sayfaları, etkileşimler, CSS ve görseller |
| `content/makaleler/*.md` | Yeni makaleler: yalnız içerik ve üst bilgiler |
| `templates/article.html` | Yeni makalelerin ortak başlık, footer ve sayfa kabuğu |
| `tools/article-content.mjs` | Markdown → hazır HTML, makale kartı, içindekiler ve BlogPosting |
| `tools/article-categories.mjs` + `src/site/article-categories.js/css` | Rehber kategori/etiket menüsü ve tarayıcı filtreleri |
| `src/site/fiyat-bolumu.js` | Web, otomasyon ve sosyal medya paketlerinin tek HTML üreticisi |
| `tools/lead-consent.mjs` + `src/site/lead-consent.js` | Tüm gerçek talep formlarının ortak okuma teyidi ve tarayıcı kontrolü |
| `src/site/site.js` | Ana iletişim ve SEO formu; menü, duvar ve ortak etkileşimler |
| `src/site/automation-lab.js/css` | Tarayıcıdaki otomasyon simülasyonu ve talep formu |
| `src/site/scene.js`, `logo-shape.js`, `scene-cache.js` | 3D monogram, yüzey ve işlevsel IndexedDB model önbelleği |
| `src/site/vendor/three/` | Yerel Three.js kütüphanesi ve lisansı; sürüm değişikliği görsel test gerektirir |
| `article-layout.css`, `layout-balance.css`, `brand-review.css`, `company-final.css` | Makale düzeni, ortak hizalama/kontrast ve şirket/footer son düzenleri |
| `tools/build-static.mjs` | Verileri şablonlara uygular, CSS’yi birleştirir, bütün statik çıktıyı üretir |
| `tools/security-policy.mjs` | Nihai inline betik karmalarını hesaplayan meta CSP üreticisi |
| `.github/workflows/pages.yml` | Elle çalıştırılan test → build → Pages yayın akışı |
| `dist/` | Üretilen sonuç; **elle düzenlemeyin** |

Yeni makaleler, başlıklar ve ana metinleri JavaScript kapalıyken de okunabilen HTML olarak üretilir. Kategori filtresi ve simülasyon gibi etkileşimler JavaScript ister. Eski özel HTML rehberleri korunmuştur; bunlar `src/site/rehber` ve `src/site/yerel-rehber` içinde düzenlenir. Yeni yazılarda Markdown yolunu kullanın. Yeni makalelerin şablonu ortak olsa da eski HTML sayfalarının kabuk değişiklikleri otomatik olarak bütün sayfalara yayılmaz; veri değişiklikleri ise `bilgiler.js` üzerinden yayılır.

## 5. Fiyat, telefon ve adres değiştirme

`bilgiler.js` içinde:

- Web paketleri: `pricing[].amount`, adları ve özellikleri aynı listede.
- Otomasyon paketleri: `automationPricing.plans[].amount`.
- Sosyal medya paketleri: `socialMediaPricing.plans[].amount`; ücretler aylık başlangıç fiyatıdır.
- Telefon: `phoneE164` sabiti. Görünen telefon ve WhatsApp hedefi aynı sabitten üretilir.
- Adresler: `addresses` listesi.
- Referanslar: `references` listesi; Top Cleaning doğru hedefi `https://bvtopcleaning.be`.
- Sosyal hesaplar: `instagramUrl`, `xUrl`, `facebookUrl` sabitleri.
- Kurucu adı: `contactName`; rol `business.contactRole`.
- Aydınlatma sürümü ve teyit metni: `legal.version`, `legal.acknowledgement`.

JavaScript söz dizimini koruyun: metin tırnak içinde, tutar sayı olmalıdır. Bir tutarı sadece HTML kartında değiştirmeyin. Değişiklik → test/check → build/önizleme → kaynakları GitHub’a commit → manuel workflow sırasını izleyin.

## 6. Benden bağımsız yeni makale eklemek

### Bilgisayarda taslak oluşturma

```sh
npm run makale:yeni -- yeni-yazi-adresi "Makalenizin uzun veya kısa başlığı"
```

Komut `content/makaleler/yeni-yazi-adresi.md` dosyasını `taslak: true` olarak oluşturur; aynı dosyanın üzerine yazmaz. İçeriği tamamlayın, `taslak: false` yapın ve normal kontrol akışını çalıştırın.

### Yalnız GitHub tarayıcısını kullanma

Depoda **Add file → Create new file** ile `content/makaleler/yeni-yazi-adresi.md` dosyasını oluşturun veya mevcut düğün salonu dosyasını örnek alın. Görsel varsa önce `src/site/assets/blog/` içine yükleyin. İçeriği commit edin. Hazır olduğunda taslağı false yapıp commit edin ve **Actions → Run workflow** ile yayınlayın. Bilgisayarda Node olmadan da Actions build yapabilir; ancak canlı yayından önce yerel önizleme yapmak daha güvenlidir.

```markdown
---
baslik: Eskişehir’de işletmeniz için anlaşılır bir makale başlığı
adres: yeni-yazi-adresi
aciklama: Bu rehber hangi müşteri sorusunu yanıtlıyor?
kategori: Web tasarım rehberi
etiketler: Eskişehir, Yerel işletme
tarih: 2026-11-01
taslak: true
---

Giriş paragrafı.

## Ana bölüm

Somut açıklamalar ve örnekler.

### Alt bölüm

İlgili ayrıntılar.

- İlk madde
- İkinci madde

[Projenizi konuşalım](/#teklif).
```

Başlık H1 olarak üst bilgiden gelir; gövdede `#` kullanmayın. `##`, `###`, paragraflar, `-` listeleri, `**kalın**`, `> alıntı` ve Markdown bağlantıları desteklenir. Ham HTML/script veya karmaşık eklenti kullanmayın. URL parçası küçük Latin harf/rakam/tire olmalı, benzersiz kalmalıdır. Daha önce yayınlanan adresi değiştirirseniz eski bağlantılar kırılır; mümkünse sabit tutun. Tarih `YYYY-MM-DD`; isteğe bağlı `guncelleme` yayın tarihinden önce olamaz.

**Otomatik güncellenenler:** yeni makale sayfası, içindekiler, kategori/etiketler, rehber kartı, son üç makalenin ana sayfadaki alanı, BlogPosting, metadata ve sitemap. Son üç sıralaması tarihe göre; aynı tarihte URL parçasına göre sabittir. Dosya mtime’ına veya GitHub commit saatine güvenmez. Taslaklar listelenmez ve sitemap’e girmez. Gelecekteki tarih otomatik zamanlama sağlamaz; planlı yayın zamanlayıcısı eklenmemiştir.

Kısa ana sayfa seçkileri eski HTML rehberleri için ayrıca kaynak HTML’de tutulur; yeni Markdown yazıların tamamı **Yeni rehberler** alanına otomatik düşer. Her kategorinin daima altı içerik olması bir yayın zorunluluğu değildir; mevcut gruplar altışar içerikle hazırlandı. Yeni yazıların eklenmesi diğer kartları silmez.

## 7. Görsel eklemek zorunda mıyım?

Hayır. `kapak` ve `kapakAlt` alanlarını eklemezseniz görselsiz, metin odaklı kart ve sayfa üretilir; boş görsel çerçevesi oluşmaz.

```text
kapak: /assets/blog/yeni-kapak.webp
kapakAlt: Görselde gerçekten görünen içeriğin kısa açıklaması
```

- Yerel PNG/JPEG/WebP veya güvenlik kontrolünden geçen SVG.
- **16:9**, en az **960 px genişlik**; öneri **1600×900**.
- En fazla **2 MB**; mümkünse **350 KB altında** tutun.
- Görsel eklenirse anlamlı alternatif metin zorunludur.
- Ana nesne/yazıları kenara dayamayın. Küçük kartta da kontrol edin.
- Görsel kullanım hakkını doğrulayın. Temsilî görseli gerçek müşteri işi/fotoğrafı gibi sunmayın.

Başlık en fazla 240, açıklama 500, kategori 80, adres 120, alternatif metin 300 karakter olabilir. Etiketler virgülle ayrılır: en fazla sekiz, her biri 40 karakter. Uzun başlıklar sarılır; bu sınırlar her olası içeriğin kusursuz görüneceği garantisi değildir. Yeni yazıyı en az mobil ve masaüstünde kontrol edin. Daha ayrıntılı kılavuz: [MAKALE-YAYINLAMA.md](docs/MAKALE-YAYINLAMA.md).

## 8. Formlar ve bot mesajları gerçekte nasıl çalışıyor?

Formlar sizin adınıza otomatik WhatsApp mesajı göndermez. Bilgileri bir URL’ye kodlayıp mesaj taslağı açar; kullanıcı WhatsApp’ta gönderir. Bu projede form API’si, kayıt tabanı, SMTP, ücretli mesaj API’si veya API anahtarı yoktur. Sosyal medya paketleri hizmet teklifidir; sitedeki paket kartları hesaplarınıza otomatik paylaşım yapmaz. Simülasyon da gerçek fatura/sipariş yazılımı değildir.

Ortak okuma teyidi başlangıçta boştur ve isteğe bağlıdır. Teklif istemek için işaretlenmesi gerekmez. Gizli tuzak alanı ve geçerli bir mesaj hazırlandıktan sonra aynı form için 30 saniyelik tekrar kontrolü basit bot etkileşimini azaltmayı amaçlar. **Bunlar sunucu tarafı koruma, CAPTCHA, IP hız sınırı veya firewall değildir; aşılabilir.** Yenileme beklemeyi sıfırlar. WhatsApp/telefon numarası herkese açık olduğundan doğrudan spam tamamen engellenemez. Şüpheli hesapları WhatsApp üzerinden engelleyin/raporlayın. İleride gerçek kayıt/mesaj API’si eklenirse sunucuda doğrulama, oran sınırlaması ve kötüye kullanım kontrolleri yeniden tasarlanmalıdır; gizli API anahtarı tarayıcıya konmamalıdır.

İsteğe bağlı okuma teyidi işaretlenirse metin sürümü WhatsApp taslağına eklenir. Teklif talebi bu kutuya bağlı değildir. Statik site bağımsız bir onay günlüğü tutmaz. Aydınlatma, pazarlama izni ve yurt dışı aktarım rızası birbirinden farklıdır. Yasal sayfalar gerçek iletişim bilgileri ve veri akışına göre doldurulmuştur; sahte sicil numarası kullanılmaz. İşletmenin metin dışında uygulaması gereken gerçek yükümlülükleri [özel notta](docs/KVKK-YAYIN-ONCESI.md) açıklanır.

## 9. Güvenlik mimarisi ve sınırlar

- Markdown metni HTML’ye kaçırılır; tehlikeli bağlantı şemaları, kontrol karakterleri, ters eğik çizgi ve URL kullanıcı bilgileri reddedilir.
- Kapak yolu/boyutu/oranı doğrulanır; SVG içindeki script, olay işleyicisi ve dış referans işaretleri kabul edilmez.
- Build geçersiz girdi, çıktı çakışması, symlink veya hassas dosya adı durumunda durur. Bu doğrulamalar kaynaklara yazma yetkisi olan kişiyi güvenilmeyen kullanıcıya dönüştürmez; `bilgiler.js` çalıştırılan güvenilir kaynak koddur.
- Üretilen HTML’de meta CSP vardır: yerel betikler ve tam içerik karmalı inline betikler; eval ve rastgele inline script izni yoktur. `object-src none`, `base-uri self`, `form-action none` kullanılır. Formlar JavaScript ile çalışır; native gönderim engellenir.
- Dinamik görsel/stil ihtiyaçları sebebiyle inline stiller ve data/blob görselleri gereklidir. Fontlar lisanslarıyla birlikte yerel sunulur; ilk açılışta Google Fonts isteği yapılmaz.
- Meta CSP; HTTP yanıt başlıklarının, HSTS’nin, `frame-ancestors`/X-Frame-Options’ın veya hosting güvenliğinin tamamının yerini tutmaz. GitHub Pages özel sunucu kodu veya keyfi güvenlik başlığı yapılandırması sunan bir backend değildir. Bunlar gerekiyorsa uygun bir ön katman/hosting ayrıca değerlendirilir.
- Monogram IndexedDB’de yalnız işlevsel geometri önbelleği tutabilir; kişisel profil/analiz verisi değildir. Tarayıcının site verileri temizlenince yeniden hesaplanır.
- Three.js yerel r161 sürümüdür; yalnız yerel olması güncellik veya açık bulunmaması garantisi vermez. Kütüphane güncellemesi malzeme, ışık ve etkileşim testleriyle birlikte yapılmalıdır.
- GitHub hesabında 2FA, sınırlı depo yazma yetkisi ve uygun dal koruması kullanın. Kaynaklara veya git geçmişine gizli bilgi eklediyseniz yalnız dosyayı silmek yeterli değildir; ilgili anahtarı iptal/değiştirin.

[Detaylı güvenlik raporu](docs/SECURITY-AUDIT.md). Denetim kapsamı yerel kaynak, statik çıktı ve belirtilen tarayıcı akışlarıdır; “hiç açık yok”, DDoS dayanıklılığı veya bütün cihazlarda kusursuzluk garantisi değildir.

## 10. SEO ve yayın sonrası kontrol

Başlık/açıklama/H1, canonical, JSON-LD, görsel alt metni, yerel bağlantılar, noindex/sitemap tutarlılığı otomatik denetlenir. 404, KVKK başvuru sayfası ve kurgu tasarım örnekleri noindex’tir. Uzun editoryal H1 korunur; arama sonucu başlığını `mimari.js` içindeki `pageTitles` alanından ayrıca yönetebilirsiniz.

Yayın sonrasında sizin kontrol etmeniz gerekenler:

1. Gerçek domain, HTTPS sertifikası, yönlendirmeler ve mobil erişim.
2. Search Console domain sahipliği; `https://hdmedyaeskisehir.com.tr/sitemap.xml` gönderimi ve önemli sayfaların URL denetimi.
3. Google’ın Rich Results Test/Schema Validator araçlarında yayın URL’sinin kontrolü.
4. Gerçek telefon, adresler, sosyal hesap hedefleri ve müşteri sitelerinin güncelliği. Sosyal platformlar giriş/bot engeli gösterebilir; bu tek başına bağlantının bozuk olduğunu kanıtlamaz.
5. Gerçek cihazda 3D’nin ilk yüklemesi, kaydırma, menü, simülasyon, form ve azaltılmış hareket tercihi. Yerel süreler gerçek ziyaretçi Core Web Vitals ölçümü değildir.
6. Yayın sonrası Lighthouse/PageSpeed ve Search Console verisini izleyin. Sitemap, şema veya bot izni indeksleme/sıralama/AI önerisi garantisi vermez.

## 11. Bir şey çalışmazsa

| Belirti | Kontrol |
|---|---|
| Yeni yazı görünmüyor | Doğru klasör mü? `.md` mi? `taslak: false` mı? Tarih/slug benzersiz mi? Son workflow başarılı mı? |
| Sadece ana sayfada görünmüyor | Alan yalnız en güncel üç Markdown yazıyı gösterir; aynı tarihte slug sırası uygulanır. |
| Görsel bozuk | Yol büyük/küçük harf dahil birebir aynı mı? Dosya GitHub’a yüklendi mi? 16:9, boyut ve alt metin uygun mu? |
| CSS/görseller repository URL’sinde bozuk | Pages source GitHub Actions mı? Workflow base_path alıyor mu? `dist` dosyalarını elle taşımadınız mı? |
| Form ilerlemiyor | Gerekli alanları kontrol edin. Okuma teyidi isteğe bağlıdır. Yeni talepler arasında kısa bekleme ve botlara karşı gizli alan kontrolü vardır. |
| WhatsApp açılmıyor | Tarayıcı açılır pencere engeli, tekrar beklemesi ve WhatsApp kullanılabilirliğini kontrol edin. Site sunucudan mesaj göndermez. |
| 3D açılmıyor | WebGL/donanım desteği; model yerine poster kalabilir. Konsoldaki gerçek hatayı kontrol edin. |
| Yeni dosya ekleyince build hata veriyor | Hata kaydındaki dosya/alanı düzeltin. Önceki siteyi silerek veya kontrolü kapatarak çözmeye çalışmayın. |
| Değişiklik görünmüyor | Doğru dal, manuel workflow’un son durumu ve tarayıcı/CDN önbelleği. |

## 12. Bakım ve yedek

Her değişiklikte kaynakları commit edin, son çalışan commit’i not edin. Sorun olursa ilgili commit’i geri alıp manuel workflow’u tekrar çalıştırın; sadece `dist` içinde eski dosya kopyalamak sürdürülebilir yedek değildir. İçerik, görsel ve `bilgiler.js` yedeğini birlikte tutun. Actions ve Three.js güncellemelerini ayrı değişiklik olarak test edin. Her yayın öncesi `npm test`, build ve iki audit’i; her büyük tasarım değişikliğinde de tarayıcı kontrollerini tekrarlayın.

Resmî kaynaklar: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [özel domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), [Google sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [OWASP doğrulama](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy).
