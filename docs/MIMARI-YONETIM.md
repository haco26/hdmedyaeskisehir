# HD Medya tek merkezden yönetim

1 Kasım 2026 revizyonu.

## Günlük değişiklik

| İhtiyaç | Değiştirilecek yer |
|---|---|
| Telefon, adres, sosyal hesap, referans, paket fiyatı | `bilgiler.js` |
| Menüdeki sayfalar, ana CTA, footer grupları | `mimari.js`: navigation / primaryCta / footer |
| Teklif ve analiz formu etiketleri | `mimari.js`: forms |
| Ortak KVKK kutusu ve açıklaması | `mimari.js`: legalNotice |
| Kaydırma çubuğu, yükleme aşamaları | `mimari.js`: navigationControls / sceneActivate |
| Kayan hizmet kartları ve sloganları | `mimari.js`: currentServices / controls |
| Statik sayfalardaki butonlar ve başlık metinleri | `mimari.js`: copy. Metni Ctrl+F ile bulun, yalnız değeri değiştirin. Kimliği değiştirmeyin. |
| Ortak renkler | `mimari.js`: design; final bileşen stili `src/site/design-system.css` |
| Makale metni, kategori, tarih, görsel | `content/makaleler/*.md` |
| Uzun hizmet/rehber açıklamaları | İlgili `src/site/.../index.html`; editoryal içerik merkezi UI kataloğundan ayrıdır. |

Değişiklikten sonra `npm run build`, `npm test`, `npm run audit:site`, `npm run audit:security` çalıştırın. Başarılı build, yayına hazır `dist` üretir. Makale kartları/son üç yazı/sitemap kendiliğinden güncellenir. GitHub üzerindeki kaynak değişikliği otomatik deploy tetiklemez; Actions içinden manuel yayın devam eder.

## Mimari

`bilgiler.js + mimari.js + HTML şablonları + Markdown → build-static.mjs → dist`.

Menü/footer `experience-system.mjs` tarafından statik HTML'ye yazılır. JS çalışmasa bile okunur ve bağlantılar erişilebilirdir. Form ortak üreticiden gelir; simülasyon formunun sektör kontrolleri kendi modülünde kalır, ortak aydınlatma bileşeni her üç talep formuna üretimde eklenir.

`mimari.copy` arayüz metinleri HTML üretiminde çözülür; yüzlerce metin tarayıcıya JSON olarak tekrar gönderilmez. Runtime yalnız etkileşim için gereken konfigürasyonu alır. Fiyatlar `fiyat-bolumu.js` üzerinden `bilgiler.js` verisiyle çizilir.

CSS sayfanın kullandığı dosyalara göre paketlenir; hizmet sayfasına ana sayfanın bütün duvar/3D CSS'i eklenmez. Fontlar OFL lisanslarıyla yereldir. Hero posterinin 640/960/1280 sürümleri tarayıcı tarafından ekran boyutuna göre seçilir. 3D motoru posterden sonra yüklenir; mobil kabartma paketi ayrıdır. Sürüm değişince geometri önbelleği yenilenir.

## Yayın ve sınırlar

Yerel önizleme internete yayın değildir. Bu revizyonda üretim sitesi değiştirilmez. Kaynak GitHub'a taşındığında `mimari.js`, yeni fontlar, yeni geometri dosyaları ve tüm tools/src/templates/content birlikte yüklenmelidir; yalnız `index.html` yüklemek yeterli olmaz.

KVKK/gizlilik/çerez metinleri doldurulmuş haldedir. Sayfa metni; ticari kayıt, uluslararası veri aktarım sözleşmesi, saklama uygulaması veya bağımsız onay ispatı oluşturmaz. İşletmenin bu gerçek yükümlülükleri `docs/KVKK-YAYIN-ONCESI.md` içinde belgeyle ayrılmıştır; sicil numarası uydurulmamıştır.
