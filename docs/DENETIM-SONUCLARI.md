# Teslim denetimi — 1 Kasım 2026

Site yayına alınmadı. Kontroller yerel kaynak ve üretilmiş statik dosyalarda yapıldı; dış sistemlere saldırı veya yük testi uygulanmadı.

## Doğrulananlar

- 24 otomatik test geçti: makale üretimi, güvenli URL/HTML işleme, tek merkezden bilgi güncelleme, alt dizin yayın yolları, onay bileşeni, CSP ve hassas dosya engeli.
- 47 HTML sayfası, 36 sitemap URL’si, 11 noindex sayfa ve 2.080 yerel dosya/bağlantı hedefi: hata bulunmadı. Noindex sayfalar 9 örnek tasarım, KVKK taslağı ve 404’tür.
- Her sayfada tek H1; başlık sırası, açıklama, canonical, JSON-LD ve görsel alt metinleri denetlendi.
- Kaynak desen taramasında 117 metin dosyasında tanımlanan yüksek güvenli gizli anahtar desenlerine rastlanmadı. Bu kapsamlı sır veya CVE taraması değildir.
- Gerçek tarayıcıda 3D model ve son materyaller CSP altında yüklendi. Form metni HTML olarak çalıştırılmadı; honeypot ve tekrar gönderim freni denendi. Test WhatsApp açılışlarını taklit etti; gerçek mesaj gönderilmedi.
- 390, 768 ve 1242 piksel genişliklerinde yatay taşma kontrol edildi. Kategori filtresi, özel 404, POST 405 ve üst dizin kaçışı 403 doğrulandı.
- GitHub Actions yalnız elle çalışır; beş Action commit SHA’sına sabitlenmiştir. Hesap ve depo ayarları incelenmedi.

## Yayından önce gerekenler

1. Dış referansları doğrulayın: Sonar Teknoloji ve bvtopcleaning.be kontrol anında HTTP 200 verdi. ertoruninsaat.com.tr bu ortamda ENOTFOUND verdi. durukaninsaat.com.tr ve durukanemlak.com için HTTPS bağlantısı 31.186.11.254:443 üzerinde reddedildi. Bu sonuç kalıcı veya her ağda erişilemez olduklarını kanıtlamaz. Bağlantılar değiştirilmedi.
2. KVKK sayfası taslaktır. Gerçek veri sorumlusu kimliği, başvuru yöntemi, işleme gerekçeleri ve WhatsApp/yurt dışı veri akışı gerçek işleyişe göre tamamlanmalıdır. Sahte işletme/sicil numarası eklenmedi. Zorunlu okudum kutusu tek başına hukuki uygunluk veya pazarlama izni sağlamaz.
3. GitHub Pages/DNS/HTTPS, gerçek yanıt başlıkları, hesap izinleri ve Search Console yayın sonrası doğrulanmalıdır. Meta CSP sunucu başlıklarının tüm işlevlerini yerine getirmez; framing koruması/HSTS doğrulandı denemez.
4. Three.js r161 yereldir ve lisansı vardır; kapsamlı bağımlılık CVE/provenans denetimi yapılmadı. Sürüm güncellemesi görsel regresyon testi gerektirir. Google Fonts dış ağ bağımlılığıdır.
5. Beş uzun makale title alanı arama sonuçlarında kısaltılabilir. Bu teknik engel değildir. Sıralama, AI önerisi ve gerçek kullanıcı Core Web Vitals sonucu garanti edilmez.

## Formlar ve botlar

Backend, mesaj API’si veya gizli API anahtarı yoktur. Form yalnız kodlanmış WhatsApp mesaj taslağı açar. Honeypot, alan doğrulama ve 30 saniyelik istemci freni basit tekrarları azaltır; doğrudan telefon/WhatsApp spamini veya JavaScript’i atlayan botları engellemez. Gerçek sunucu formu eklenirse sunucu tarafında doğrulama, hız sınırı ve kötüye kullanım kontrolü kurulmalıdır. Hassas veri istemeyin.

## Tasarım ve kullanım

Şirket bilgileri kurumsal bir dizin halinde kimlik, iletişim ve iki adres olarak düzenlendi; ana sayfa footer’ı aynı marka diliyle yenilendi. Makale yayınlama, kapak kuralları, fiyatlar ve sistem mimarisi için kök README.md dosyasını okuyun.
