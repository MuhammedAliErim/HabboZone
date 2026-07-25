# 🚀 HABBOZONE - KAPSAMLI PROJE, MİMARİ VE YAPAY ZEKA GEREKSİNİMLERİ BELGESİ
*(Bu belge, projeyi devralacak veya üzerinde çalışacak olan AI Asistanları (ChatGPT, OpenAI Codex, Claude, Gemini vb.) ile insan geliştiriciler için tam kapsamlı bir başvuru kılavuzudur.)*

---

## 📌 1. PROJE VİZYONU & GENEL BAKIŞ
**HabboZone**, Habbo Türkiye topluluğu (Habbo.com.tr) için yeni nesil teknolojilerle sıfırdan geliştirilmiş, ultra-lüks "**Dark Premium**" tasarım diline sahip, yapay zeka (NVIDIA NIM) entegrasyonlu ve Canva benzeri interaktif tasarım stüdyolarıyla donatılmış bir fansite, haber, dergi ve topluluk platformudur.

* **Ana Hedef:** Habbo oyuncularına sıradan bir haber sitesi sunmak yerine; kendi avatarlarını, imza barlarını, oda çözüm haritalarını, kıyafet kombinlerini ve dergilerini tasarlayabilecekleri tam donanımlı bir dijital ekosistem vermektir.
* **Tasarım Felsefesi:** "Dark Premium Habbo-Box" estetiği (`bg-[#0a1224]`, `border-2 border-white/10`, neon parlama efektleri, akıcı CSS/Framer animasyonları ve responsive mobil uyumluluk).

---

## 🛠️ 2. TEKNOLOJİ YIĞINI (TECH STACK)
* **Core Framework:** **Next.js 16.2.10** (App Router, Server Components, Server Actions, Client Components, Turbopack).
* **Dil & Linter:** **TypeScript** (Strict mode) & **ESLint** (React 19 / Next.js 16 katı kuralları aktiftir).
* **Styling (CSS):** **Tailwind CSS v4** & **Vanilla CSS** (`src/app/globals.css`).
* **İkon Kütüphanesi:** **Lucide React** (`lucide-react`).
* **Veritabanı & Auth:** **Supabase** (PostgreSQL, Realtime WebSockets, Row Level Security - RLS, Supabase Authentication).
* **Yapay Zeka (AI Engine):** **NVIDIA NIM API** (Metin üretimi için *Meta Llama 3 70B Instruct / Mistral 7B*; Görsel üretimi için *Flux.1 / SDXL*).
* **Yayınlama & CI/CD:** **Vercel** (GitHub depomuz ile tam entegre; `main` dalına push atıldığında otomatik build & production deploy gerçekleşir).

---

## 🔑 3. API ANAHTARLARI & ÇEVRE DEĞİŞKENLERİ (`.env.local`)
Projenin root dizinindeki `.env.local` (ve Vercel environment) dosyasında yer alan canlı bağlantı anahtarları aşağıdaki gibidir. *(Yeni geliştiriciler veya AI asistanları veritabanı veya AI motoru entegrasyonlarında bu değişkenleri referans almalıdır):*

```env
# Supabase Bağlantıları
NEXT_PUBLIC_SUPABASE_URL=https://aippyksvzfilfrwscqon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcHB5a3N2emZpbGZyd3NjcW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NDgxOTAsImV4cCI6MjEwMDIyNDE5MH0.FVj6XZL2hTddskfVaZ7rytPtriNWOGo-7cDNbYjWyus
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDY0ODE5MCwiZXhwIjoyMTAwMjI0MTkwfQ.YnkFMY6mZDOoM8iVuRElRMFpyOX6bH8CTsabw-xHicI

# NVIDIA NIM AI Motoru Anahtarları
NVIDIA_TEXT_API_KEY=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
NVIDIA_IMAGE_API_KEY=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
```

---

## 🔗 4. GITHUB & VERCEL DAĞITIM (DEPLOY) BAĞLANTILARI
* **GitHub Repository URL:** `https://github.com/MuhammedAliErim/HabboZone.git`
* **Otomatik Dağıtım Kuralı:** Proje sahibi Muhammed Ali Erim'in kesin direktifi şudur:
  > **"Sen deploy et ve bana bir daha deploy et deme, ne yaparsan yap en son deploy et."**
  Bu kurala göre yapılan her kod geliştirme, hata düzeltmesi veya yeni faz entegrasyonunun sonunda mutlaka git üzerinden staging edilmeli, commitlenmeli ve `main` branch'ine push atılmalıdır (`git add . && git commit -m "..." && git push origin main`). Vercel anında tetiklenir.

---

