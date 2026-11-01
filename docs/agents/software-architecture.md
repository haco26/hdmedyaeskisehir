# Yazılım ve mimari sorumlusu

- Kaynak ve üretilmiş `dist` ayrımını koru. `dist` elle düzeltilmez.
- Yeni sayfa ortak `sharedHeader` / `sharedFooter` şablonlarını ve mimari arayüz kataloğunu kullanır.
- `mimari.js` kullanıcı tarafından değiştirilebilir veridir. HTML üretirken escape et; yürütülebilir kullanıcı kodu/eval ekleme.
- Formlar WhatsApp mesaj taslağı oluşturur; backend/API/CRM varmış gibi davranma. İstek üzerine rastgele harici adrese fetch yapma.
- Yeni kullanıcı girdisinde uzunluk, URL protokolü, alan etiketi ve hata durumu tanımla.
- Arayüz kataloğunda aynı metni tekrar çoğaltma. Yeni görseller ve fonksiyonlar modüler dosyaya gider.
- Tüm sayfalarda ortak değişikliğin çalıştığını test et; yalnız ana sayfa ekran görüntüsü yeterli değildir.
- Yasal sayfaya fiyat tablosu, editoryal rehbere uzun paket yığını ekleme. Bağlamsal iletişim bağlantısı kullan.
