export const MOCK_NEWS = [
  {
    id: '1',
    title: 'Yeni Habbo Müşteri Hizmetleri Portalı Açıldı!',
    slug: 'yeni-musteri-hizmetleri',
    summary: 'Uzun süredir beklenen Habbo destek ekibi yenilendi ve portal daha kullanıcı dostu bir hale getirildi.',
    thumbnail_url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_hc2020.png',
    author: { name: 'Odokh', habbo_username: 'Odokh' },
    published_at: new Date(Date.now() - 10000000).toISOString(),
    is_featured: true,
    content: '## Yeni Sistem Nasıl İşliyor?\nArtık bilet göndermek çok daha kolay. Sadece birkaç tık ile sorununuzu kategorize edebiliyor ve anında yanıt alabiliyorsunuz. Ayrıca canlı destek seçeneği de bazı ülkelerde teste açıldı.\n\n### HabboZone Yorumu\nBu güncelleme yıllardır beklenen bir gelişmeydi. Umarım ban itiraz süreçleri de aynı hızla çözülür.'
  },
  {
    id: '2',
    title: 'Nadir Eşya Fiyatları Çakıldı mı?',
    slug: 'nadir-esya-fiyatlari',
    summary: 'Geçtiğimiz hafta Pazar Yeri güncellemeleri sonrası nadir eşyaların fiyatlarında dev dalgalanmalar yaşandı.',
    thumbnail_url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_easter20_gen.png',
    author: { name: 'Efe', habbo_username: 'Efe' },
    published_at: new Date(Date.now() - 20000000).toISOString(),
    is_featured: true,
    content: 'Görünüşe göre piyasada büyük bir panik satışı var...'
  },
  {
    id: '3',
    title: 'Gelecek Ayın Oda Paketi Sızdırıldı',
    slug: 'gelecek-ay-oda-paketi',
    summary: 'Otel kodlarında bulunan yeni rozetler, önümüzdeki ayın paketini işaret ediyor.',
    thumbnail_url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_jp19_bundle4.png',
    author: { name: 'HabboZone Admin', habbo_username: 'official_admin' },
    published_at: new Date(Date.now() - 50000000).toISOString(),
    is_featured: false,
    content: 'Japonya temalı bu devasa oda paketi oldukça dikkat çekici...'
  },
  {
    id: '4',
    title: 'Classic Habbo Geri mi Dönüyor?',
    slug: 'classic-habbo-geri-donusu',
    summary: 'Geliştiricilerden eski sürüm SnowStorm ve BattleBall minioyunları için müjdeli haber geldi.',
    thumbnail_url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_classic.png',
    author: { name: 'Odokh', habbo_username: 'Odokh' },
    published_at: new Date(Date.now() - 80000000).toISOString(),
    is_featured: false,
    content: 'Yıllardır hasretle beklenen mini oyunlar...'
  }
];

export const MOCK_MAGAZINES = [
  {
    id: '1',
    title: 'HabboZone Dergisi - Yaz Özel Sayısı',
    issue_number: 14,
    cover_image_url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_summer20_gen.png',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: [
      'https://images.habbo.com/web_images/habbo-web-articles/lpromo_summer20_gen.png',
      '/images/assets/Gemini_Generated_Image_2zj0l42zj0l42zj0.png',
      '/images/assets/Gemini_Generated_Image_5r1j4p5r1j4p5r1j.png',
      '/images/assets/Gemini_Generated_Image_3108c93108c93108.png',
      '/images/assets/Gemini_Generated_Image_a231qxa231qxa231.png'
    ],
    published_at: new Date(Date.now() - 100000).toISOString(),
  },
  {
    id: '2',
    title: 'HabboZone Dergisi - Bahar Sayısı',
    issue_number: 13,
    cover_image_url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_easter20_gen.png',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: [
      'https://images.habbo.com/web_images/habbo-web-articles/lpromo_easter20_gen.png',
      '/images/assets/Gemini_Generated_Image_5r1j4p5r1j4p5r1j.png',
      '/images/assets/Gemini_Generated_Image_3108c93108c93108.png'
    ],
    published_at: new Date(Date.now() - 50000000).toISOString(),
  },
  {
    id: '3',
    title: 'HabboZone Dergisi - Kış Sayısı',
    issue_number: 12,
    cover_image_url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_hc2020.png',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: [
      'https://images.habbo.com/web_images/habbo-web-articles/lpromo_hc2020.png',
      '/images/assets/Gemini_Generated_Image_a231qxa231qxa231.png',
      '/images/assets/Gemini_Generated_Image_2zj0l42zj0l42zj0.png'
    ],
    published_at: new Date(Date.now() - 100000000).toISOString(),
  }
];

