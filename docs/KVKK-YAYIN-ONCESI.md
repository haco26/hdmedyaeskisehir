# İletişim formu ve KVKK yayın öncesi notları

1 Kasım 2026 — yerel geliştirme; canlı yayın yapılmadı.

- Kayıt/sicil numarası uydurulmadı. bilgiler.js legal.controllerName ve legal.registrationNumber alanları boş bırakıldı; doğrulanmış hukuki kimlik gelince kullanılacak.
- Ortak bileşen tools/lead-consent.mjs içindedir. Şirketin iletişim, SEO ve otomasyon formlarında tek kaynaktan HTML üretilir. Kutucuk başlangıçta boş ve required; JS butonu kapatır, capture-submit kontrolü işaretsiz geçişi durdurur.
- Kutucuk aydınlatmayı okuma teyididir. Reklam/toplu mesaj izni veya bütün veri işleme ve aktarımlar için açık rıza sayılmaz. Böyle bir izin eklenmedi.
- Metin sürümü bilgiler.js legal.version içinde yönetilir; gönderilmeye hazırlanan WhatsApp mesajına okuma teyidi ve sürüm yazılır. Statik sitede bağımsız bir onay günlüğü/veritabanı bulunmaz. Kullanıcı WhatsApp taslağını değiştirebilir; bu yöntem kanıt veya hukuki güvence garantisi değildir.
- Site içindeki doğrudan WhatsApp çağrıları uygun teklif formuna yönlendirilir. Dışarıdan doğrudan telefon/WhatsApp ile iletişim kuran kişiler bu site kontrolüne tabi değildir.
- Veri sorumlusunun hukuki kimliği, gerçek saklama-imha süreleri, usulüne uygun başvuru kanalı ve WhatsApp kaynaklı olası yurt dışı aktarım koşulları yayın öncesi doğrulanmalıdır. Mevcut metin bunların tamamlandığını iddia etmez.

Resmî kaynaklar:
- [Aydınlatma yükümlülüğü](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-)
- [Aydınlatma Tebliği](https://www.kvkk.gov.tr/Icerik/4132/aydinlatma-yukumlulugunun-yerine-getirilmesinde-uyulacak-usul-ve-esaslar-hakkinda-teblig)
- [Aydınlatma ve açık rızanın ayrılığına ilişkin karar](https://www.kvkk.gov.tr/Icerik/6913/2020-404)
- [Yurt dışına aktarım](https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim)
