# KVKK: uygulama ve işletme kontrol notu

1 Kasım 2026. Bu dosya ekip içindir; web sayfası değildir.

## Tamamlanan uygulama

- KVKK, gizlilik ve çerez sayfaları mevcut site mimarisine göre yazıldı; kullanıcıya “metni doldurun” diyen taslak paragraflar kaldırıldı.
- Kullanıcının paylaştığı Hacer Durukan kimliği, telefon ve iki adres kullanıldı. Tüzel kişi, vergi/sicil numarası veya VERBİS kaydı uydurulmadı.
- Aydınlatma, işleme amaçları, veri kategorileri, alıcılar, yöntem/hukuki sebep ve ilgili kişi hakları açıklandı.
- Başvuru kanalı olarak verilen gerçek Çamlıca adresine imzalı yazılı başvuru tanımlandı; yasal 30 günlük cevap süresi belirtildi.
- Aydınlatma okuma teyidi isteğe bağlıdır. Onaysız teklif engellenmez. Reklam/toplu ileti izni toplanmaz.
- Site form içeriğini kendi sunucusuna kaydetmez; kullanıcı tarafından açılan WhatsApp bağlantısı taslağı ilgili sağlayıcıya iletir. İletişimin HD Medya'ya gönderimini kullanıcı yapar.
- WhatsApp yerine telefon ve yazılı iletişim alternatifi bulunur. Her WhatsApp bağlantısı otomatik olarak bir onay duvarına yönlendirilmez.
- Monogramın işlevsel IndexedDB önbelleği açıklanır. Kullanıcı kimliği veya reklam analitiği eklenmez.
- Fontların siteyle birlikte sunulması hedeflenmiştir; dış font isteği final build kontrolünde doğrulanmalıdır.

## Metinle çözülemeyen işletme gerçekleri

Bunlar kodla üretilemez veya garanti edilemez:

1. Kullanıcının “kurucu Hacer Durukan” beyanı, işletmenin resmî vergi/ticaret unvanının doğrulanması değildir. Public metin kullanıcıca verilen kişiyle kurulmuştur. Gerçekte veri sorumlusu ayrı bir tüzel kişiyse ilgili adı gerçek belgeleriyle eşleştirmek gerekir; sistemde bunun tek kaynağı bilgiler.js'dir.
2. İşletme bu talep yazışmalarını nerede yedekliyor, cihazlara kim erişiyor ve hangi saklama-imha prosedürünü uyguluyor? Kaynak kod bunları göstermez. Bu yüzden sabit ve uydurma saklama süresi yazılmadı; gerekli amaç/hukuki süre ilkesi yazıldı. Fiilî operasyon bu ilkeyle uyumlu yürütülmelidir.
3. GitHub Pages, WhatsApp ve varsa işletme yedekleme hizmetlerinin yurt dışı aktarımına ilişkin uygun hukuki mekanizmalar, sağlayıcı sözleşmeleri ve fiilî kullanım modeliyle değerlendirilmelidir. Rıza kutusu, “WhatsApp tercih edildi” ifadesi veya gizlilik metni düzenli aktarımı otomatik olarak uygun hale getirmez. Bu çalışma sağlayıcıyla standart sözleşme imzalandığını iddia etmez.
4. VERBİS yükümlülüğü işletmenin gerçek niteliği ve ilgili istisna koşullarıyla belirlenir. Kayıt numarası bulunmaması hukuki uyumun bulunduğunu veya bulunmadığını tek başına göstermez.
5. Resmî başvuruların gerçek adreste teslim alınması ve 30 gün içinde yanıtlanması işletmenin sorumluluğundadır. İletişim metni bu operasyonu kurmuş sayılmaz.

Bu doğrulanamayan gerçekler nedeniyle “hukuki uyum garanti edildi” denmez. Kullanıcının metni doldurmasını gerektiren genel şablon bırakılmamış; gerçek operasyonla eşleştirilmesi gereken sınır burada açıkça kaydedilmiştir.

## Kaynaklar

- [Aydınlatma duyurusu](https://www.kvkk.gov.tr/Icerik/6765/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESI-HAKKINDA-KAMUOYU-DUYURUSU)
- [Açık rıza ilkeleri](https://www.kvkk.gov.tr/Icerik/2037/Acik-Riza-Alirken-Dikkat-Edilecek-Hususlar)
- [Yurt dışına aktarım](https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim)
- [İlgili kişi başvurularını cevaplama yükümlülüğü](https://www.kvkk.gov.tr/Icerik/2046/Ilgili-Kisiler-Tarafindan-Yapilan-Basvurularin-Cevaplanmasi-Yukumlulugu)
- [Başvuru usulü](https://kvkk.gov.tr/SharedFolderServer/CMSFiles/bf638c8f-7455-49a7-8118-3eb2858a16b5.pdf)
- [GitHub gizlilik bildirimi](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [WhatsApp gizlilik politikası](https://www.whatsapp.com/legal/privacy-policy)
