# Makale yayımlama — tek dosyadan içerik yönetimi

Bu proje statik HTML üretir. Yazıları `content/makaleler/` içindeki Markdown dosyalarında düzenleyin; `dist/` altındaki HTML dosyalarını elle değiştirmeyin. Ana metin JavaScript beklemeden derlenmiş HTML içinde bulunur.

## Yeni yazı eklemek

1. `content/makaleler/` altında kısa, anlamlı bir dosya adıyla `.md` dosyası oluşturun. Mevcut düğün salonu yazısı yayımlanabilir bir örnektir.
2. En üstte aşağıdaki alanları iki `---` satırı arasına yazın. `adres` yalnız benzersiz küçük harf, rakam ve tirelerden oluşan kalıcı URL parçasıdır; tam URL değildir.
3. Yazıyı aşağıda desteklenen Markdown biçimleriyle hazırlayın. Başlık zaten `baslik` alanından H1 olarak üretilir; içerikte ikinci H1 kullanmayın.
4. Önce taslak olarak kontrol edin. Yerel sayfayı görmek istediğinizde `taslak: false` yapıp derleyin. Bu değişiklik kendi başına internet yayını yapmaz.

```text
---
baslik: İşletmenizin müşterisine cevap veren açık bir başlık
adres: benzersiz-yazi-adresi
aciklama: Yazının hangi soruya cevap verdiğini anlatan kısa açıklama.
kategori: Eskişehir sektör rehberi
tarih: 2026-11-01
taslak: true
---
```

Zorunlu alanlar: `baslik`, `adres`, `aciklama`, `kategori`, `tarih`. Tarih `YYYY-MM-DD` biçimindedir. İsteğe bağlı `guncelleme` aynı tarih biçimini kullanır. `taslak: true` yazıyı sayfa üretiminden, listeden ve sitemap’ten çıkarır. Normal yayımlanabilir içerik için `taslak: false` kullanın. Üretilen adres `/rehber/benzersiz-yazi-adresi/` olur; eski yazının adresini değiştirmek mevcut bağlantıları etkiler.

## Görselli veya görselsiz yazı

Kapak isteğe bağlıdır. Görsel ekleyecekseniz dosyayı `src/site/assets/blog/` altına koyun ve üst bilgiye şu iki alanı ekleyin:

```text
kapak: /assets/blog/benzersiz-kapak.webp
kapakAlt: Görseldeki anlamlı içeriğin kısa ve gerçek açıklaması
```

Yerel SVG, PNG, JPG veya WebP kullanın. 16:9 oranında, en az 960 piksel genişlik zorunludur; 1600 × 900 çoğu kapak için uygun başlangıçtır. Ana nesneyi ve varsa kısa yazıyı kenarlara dayamayın: mobil kırpma ve küçük kart görünümü için güvenli boşluk bırakın. Dosyayı gereksiz büyütmeyin, netliği gerçek ekranda kontrol edin. Kapak ekleniyorsa `kapakAlt` zorunludur; anahtar kelime listesi değil, görselin açıklamasıdır.

Görselsiz yazı için `kapak` ve `kapakAlt` alanlarını tamamen kaldırın. Yer tutucu görsel veya boş çerçeve eklemeyin. Başlık ve metin odaklı düzen görselsiz de çalışır. Kullanım hakkınız olmayan fotoğrafı veya gerçek işletmeye aitmiş gibi temsilî görseli kullanmayın.

## Desteklenen metin biçimleri

- `## Bölüm başlığı`: H2; ana bölümler için.
- `### Alt başlık`: H3; yalnız ilgili H2’nin altında.
- Boş satırla ayrılmış paragraflar.
- Satır başında `- ` ile madde listeleri.
- `**önemli ifade**` ile kalın metin.
- `[Bağlantı metni](/hizmetler/isletme-web-sitesi/)` ile bağlantı.
- Satır başında `> ` ile alıntı veya vurgulu açıklama.