## 📂 5. PROJE MİMARİSİ VE KLASÖR YAPISI
Proje modern Next.js 16 App Router mimarisine göre yapılandırılmıştır:

```text
HabboZone/
├── public/                 # Statik ikonlar, görseller ve logolar
├── src/
│   ├── app/
│   │   ├── (auth)/         # Giriş (login), Kayıt (register), Şifremi unuttum sayfaları
│   │   ├── (main)/         # Ana uygulama layout'u ve tüm topluluk modülleri
│   │   │   ├── admin/      # YÖNETİM KOMUTA MERKEZİ v4.0 (Tüm admin araçları)
│   │   │   ├── forum/      # Forum kategorileri, tartışmalar ve konu detayları
│   │   │   ├── news/       # Haber akışı ve makale okuma sayfaları
│   │   │   ├── magazines/  # AI destekli gazete ve dergi arşivi
│   │   │   ├── values/     # Habbo nadire değerleri, piyasa analizi ve fiyat kataloğu
│   │   │   ├── wiki/       # Habbo oyun rehberi ve bilgi bankası
│   │   │   ├── badges/     # Rozetler ve ödüller rehberi
│   │   │   ├── events/     # Etkinlik ve turnuva takvimi
│   │   │   ├── rooms/      # Öne çıkan popüler odalar ve labirentler
│   │   │   ├── guides/     # Oyun rehberleri ve adım adım çözüm talimatları
│   │   │   ├── groups/     # Topluluk grupları ve fan kulüpleri
│   │   │   ├── profile/    # Oyuncu profilleri, rozetleri, arkadaşları ve VIP statüleri
│   │   │   └── tools/      # Kullanıcı araçları (Avatar üretici, rozet arayıcı vb.)
│   │   ├── api/            # API Route'ları (NVIDIA AI entegrasyonları, Habbo API proxy vb.)
│   │   └── layout.tsx      # Root Layout ve genel tema kapsayıcısı
│   ├── components/
│   │   ├── tools/          # AvatarTool, BadgeTool vb. interaktif araçlar
│   │   └── ui/             # Yeniden kullanılabilir butonlar, kartlar, haber ve dergi okuyucular
│   └── utils/
│       └── supabase/       # Supabase client, server, admin ve middleware yardımcıları
├── database_setup.sql      # Ana veritabanı şeması ve tablolar
├── tailwind.config.ts      # Tailwind yapılandırması
└── tsconfig.json           # TypeScript derleyici yapılandırması
```

---

## 🎨 6. CANVA BENZERİ ÖZEL TASARIM STÜDYOLARI (YÖNETİM PANELSİ)
HabboZone'un en büyük farkı, admin panelinde (`/admin`) yer alan 5 büyük **Canva Benzeri Tasarım Stüdyosu**dur. Bu stüdyolar, içerik üreticilerinin dışarıdan (Photoshop vb.) grafik tasarımı yapmadan saniyeler içinde şık görseller ve HTML gömme (embed) kodları üretmesini sağlar:

1. **🎨 Canva Görsel Stüdyosu v4.0 (`/admin/studio`):**
   - Haber kapakları, rehber bannerları, sosyal medya görselleri ve duyuru kartları tasarlama motoru. Sürükle-bırak ikonlar, renk paletleri ve yazı tipleri içerir.
2. **👔 Kart & İmza Stüdyosu v2.0 (`/admin/id-studio`):**
   - Resmi fansite yetkili yaka kartları, forum imza barları, VIP biletleri ve başarı sertifikaları üreten stüdyo. Canlı Habbo avatarı çeker ve Habbo-box embed kodu export eder.
3. **🗺️ Oda & Harita Çözüm Stüdyosu v3.0 (`/admin/room-studio`):**
   - Wired labirentleri, oda turnuvaları ve rozet görevleri için harita üzerine adım adım oklar, numaralar, ışınlayıcı noktaları ve uyarı rozetleri ekleme araçları.
4. **👗 Kombin & Lookbook Moda Stüdyosu v2.0 (`/admin/outfit-studio`):**
   - 5 farklı podyum teması (Altın VIP, Sakura Pembe, Siber Neon, Kış Masalı, Gotik Gece) üzerinde canlı avatar yön/eylem kontrolleri. Kombinde giyilen eşyaları (Taç, Kazak, Gözlük vb.) fiyatlarıyla etiketleyip tek tıkla haber veya dergilere gömmek için HTML kodu export eder.
5. **📰 Canva Dergi Stüdyosu (`/admin/magazines`):**
   - AI destekli dergi ve gazete oluşturucu. Metin, görsel, yapay zeka resim kutularını sürükle-bırak ile sayfalara yerleştirme, katman hiyerarşisi yönetme ve gerçek zamanlı önizleme imkanı sunar.

