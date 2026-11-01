# HD Medya açılış ve 3D performans stratejisi

## Öncelik

Ziyaretçi önce mesajı, teklif yolunu ve eksiksiz monogram posterini görür. 3D motoru bunların önüne geçmez. Poster yüklenip iki kare çizildikten sonra boşta kalan zamanda, sahne ekrana yakınsa motor alınır. Veri tasarrufu/2G bağlantıda 3D yalnız kullanıcı düğmesine bastığında açılır. Sahne yüklemesi sayfanın kullanımını engellemez.

## Tespit ve uygulama

- İlk ziyaret eski sürümde monogramın yüzeyini tarayıcıda senkron hesaplıyordu. Aynı masaüstü geometri algoritmasının çevrimdışı Node çalışması bu bilgisayarda yaklaşık **5,2 saniye** sürdü. Bu süre saha/telefon ölçümü değildir. Yeni sıkıştırılmış, önceden hazırlanmış yüzey bu hesabı ilk ziyaretçiden kaldırır; yalnız çözme ve GPU yüklemesi kalır.
- Masaüstü gerçek kabartmalı monogram: **418.152 köşe**, **2.033.161 bayt** sıkıştırılmış veri. Mobil: aynı kontur ve tıraşlanmış kenar, daha seyrek iç kabartma: **213.330 köşe**, **1.036.147 bayt**. Mobilin tepe kabartması 0,02825 model birimi; yüzey düzleştirilmedi.
- `gold-normal.png` ve `obsidian-normal.png` SHA-256 özdeşti. İkinci 1.192.698 baytlık isteğin yerine aynı dokunun klonu kullanılır. Mat kömür/sarı metal malzemeleri korunur.
- Mobil çizim oranı DPR 1,5 ile sınırlı (önce DPR 2). Aynı CSS ölçüsünde çizilen piksel sayısı %43,75 azalır. Kurdele bölüm sayısı ve gölge haritası mobilde azaltıldı. Sakin halka 18 FPS, masaüstünde 24 FPS; etkileşim sürerken kare isteği akıcı kalır.
- Ekran dışındayken ve sekme gizliyken var olan çizim durdurma mekanizması korunur. Her halka karesinde gereksiz DOM veri özniteliği yazımı kaldırıldı.
- Yükleme göstergesi gerçek `engine`, `material`, `geometry`, `lighting` aşamalarını izler. Sahte yüzde veya sayfanın tamamını kilitleyen ön yükleyici yoktur. Düşük hareket tercihinde sürekli animasyon kapanır.

## Kaynaklar ve bakım

- `src/site/scene-loader.js`: poster/boşta zaman/görünürlük ve veri tasarrufu kapısı.
- `src/site/scene.js`: gerçek WebGL sahnesi, malzeme, etkileşim ve cihaz bütçesi.
- `src/site/scene-cache.js`: sürümlü, kimliksiz IndexedDB geometri önbelleği; ağ paketi yedek yolu.
- `src/site/scene-performance.css`: yükleme durumunun görünümü; en son yüklenir.
- `tools/precompute-monogram.mjs`: kontur veya kabartma algoritması değiştirilince iki profili üretin: `node tools/precompute-monogram.mjs` ve `node tools/precompute-monogram.mjs --mobile`. Dosya adı/sürümünü değiştirirseniz önbellek anahtarını da değiştirin.

Önceki geometri üretimi yalnız paket çözülemeyen eski tarayıcılar/ağ hataları için yedektir. Önbellek reddi (özel gezinme/dolu disk) sitenin kullanımını engellemez. Hiçbir analitik, kimlik veya form verisi bu önbellekte tutulmaz.

## Kabul ve ölçüm

Otomatik sözdizimi ve paket testleri geçmelidir. Saha için hedef: 75. yüzdelikte LCP ≤2,5 sn, INP ≤200 ms, CLS ≤0,1. Bunlar elde edilmiş skor diye sunulmaz; yayın sonrası gerçek trafik ve PageSpeed/CrUX ile ölçülür. `performance.getEntriesByName('hd-scene-preparation')` yerel sahne hazırlık süresini verir, LCP yerine geçmez. Gerçek iPhone 11/Safari testi ayrıca yapılmalıdır.

Resmî dayanaklar: [Google LCP optimizasyonu](https://web.dev/articles/optimize-lcp), [Three.js duyarlı çizim bütçesi](https://threejs.org/manual/pages/responsive.html). İlk görünüm görseli lazy yüklenmez; ekran altındaki görseller ve sayfaya özgü kod geciktirilir.

## Entegre tarayıcı kontrolü — 1 Kasım 2026

Yerel Chrome, boş tarayıcı bağlamları ve yazılımsal ANGLE/SwiftShader ile masaüstü, iPhone 11 ekran ölçüsü ve veri tasarrufu senaryoları çalıştırıldı. Üçünde de gerçek 3D `ready`, `materialWarm=true`; monogram yüzeyi ve doku istekleri HTTP 200. Veri tasarrufunda düğmeye basılmadan Three.js isteği sayısı sıfır; düğmeyle sahne açıldı. Ekranın sonuna anlık kaydırma sonrası her üç profilde 900 ms boyunca monogramın WebGL çizim çağrısı sayısı sıfırdı. JavaScript çalışma hatası yoktu.

Bu koşullarda ilk içerik boyaması masaüstünde 2.560 ms, mobil ölçüde 1.100 ms, veri tasarrufunda 796 ms gözlendi. 3D hazırlık (ilk boyamadan ayrı) sırasıyla 10.558 / 5.905 / 5.797 ms sürdü. Bunlar yazılımsal GPU kullanan yerel testin tekil ölçümleridir; gerçek iPhone, gerçek ağ veya Lighthouse skoru değildir. Ertelenmiş 3D kaynak aktarımı yaklaşık 4,97 MB masaüstü, 3,97 MB mobil: bu nedenle 3D açılışı ilk içerik boyamasından ayrılır.

Yüzey isteği geciktirilerek yükleme görünümü ayrıca incelendi: poster opaklığı 1; durum metni “Kabartmalı yüzey yükleniyor” görünür; `monogram-light-pass` animasyonu çalışıyor. Tamamlanınca gösterge kapanıyor. Detaylı yerel çıktı `.build/scene-smoke-results.json`; ekran görüntüleri `.build/scene-*.png`. Bu test dosyaları yayın paketine eklenmez.
