# HD Medya çalışma sözleşmesi

Bu depo GitHub Pages için statik HTML üretir. Kullanıcının açık yayın isteği olmadan deploy çalıştırma.

## Değişiklik sahipliği

- Mimari, menü, footer, ortak formlar, renk değişkenleri ve arayüz metinleri: `mimari.js`.
- Gerçek işletme kimliği, sosyal hesaplar, fiyatlar, referanslar, SSS: `bilgiler.js`.
- Yeni editoryal içerik: `content/makaleler/*.md`; sayfa kabuğu: `templates/article.html`.
- Ortak HTML: `tools/experience-system.mjs`; üretim: `tools/build-static.mjs`.
- Ajan uzmanlıkları: `docs/agents/` içindeki yazılım, tasarım/mobil, performans, pazarlama/SEO ve hukuk kuralları.

## Kabul koşulları

1. Beyaz, koyu yeşil, mercan ve lime kimliği korunur. Yeni genel CSS katmanı eklemeden mevcut ortak bileşeni düzelt.
2. Metin okunu/emoji karakterini ikon olarak kullanma. Statik ve dinamik arayüz ortak SVG sistemini kullanır.
3. Menü/footer/form aynı değişikliği her HTML'ye kopyalayarak düzenlenmez. Merkezi veri + üretici kullanılır.
4. Sayfa metni ve iletişim yolu JS/3D beklemeden çalışır. 3D kapanırsa tamamlanmış poster kalır.
5. Gerçek müşteri sonucu, şirket numarası, sertifika veya hukuki güvence uydurulmaz. Görüşme talebi pazarlama iznine bağlanmaz.
6. Mobilde 390 ve 320 px genişlik, klavye, azaltılmış hareket, koyu zemin kontrastı kontrol edilir.
7. Gerekli kontroller: build, unit tests, site/security audit; ortak tasarım değişiminde tüm rotalar tarayıcıda taranır. Fiziksel cihaz kontrolü yapılmadıysa yapılmış gibi söylenmez.
8. Yeni script/stil için CSP, kök ve alt-yol önizlemesi, dosya ağırlığı ve önbellek sürümü değerlendirilir.
