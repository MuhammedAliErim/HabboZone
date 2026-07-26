# HABBOZONE - AI / GPT / CODEX MASTER PROJE & GELİŞTİRME REHBERİ

Bu döküman; **HabboZone** projesini inceleyen, geliştiren veya hata ayıklayan **GPT-4o, Codex, Claude, Gemini veya herhangi bir Yapay Zeka Asistanının** projenin mimarisi, tasarım dili, kritik kod kuralları, API anahtarları, veritabanı şeması ve dağıtım süreçleri hakkında %100 tam bağlama sahip olması için hazırlanmıştır.

---

## 1. PROJE KİMLİĞİ VE TEKNOLOJİ YIĞINI (TECH STACK)

- **Proje Adı:** HabboZone (Habbo Türkiye Resmi Fansitesi Adayı)
- **Geliştirici & Kurucu:** Muhammed Ali Erim (@MuhammedAliErim)
- **GitHub Deposu:** [https://github.com/MuhammedAliErim/HabboZone](https://github.com/MuhammedAliErim/HabboZone)
- **Ana Framework:** Next.js 16 (App Router) & React 19
- **Stil & Tasarım:** Tailwind CSS v3/v4 & Vanilla CSS (`src/app/globals.css`), Lucide React ikonları
- **Veritabanı & Kimlik Doğrulama:** Supabase (PostgreSQL 15+, Row Level Security, Supabase Auth & Storage)
- **Yapay Zeka (AI) Entegrasyonu:** NVIDIA NIM API (Akıllı Dergi Mizanpajı & İçerik Üretimi - `src/app/actions/ai.ts`)
- **Canlı Dağıtım (Deploy):** Vercel (GitHub `main` dalına push atıldığında otomatik sıfır yapılandırma deploy tetiklenir)

---

## 2. ÇEVRESEL DEĞİŞKENLER VE API ANAHTARLARI (.env.local)

Projeyi yerel ortamda (`localhost:3000`) veya Vercel üzerinde çalıştırırken aşağıdaki değişkenlerin eksiksiz tanımlanması zorunludur:

```env
# 1. SUPABASE VERİTABANI VE AUTH BAĞLANTISI
NEXT_PUBLIC_SUPABASE_URL="https://[proje-kimligi].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsIn..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsIn..." # Sunucu eylemleri (Server Actions) ve Admin bypass işlemleri için zorunlu

# 2. YAPAY ZEKA (NVIDIA NIM) MOTORU
NVIDIA_NIM_API_KEY="nvapi-..." # Dergi otomatik düzenleme (generateMagazineLayout) ve AI asistanları için

# 3. UYGULAMA METADATA URL'İ
NEXT_PUBLIC_SITE_URL="https://habbozone.com" # Veya Vercel pre-view adresi
```

> [!IMPORTANT]
> İstemci tarafında (`use client`) yalnızca `NEXT_PUBLIC_` ön eki olan değişkenler okunabilir. `SUPABASE_SERVICE_ROLE_KEY` ve `NVIDIA_NIM_API_KEY` kesinlikle tarayıcıya ifşa edilmemeli, yalnızca `src/app/actions/` altında veya sunucu bileşenlerinde kullanılmalıdır.

---

## 3. KRİTİK REACT 19 & NEXT.JS 16 SAFLIK (PURITY) KURALI

React 19 ve Next.js 16 Turbopack derleyicisi **saflık (purity)** kurallarına karşı sıfır toleranslıdır. Bir bileşenin render gövdesinde saf olmayan (impure) işlemler yapılması derleme veya hidrasyon hatası yaratır.

### Yasak Olan İşlemler (Impure During Render):
- `new Date()`, `Date.now()`, `toLocaleDateString()` vb. tarih fonksiyonlarının doğrudan render JSX gövdesinde çağrılması.
- `Math.random()` gibi her render'da farklı değer üreten fonksiyonlar.
- Tarayıcı/Sunucu saat dilimi farkından dolayı hidrasyon uyumsuzluğu yaratacak tarih dönüşümleri.

### Doğru Çözüm Patternleri:
1. **Statik veya Deterministik Dilimleme:** Tarih gösterimleri için veritabanından gelen ISO string veri doğrudan kesilerek gösterilir (`dateStr.split('T')[0]`).
2. **Event Handlers & Hooks:** `new Date()` veya `Math.random()` yalnızca `useEffect`, `useMemo` veya buton tıklama (`onClick`) gibi olay mekanizmalarının içinde tetiklenmelidir.
3. **Sunucu Bileşenlerinde Caching:** Sayfaların başına `export const revalidate = 60;` (veya uygun süre) eklenerek verinin önbelleğe alınması ve sunucuda deterministik hale getirilmesi sağlanır.

---

## 4. TASARIM DİLİ: DARK PREMIUM HABBO-BOX V4.0

HabboZone'un tüm arayüzü sıradan beyaz/basit web sitelerinden ayrışacak şekilde **"Dark Premium"** (Koyu Lüx ve Neon) estetiğine sahiptir. Yeni geliştirilecek veya güncellenecek tüm sayfalarda aşağıdaki kurallara kesinlikle uyulmalıdır:

### 1. Ana Arka Plan & Renk Paleti:
- **Zemin:** Koyu lacivert/siyah tonlar (`bg-[#0a1224]`, `bg-[#050b14]`, `bg-[#060d1a]`).
- **Kenarlıklar:** İnce, şık yarı saydam kenarlıklar (`border border-white/10`, `border-2 border-white/15`).
- **Cam Efekti:** `backdrop-blur-md`, `bg-white/5` kombinasyonları.

### 2. Standart Kart Yapısı (`habbo-box`):
Her içerik bloklama veya kart modülü `habbo-box` sınıfı ve ona özel üst başlık barlarıyla sarmalanmalıdır:

```tsx
<div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden relative">
  {/* Üst Başlık (Header) */}
  <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 text-white font-black text-xs uppercase tracking-wider px-6 py-4 flex items-center justify-between">
    <span className="flex items-center gap-2">
      <Sparkles size={16} className="text-cyan-400" /> KART BAŞLIĞI
    </span>
    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
      ROZET / DURUM
    </span>
  </div>

  {/* İçerik Gövdesi */}
  <div className="p-6 bg-[#050b14] text-white">
    {/* Kart İçeriği */}
  </div>
</div>
```

### 3. Neon Vurgular ve Butonlar:
- **Cyan (Elmas / Dijital):** `text-cyan-400`, `bg-cyan-500/10`, `border-cyan-500/30`, `shadow-[0_0_15px_rgba(34,211,238,0.3)]`
- **Amber / Gold (Kredi / Nadire):** `text-amber-400`, `bg-amber-500/10`, `border-amber-500/30`
- **Emerald (Başarı / Aktif):** `text-emerald-400`, `bg-emerald-500/10`, `border-emerald-500/30`
- **Purple (VIP / Özel):** `text-purple-400`, `bg-purple-500/10`, `border-purple-500/30`

---

## 5. VERİTABANI ŞEMASI VE MODÜLLER (SUPABASE POSTGRESQL)

Projenin kalbi olan Supabase veritabanındaki anahtar tablolar ve ilişkiler aşağıdadır:

1. **`profiles` (Kullanıcı Profilleri):**
   - `id` (UUID, Auth ile eşleşir), `username`, `habbo_username` (Habbo TR karakter adı), `motto`, `avatar_url`, `role` (`user`, `moderator`, `admin`), `is_vip`, `is_staff`, `credits`, `diamonds`, `created_at`.
2. **`news` & `news_categories` (Haber ve Blog Mimarisi):**
   - `title`, `slug`, `summary`, `content`, `image_url`, `author_id`, `category_id`, `is_published`, `views`.
3. **`habbo_items` & `habbo_item_categories` & `habbo_item_values` (Nadire Mağazası & Piyasa Endeksi):**
   - Habbo içindeki nadire, LTD ve özel eşyaların güncel kredi/elmas değerleri, stok adedi (`ltd_count`), fiyat değişim geçmişi ve grafik verileri.
4. **`badges` & `user_badges` (Rozet & Başarı Sistemi):**
   - Kullanıcıların site içi etkinlik, haber okuma veya yarışmalardan kazandığı Habbo rozetlerinin tanımları ve profilde sergilenme durumu (`is_equipped`).
5. **`events` & `event_participants` (Canlı Etkinlik Takvimi):**
   - Yaklaşan oyunların, radyo yayınlarının ve çekilişlerin başlangıç tarihleri, ödülleri ve katılımcı listeleri.
6. **`gallery_submissions` (Topluluk Ekran Görüntüsü Galerisi):**
   - Oyuncuların odalarını veya kombinlerini paylaştığı, yöneticiler tarafından onaylanan beğeni (`likes`) mekanizmalı galeri.
7. **`magazines` (AI Destekli Aylık Dergiler):**
   - Habbo topluluğu için hazırlanan sayfa sayfa dijital dergilerin içerik ve kapak depolaması.
8. **`topics` & `replies` & `categories` (Topluluk Forumu):**
   - Oyuncuların kategori bazlı başlık açabildiği, sabitlenebilen (`is_pinned`) ve yorumlanabilen forum altyapısı.

---

## 6. PROJE KLASÖR YAPISI VE ÖNEMLİ DOSYALAR

```
HabboZone/
├── src/
│   ├── app/
│   │   ├── (main)/              # Kullanıcı arayüzü ana sayfaları (Header & Footer dahil)
│   │   │   ├── values/          # Nadire Değerleri Mağazası ve Fiyat Grafiği (/values)
│   │   │   ├── tools/           # Topluluk Araçları (Avatar, Font, Takas, Çark) (/tools)
│   │   │   ├── forum/           # Topluluk Forumu (/forum)
│   │   │   ├── badges/          # Rozet Vitrini (/badges)
│   │   │   ├── leaderboard/     # Liderlik Tablosu (/leaderboard)
│   │   │   ├── vip/             # VIP Ayrıcalıkları Kulübü (/vip)
│   │   │   ├── staff/           # Ekip ve Yönetim Kadrosu (/staff)
│   │   │   ├── gallery/         # Topluluk Ekran Görüntüsü Galerisi (/gallery)
│   │   │   └── events/          # Etkinlik ve Turnuva Takvimi (/events)
│   │   ├── admin/               # Yetkili/Yönetici Kontrol Paneli (/admin)
│   │   ├── actions/             # Server Actions (Yapay zeka ai.ts, auth vb.)
│   │   ├── api/                 # Next.js API endpointleri (/api/news vb.)
│   │   ├── globals.css          # Dark Premium ana stil tanımları, habbo-box sınıfları
│   │   └── layout.tsx           # Kök Düzen ve Müzik Çalar/Radyo Entegrasyonu
│   ├── components/              # Yeniden kullanılabilir React bileşenleri
│   │   ├── values/              # ItemPriceChart.tsx (Recharts fiyat grafiği)
│   │   ├── tools/               # AvatarTool, FontGeneratorTool, TradeCalculator, WheelOfFortune
│   │   ├── layout/              # Header.tsx, Footer.tsx, RadioPlayer.tsx
│   │   └── ui/                  # Butonlar, modallar ve genel form elemanları
│   └── utils/                   # Supabase istemci (client) ve sunucu (server) yardımcıları
├── public/                      # Statik resimler ve logolar
├── task.md                      # Geliştirme Fazları ve İlerleme Takip Şeması
└── AI_CODEX_DOCUMENTATION.md    # [BU DÖKÜMAN] Master AI Rehberi
```

---

## 7. OTOMATİK DERLEME VE DAĞITIM (CI/CD - VERCEL)

- Proje üzerinde herhangi bir geliştirme yapıldığında **mutlaka** yerel terminalde aşağıdaki komut çalıştırılarak derleme testi yapılmalıdır:
  ```bash
  npm run build
  ```
- Eğer `npm run build` sıfır hata ile tamamlanıyorsa (`✓ Compiled successfully`), değişiklikler Git aracılığıyla uzak sunucuya gönderilir:
  ```bash
  git add .
  git commit -m "feat: [yapilan-degisiklik-aciklamasi]"
  git push origin main
  ```
- **Önemli Kural:** Kurucu (Kullanıcı), yapay zekaya "sen deploy et ve bana bidaha deploy et deme" kuralını tanımlamıştır. Bu sebeple geliştirme tamamlandığında onay istemeden doğrudan `npm run build` denetlenmeli ve akabinde `git push origin main` komutu icra edilerek Vercel yayını tetiklenmelidir.

---

## 8. AI ASİSTANLARI İÇİN İPUÇLARI VE ÇALIŞMA PROTOKOLÜ

1. **Hiçbir Zaman Basit / MVP Tasarım Yapmayın:** HabboZone sıradan bir web sitesi değildir. Bir sayfa tasarlarken veya düzeltirken **göz alıcı, modern, neon ışıklı, oyun atmosferini hissettiren** Dark Premium habbo-box v4.0 öğelerini kullanın.
2. **Boş Veritabanına Karşı Korumalı Olun (Fallback Mocking):** Supabase tablosu boş olsa bile sayfanın şık görünmesi ve hata vermemesi için akıllı yedek veriler (fallback mock catalogs) entegre edin.
3. **React 19 Uyumluluğundan Ödün Vermeyin:** Render döngüsünde saf olmayan tarih/saat işlemleri yapmaktan kaçının.
4. **Mevcut Kodu Bozmadan Geliştirin:** Bir dosyayı düzenlerken var olan özellikleri, ikonları ve Supabase bağlantılarını koruyarak iyileştirme yapın.