Ham HTML, gömülü script veya karmaşık Markdown eklentileri kullanmayın. URL’leri ve iç bağlantıları derlemeden sonra kontrol edin. Yapılandırılmış veri, başlık ve liste girdileri üst bilgiden üretilir; yazı içine ayrıca JSON-LD kopyalamayın.

## İçerik ve tasarım kontrolü

Her yazı farklı bir müşteri sorusunu yanıtlasın. Somut örnek, seçim ölçütü, sık sorulan soru ve anlamlı sonraki adım ekleyin. Gerçekte yapılmamış proje, doğrulanmamış başarı yüzdesi, sahte yorum ve arama hacmi iddiası yazmayın. Şehir adını değiştirerek aynı makaleyi çoğaltmayın.

Tek H1, mantıklı H2/H3 sırası, okunur paragraf uzunluğu ve açıklayıcı bağlantı metni kullanın. Mobilde başlık, kapak, sol konu listesi ve içerik akışını kontrol edin. Kapak yokken boşluk kalmadığını, varsa metinle ilgisini ve alt açıklamasını inceleyin. Fiyatları yazıya elle kopyalamayın; ortak fiyat bölümü ve `bilgiler.js` kaynak olarak kalır.

## Derleme ve yerel inceleme

Proje kökünde:

```text
npm run build
npm run check
npm run preview
```

`build`, kaynaklardan `dist/` çıktısını üretir; `check` derlemeyi doğrular. Başarısız kontrol varsa önce hata verilen alanı düzeltin. Yerel önizlemede yeni `/rehber/{adres}/` sayfasını, rehber listesindeki kartını, telefon/teklif bağlantılarını ve mobil görünümü kontrol edin. Açık bir önizleme zaten çalışıyorsa ikinci sunucu açmak yerine mevcut adresi kullanın.

## İnternet yayını ayrı adımdır

Yerel dosyayı kaydetmek ve derlemek yayın değildir. GitHub Pages için depodaki `.github/workflows/pages.yml` iş akışı manuel `workflow_dispatch` ile çalışır. Yayın onayı verildiğinde değişiklikler ilgili depoya aktarılır, GitHub Actions içinden bu iş akışı elle başlatılır ve tamamlanması kontrol edilir. Bu doküman iş akışını otomatik başlatmaz. Mevcut görevde ayrıca onay olmadan push veya yayın yapılmamalıdır.

## Hızlı taslak komutu

`npm run makale:yeni -- yazi-adresi "Makale başlığı"` yeni dosyayı taslak olarak oluşturur; aynı dosyanın üzerine yazmaz. Görsel alanı eklenmez, isteğe bağlıdır.

## Ana sayfa ve rehber otomatik güncellenir

Yayımlanabilir Markdown yazıları tarihe göre sıralanır. Ana sayfadaki Son yayınlanan yazılarımız alanı en yeni üç yazıyı, rehber dizini tüm yeni yazıları otomatik gösterir. Bunun için her ekleme/düzenlemeden sonra build ve ayrı manuel yayın akışı gerekir; dosyayı tek başına kaydetmek canlı siteyi değiştirmez. Taslaklar iki listede de görünmez.

## Düzeni koruyan sınırlar

Başlık en çok 240, açıklama 500, kategori 80, URL parçası 120 ve kapak alternatif metni 300 karakter olabilir. Kapak en çok 2 MB olabilir; mümkünse 350 KB altında tutun. H3 alt başlığından önce H2 ana başlığı kullanın. Bu hatalar derlemede bildirilir; önceki başarılı çıktı değiştirilmez. Uzun başlıklar otomatik satıra geçer; kartlarda tam başlık korunur.

## Kategori ve etiketler

`kategori` alanı rehber kategorilerini otomatik oluşturur. İsteğe bağlı `etiketler: Randevu, Eskişehir, Yerel işletme` satırında virgülle ayrılmış en çok sekiz etiket kullanabilirsiniz; her etiket en çok 40 karakter olmalıdır. Kategori kartları ve etiket seçimleri derleme sonrasında otomatik güncellenir. JavaScript kapalıyken tüm makaleler görünür.