---

## 🗄️ 7. VERİTABANI ŞEMASI & TABLOLAR (SUPABASE SQL)
Projede Supabase PostgreSQL kullanılmaktadır. Temel tablolar ve işlevleri:
* `profiles`: Kullanıcı hesapları (`id`, `username`, `habbo_name`, `role` [Owner, Administrator, Moderator, Editor, Yazar, User vb.], `credits`, `vip_status`, `avatar_url`, `bio`).
* `news`: Yayınlanan veya taslak haberler (`id`, `title`, `slug`, `content`, `summary`, `cover_image`, `author_id`, `category`, `likes_count`, `views_count`).
* `magazines` & `magazine_issues`: Dergiler ve dergi sayıları (JSONB formatında sayfalar, katmanlar ve tasarım nesneleri tutulur).
* `topics` & `posts`: Forum tartışma başlıkları ve alt yorumları.
* `habbo_items`: Nadire katalog veritabanı (`name`, `category`, `credit_value`, `diamond_value`, `trend` [up, down, stable], `image_url`).
* `guides`: Oyun içinden rozet alma ve labirent geçme rehberleri.
* `rooms`: Öne çıkan Habbo odaları, oda bağlantıları ve sahipleri.
* `events`: Etkinlik ve turnuva takvimi verileri.
* `badges`: Kullanıcıların kazandığı veya katalogdaki Habbo rozetleri (`code`, `name`, `desc`, `image`).

---

## ⚠️ 8. KRİTİK GELİŞTİRME & YAPAY ZEKA (CODEX/AI) KURALLARI
Bu projede kod yazacak olan herhangi bir AI (ChatGPT, OpenAI Codex, Claude) veya insan yazılım mühendisi aşağıdaki **tavizsiz kurallara** uymak zorundadır:

### 1. React 19 & Next.js 16 "Pure Render" (Saflık) Kuralı
* React 19 derleyicisi (React Compiler), bir bileşenin gövdesinde (rendering aşamasında) saf olmayan (impure) fonksiyonların çağrılmasını **kesinlikle yasaklar** ve derleme hatası verir (`Error: Math.random() is an impure function...`).
* **YASAK:** Bileşen gövdesinde doğrudan `Math.random()`, `Date.now()`, `new Date()`, veya yan etki (side-effect) yaratan mutasyonlar kullanılamaz!
* **DOĞRU YÖNTEM:** Rastgelelik, animasyon gecikmesi veya benzersiz ID gerekiyorsa:
  - Ya deterministik bir hesaplama (Örn: string uzunluğuna bağlı index hesabı) kullanın.
  - Ya da bu işlemi `useEffect`, event handler (button click) veya `useState(0)` içinde gerçekleştirin.

### 2. Strict Linter & Sıfır Hata Toleransı
* Kullanılmayan değişkenler (unused variables), kullanılmayan importlar veya eksik tip tanımlamaları (`any`) derleme sırasında patlamalara yol açar.
* Yazılan her yeni koddan sonra mutlaka terminalde `npm run build` komutu çalıştırılmalı, build işleminin %100 başarıyla (`✓ Compiled successfully`, `0 errors`) tamamlandığı teyit edilmelidir.

### 3. Kullanıcı Direktifi: "En Son Deploy Et"
* Kullanıcının en önemli kuralı: *"Sen deploy et ve bana bir daha deploy et deme ne yaparsan yap en son deploy et."*
* Bir geliştirme veya hata düzeltmesi tamamlandığında asla kullanıcıdan izin istemekle vakit kaybedilmemeli; doğrudan git komutlarıyla değişiklikler commitleyip Vercel canlı sunucusuna gönderilmelidir:
  ```bash
  git add .
  git commit -m "feat: [yapılan işin net açıklaması]"
  git push origin main
  ```

### 4. Habbo İkonları & Avatar Entegrasyonu
* Karakter avatarları her zaman Habbo'nun resmi imaging API'si ile çekilmelidir:
  `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=[KULLANICI_ADI]&action=std&direction=2&head_direction=2&gesture=sml&size=l`
* Bileşenlerde görsel yüklerken LCP optimizasyonu için Next.js `<Image />` bileşeni tercih edilmeli, harici URL'ler için fallback yapıları eklenmelidir.

---
*Bu dokuman HabboZone AI ve Geliştirme Ekibi tarafından oluşturulmuştur. ChatGPT Codex ve diğer AI motorlarına tam bağlam (context) sağlamak için optimize edilmiştir.*
