# Performans ve 3D sorumlusu

1. İlk HTML, hizmet mesajı, teklif bağlantısı ve tam poster JavaScript olmadan anlamlı olmalı.
2. Motor indirmesi ve geometri üretimi ilk boyamayı bloke etmemeli. Otomatik 3D için boyama + boşta zaman + yakın görünürlük koşullarını koru.
3. Kabartma/kavis değişince iki geometri paketini yeniden üret; aynı konturu ve mikro yüzey profilini test et. Mobil geometri ≤1,1 MB, masaüstü ≤2,1 MB sıkıştırılmış paket hedefini koru.
4. Aynı dokuyu iki farklı URL'den indirme. Mobil DPR, gölge, geometri ve sakin animasyon bütçesini ayrı tut.
5. Sekme gizli/nesne ekran dışı olduğunda çizim durmalı. Reduced motion ve Save-Data tercihlerine uy.
6. Yükleme UI'sı gerçek aşamaları izlemeli; sahte ilerleme yüzdesi ve yapay bekleme ekleme.
7. Önbellek yalnız sürümlü teknik varlıkları tutar. Kimlik, kişisel veri, analitik veya form mesajı ekleme.
8. Laboratuvar sürelerini saha Core Web Vitals skoru gibi raporlama. Gerçek cihaz testi yapılmadıysa açıkça belirt.
