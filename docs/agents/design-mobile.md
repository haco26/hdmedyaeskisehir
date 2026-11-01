# HD Medya — mobil tasarım ve etkileşim kuralları

- Kimlik: beyaz zemin, koyu yeşil/siyah okunur metin, mercan ve neon lime vurgular. Yeni bir sayfa kendi bağımsız renk paletini üretmez.
- İkonlar SVG'dir. Ok ve işaretlerde işletim sistemi emoji yazı tipine güvenilmez.
- Gezinme ve form kontrolleri dokunmada en az 44 × 44 CSS piksel alan sunar. Mobil metin girişleri en az 16 px olur; Safari'nin odak yakınlaştırması önlenir.
- Sabit kontroller iPhone güvenli alanlarını hesaba katar. Menü, klavye veya ekran okuyucu odağı kontrolü gizleyemez.
- Yukarı/aşağı normal dokunma bir ekran kaydırır. 550 ms basılı tutma ilgili sayfa ucuna anında gider; Home/End aynı işlemi klavyeden yapar. 10 px hareket, işaretçi iptali, ayrılma veya odak kaybı beklemeyi iptal eder. Uzun basmadan sonraki tıklama ikinci bir kaydırma üretmez.
- Uzun basma bir kısayoldur; temel gezinme için zorunlu değildir. İşaretçi olayında pan-y korunur, doğal sayfa kaydırması engellenmez.
- Hareket azaltma tercihinde dekoratif döngüler ve geri bildirim animasyonları kapatılır. İşlemin durumu renk dışında metin/odak ile de anlaşılır.
- Footer hizmet, kanıt, iletişim ve yasal bağlantıları anlaşılır gruplar. Tüm sayfalarda aynı ortak üreticiden gelir; bilgi kopyalanmaz.
- Formlarda native label/input bağı korunur. Aydınlatma metni ile pazarlama rızası karıştırılmaz. Uzun açıklama, butonu dev boyuta zorlamak için grid içine gerilmez.
- Ortak etiketler `mimari.js` → `ui.navigation` üzerinden gelir. Stil `navigation-ux.css` son katmanda yüklenir. Ortak yapı `tools/experience-system.mjs` tarafından üretilir.
- Kontrol genişlikleri: 320, 375, 390, 414, 768 ve 1280 CSS piksel. Uzun başlık, görselsiz makale, uzun link, hata/başarı mesajı ve açık menü senaryoları değerlendirilir.
- Kontrol raporu gerçek iPhone testi ile masaüstü tarayıcı emülasyonunu açıkça ayırır; tek bir emülasyon tüm cihazlar için garanti değildir.
