import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { 
  Users, Newspaper, Gem, MessageSquare, BookOpen, Shield, Calendar, 
  Award, Megaphone, Home, Book, Image as ImageIcon, Wand2, Package, 
  Sparkles, Activity, ShieldCheck, Cpu, ArrowRight, Zap, CheckCircle2, 
  LayoutDashboard, Wrench, Layers, CreditCard, Compass, Shirt
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Tüm tablolardan sayaç verilerini çekelim (Hata durumunda fallback yapacak şekilde)
  const [
    usersRes, newsRes, itemsRes, topicsRes, 
    magazinesRes, groupsRes, guidesRes, eventsRes
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('habbo_items').select('*', { count: 'exact', head: true }),
    supabase.from('topics').select('*', { count: 'exact', head: true }),
    supabase.from('magazines').select('*', { count: 'exact', head: true }),
    supabase.from('groups').select('*', { count: 'exact', head: true }),
    supabase.from('guides').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    {
      label: 'Toplam Kullanıcı',
      value: usersRes.count || 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      gradient: 'from-blue-600/20 to-transparent'
    },
    {
      label: 'Yayındaki Haber',
      value: newsRes.count || 0,
      icon: Newspaper,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
      gradient: 'from-green-600/20 to-transparent'
    },
    {
      label: 'Nadire Değerleri',
      value: itemsRes.count || 0,
      icon: Gem,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      gradient: 'from-yellow-600/20 to-transparent'
    },
    {
      label: 'Forum Konuları',
      value: topicsRes.count || 0,
      icon: MessageSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      gradient: 'from-purple-600/20 to-transparent'
    },
    {
      label: 'Dergi & Gazeteler',
      value: magazinesRes.count || 0,
      icon: BookOpen,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20',
      gradient: 'from-pink-600/20 to-transparent'
    },
    {
      label: 'Aktif Gruplar',
      value: groupsRes.count || 0,
      icon: Shield,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      gradient: 'from-cyan-600/20 to-transparent'
    },
    {
      label: 'Oyun Rehberleri',
      value: guidesRes.count || 0,
      icon: Book,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      gradient: 'from-orange-600/20 to-transparent'
    },
    {
      label: 'Etkinlik Takvimi',
      value: eventsRes.count || 0,
      icon: Calendar,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-600/20 to-transparent'
    }
  ]

  const adminModules = [
    { title: 'Canva Görsel Stüdyosu', desc: 'Haber kapakları, rehber bannerları ve rozet grafikleri tasarlayın.', href: '/admin/studio', icon: Wand2, color: 'border-pink-500/50 hover:border-pink-500 bg-pink-500/10 hover:bg-pink-500/20', badge: 'YENİ CANVA v4' },
    { title: 'Kart & İmza Stüdyosu', desc: 'Resmi yetkili yaka kartları, forum imza barları ve VIP biletleri tasarlayın.', href: '/admin/id-studio', icon: CreditCard, color: 'border-purple-500/50 hover:border-purple-500 bg-purple-500/10 hover:bg-purple-500/20', badge: 'NEW PRO v2' },
    { title: 'Oda & Harita Çözüm Stüdyosu', desc: 'Wired labirentleri ve rozet görevleri için interaktif ok ve adım işaretli haritalar tasarlayın.', href: '/admin/room-studio', icon: Compass, color: 'border-emerald-500/50 hover:border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20', badge: 'CANVA MAP v3' },
    { title: 'Kombin & Lookbook Stüdyosu', desc: 'Habbo avatarları, kıyafet kombinleri ve şık moda kartları tasarlayın.', href: '/admin/outfit-studio', icon: Shirt, color: 'border-rose-500/50 hover:border-rose-500 bg-rose-500/10 hover:bg-rose-500/20', badge: 'CANVA MODA v2' },
    { title: 'Haberler & Yazılar', desc: 'Haber yayınlayın, içerikleri ve manşetleri düzenleyin.', href: '/admin/news', icon: Newspaper, color: 'border-green-500/30 hover:border-green-500 bg-green-500/5 hover:bg-green-500/10' },
    { title: 'Canva Dergi Stüdyosu', desc: 'AI destekli dergi ve gazete tasarlayıcısı, katman editörü.', href: '/admin/magazines', icon: Layers, color: 'border-pink-500/30 hover:border-pink-500 bg-pink-500/5 hover:bg-pink-500/10', badge: 'CANVA PRO' },
    { title: 'Nadire Değerleri', desc: 'Habbo nadire katalog değerlerini, grafikleri ve fiyatları yönetin.', href: '/admin/values', icon: Gem, color: 'border-yellow-500/30 hover:border-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10' },
    { title: 'Wiki Kütüphanesi', desc: 'Habbo oyun tarihi, karakterler ve bilgi bankasını güncelleyin.', href: '/admin/wiki', icon: Package, color: 'border-purple-500/30 hover:border-purple-500 bg-purple-500/5 hover:bg-purple-500/10' },
    { title: 'Rozetler & Ödüller', desc: 'Kullanıcılara verilecek rozetleri, kodları ve açıklamaları yönetin.', href: '/admin/badges', icon: Award, color: 'border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10' },
    { title: 'Etkinlik Takvimi', desc: 'Yaklaşan oda turnuvalarını, partileri ve ödüllü oyunları planlayın.', href: '/admin/events', icon: Calendar, color: 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10' },
    { title: 'Son Dakika Bantı', desc: 'Ana sayfada üstte kayan acil durum ve duyuru bantlarını yönetin.', href: '/admin/announcements', icon: Megaphone, color: 'border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10' },
    { title: 'Odalar & Mekanlar', desc: 'Öne çıkan popüler odaları, labirentleri ve oyun alanlarını ekleyin.', href: '/admin/rooms', icon: Home, color: 'border-cyan-500/30 hover:border-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10' },
    { title: 'Rehberler & İpuçları', desc: 'Yeni başlayanlar için rehberler ve rozet alım talimatları oluşturun.', href: '/admin/guides', icon: Book, color: 'border-orange-500/30 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10' },
    { title: 'Kullanıcı Yönetimi', desc: 'Kayıtlı üyeleri inceleyin, rolleri atayın veya hesapları denetleyin.', href: '/admin/users', icon: Users, color: 'border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10' },
    { title: 'Yetkili & Ekip Kadrosu', desc: 'Admin, moderatör, yazar ve muhabirlerin görev dağılımlarını düzenleyin.', href: '/admin/staff', icon: ShieldCheck, color: 'border-yellow-400/30 hover:border-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10' },
    { title: 'Galeri & Görsel Arşivi', desc: 'Topluluktan gelen görselleri denetleyin veya resmi medyaları yükleyin.', href: '/admin/gallery', icon: ImageIcon, color: 'border-teal-500/30 hover:border-teal-500 bg-teal-500/5 hover:bg-teal-500/10' },
    { title: 'Forum & Topluluk', desc: 'Forum kategorilerini, açılan başlıkları ve moderasyon süreçlerini yönetin.', href: '/admin/forum', icon: MessageSquare, color: 'border-violet-500/30 hover:border-violet-500 bg-violet-500/5 hover:bg-violet-500/10' }
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* ÜST KARŞILAMA VE ÖZET BANNERI (Habbo-box Lüks Tasarım) */}
      <div className="habbo-box bg-gradient-to-r from-[#070c18] via-[#0a1224] to-[#0f172a] border-2 border-white/10 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> YÖNETİM KOMUTA MERKEZİ v4.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> CANVA PRO SİSTEMİ AKTİF
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Habbo<span className="text-yellow-400">Zone</span> Yönetim Paneli
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              Sistem durumunu denetleyin, Canva tarzı gelişmiş tasarım stüdyolarıyla banner, harita ve dergiler oluşturun, nadire değerlerini ve tüm topluluk modüllerini profesyonelce yönetin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link 
              href="/admin/studio" 
              className="bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Wand2 className="w-5 h-5 animate-pulse" /> Canva Görsel
            </Link>
            <Link 
              href="/admin/id-studio" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <CreditCard className="w-5 h-5 animate-bounce" /> Kart & İmza
            </Link>
            <Link 
              href="/admin/room-studio" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Compass className="w-5 h-5 animate-spin-slow" /> Harita Stüdyosu
            </Link>
            <Link 
              href="/admin/outfit-studio" 
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Shirt className="w-5 h-5 animate-pulse" /> Kombin Stüdyosu
            </Link>
            <Link 
              href="/admin/magazines" 
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-pink-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Layers className="w-5 h-5" /> Dergi Stüdyosu
            </Link>
            <Link 
              href="/admin/news/new" 
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Newspaper className="w-5 h-5" /> Yeni Haber Yaz
            </Link>
          </div>
        </div>

        {/* Canlı Durum Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur px-3.5 py-2.5 rounded-lg border border-white/5">
            <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">AI Motoru</div>
              <div className="text-xs font-black text-purple-300">NVIDIA NIM (Flux.1)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur px-3.5 py-2.5 rounded-lg border border-white/5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Veritabanı</div>
              <div className="text-xs font-black text-emerald-300">Supabase Realtime</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur px-3.5 py-2.5 rounded-lg border border-white/5">
            <Activity className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Sunucu Tepki</div>
              <div className="text-xs font-black text-blue-300">14ms (Optimal)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur px-3.5 py-2.5 rounded-lg border border-white/5">
            <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Tasarım Modülü</div>
              <div className="text-xs font-black text-yellow-300">Canva v2.0 Aktif</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8-STAT İSTATİSTİK İZGARA */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-yellow-400 rounded-sm"></span>
          Sistem İstatistikleri
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div 
                key={i} 
                className={`bg-[#1e293b]/60 hover:bg-[#1e293b] border ${stat.bg} rounded-xl p-5 transition-all relative overflow-hidden group`}
              >
                <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-xl group-hover:scale-150 transition-transform`}></div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-bold text-gray-400">{stat.label}</span>
                  <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="text-3xl font-black text-white relative z-10 tracking-tight">
                  {stat.value.toLocaleString('tr-TR')}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI CANVA VE ÖZEL TASARIM STÜDYOSU VİTRİNİ */}
      <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-blue-900/30 border-2 border-purple-500/40 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black uppercase mb-3">
              <Wand2 className="w-3.5 h-3.5 animate-spin" /> PRO TASARIM STÜDYOSU
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Canva Benzeri Yapay Zeka Dergi & Tasarım Motoru
            </h3>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Dergiler modülünde artık katmanları sürükleyip bırakabilir, metin fontlarını, köşe yuvarlaklıklarını, saydamlığı ve renk paletlerini Canva gibi profesyonelce yönetebilirsiniz. NVIDIA NIM yapay zekası tek tıkla sayfa tasarlar!
            </p>
          </div>
          <Link 
            href="/admin/magazines" 
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-4 rounded-xl shadow-xl shadow-yellow-500/20 flex items-center gap-3 shrink-0 text-sm transition-transform hover:scale-105"
          >
            <Layers className="w-5 h-5" /> Stüdyoyu Şimdi Aç <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* TÜM YÖNETİM MODÜLLERİ GRID (13 BÖLÜM) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-500 rounded-sm"></span>
            Yönetim Modülleri ({adminModules.length} Sayfa)
          </h2>
          <span className="text-xs text-gray-400">Tüm sayfalara anında erişin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminModules.map((mod, idx) => {
            const Icon = mod.icon
            return (
              <Link
                key={idx}
                href={mod.href}
                className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${mod.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    {mod.badge && (
                      <span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded tracking-wider shadow">
                        {mod.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-yellow-400 transition-colors flex items-center justify-between">
                    <span>{mod.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-yellow-400" />
                  </h3>
                  <p className="text-xs text-gray-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}
