import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { MessageCircle, Search, Pin, MessageSquare, Clock, Users, Plus, ChevronRight, Activity } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const revalidate = 60;

export default async function ForumIndexPage() {
  const supabase = await createClient();

  // Mock Topics
  const mockTopics = [
    { id: 1, title: "HabboZone'a Hoş Geldiniz!", tag: "[DUYURU]", tagColor: "text-[#22c55e]", preview: "Merhabalar, yeni sitemiz olan HabboZone'a hoş geldiniz. Sizler için muhteşem etkinlikler planlıyoruz!", author: "HabboStaff", replies: 12, lastActive: "2 saat önce", isPinned: true },
    { id: 2, title: "Haftanın En İyi Odası", tag: "[ETKİNLİK]", tagColor: "text-[#a855f7]", preview: "Bu haftanın en iyi odası seçimi başladı! Hemen odanı tasarla ve yarışmaya katıl.", author: "EventTeam", replies: 45, lastActive: "5 saat önce", isPinned: true },
    { id: 3, title: "Yeni Gelen Eşyalar Hakkında", tag: "[TARTIŞMA]", tagColor: "text-[#3b82f6]", preview: "Mağazaya eklenen son nadireler hakkında ne düşünüyorsunuz? Fiyatları uygun mu?", author: "Koleksiyoncu", replies: 8, lastActive: "15 dakika önce", isPinned: false },
    { id: 4, title: "Mobilya Fiyat Listesi Güncellendi", tag: "[REHBER]", tagColor: "text-[#f59e0b]", preview: "Ağustos ayının güncel mobilya değerleri listesine buradan ulaşabilirsiniz.", author: "TradeUzmanı", replies: 32, lastActive: "1 gün önce", isPinned: false },
    { id: 5, title: "Bugün Oyuna Giremiyorum", tag: "[YARDIM]", tagColor: "text-[#ef4444]", preview: "İstemci %76'da takılı kalıyor. Çözümünü bilen var mı?", author: "YeniHabbo", replies: 3, lastActive: "1 saat önce", isPinned: false },
  ];

  // Mock Categories
  const categories = [
    { name: "Duyurular & Haberler", color: "bg-[#22c55e]" },
    { name: "Etkinlikler & Yarışmalar", color: "bg-[#a855f7]" },
    { name: "Genel Tartışma", color: "bg-[#3b82f6]" },
    { name: "Rehberler & İpuçları", color: "bg-[#f59e0b]" },
  ];

  // Mock Recent Activities
  const recentActivities = [
    { id: 1, user: "HabboStaff", action: "yeni bir konu açtı:", target: "[ETKİNLİK] Büyük Yaz Partisi", time: "2 saat önce" },
    { id: 2, user: "Koleksiyoncu", action: "yanıtladı:", target: "Yeni Gelen Eşyalar Hakkında", time: "15 dakika önce" },
    { id: 3, user: "TradeUzmanı", action: "yeni bir konu açtı:", target: "Mobilya Fiyat Listesi Güncellendi", time: "1 gün önce" },
  ];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-6 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1000px] w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">TOPLULUK</h1>
                <p className="text-[#94a3b8] text-sm font-medium">Habbo dünyasının nabzı burada atıyor!</p>
            </div>
            
            <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-[12px] px-6 py-2.5 rounded transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)] shrink-0 self-start md:self-auto">
                <Plus size={16} />
                YENİ KONU AÇ
            </button>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        
        {/* Left Column - Topics */}
        <div className="min-w-0">
            
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-4 mb-6">
                <button className="px-6 py-2.5 bg-[#1e293b] text-white font-bold text-[12px] rounded border border-[#334155] transition-colors">
                    TÜM KONULAR
                </button>
                <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                    DUYURULAR
                </button>
                <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                    TARTIŞMA
                </button>
                <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                    ETKİNLİKLER
                </button>
                <button className="px-6 py-2.5 text-[#64748b] hover:text-white font-bold text-[12px] rounded hover:bg-[#0a1325] transition-colors">
                    REHBERLER
                </button>
            </div>

            {/* Topic List */}
            <div className="space-y-3">
                {mockTopics.map((topic) => (
                    <Link href={`/forum/${topic.id}`} key={topic.id} className="habbo-box habbo-card-hover p-3 flex gap-4 cursor-pointer">
                        
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded bg-[#0a1325] border border-[#1e293b] flex items-center justify-center shrink-0 overflow-hidden relative hidden sm:flex">
                            <HabboAvatar username={topic.author} size="m" headOnly direction={3} className="w-8 h-8" />
                        </div>

                        {/* Topic Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                {topic.isPinned && <Pin size={12} className="text-[#ef4444] shrink-0" />}
                                <h3 className="text-[14px] font-bold text-white hover:text-[#3b82f6] transition-colors truncate cursor-pointer">
                                    <span className={`${topic.tagColor} mr-1`}>{topic.tag}</span>
                                    {topic.title}
                                </h3>
                            </div>
                            <p className="text-[12px] text-[#94a3b8] line-clamp-1 mb-2">{topic.preview}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#64748b] font-medium">
                                <span className="flex items-center gap-1">
                                    <Users size={12} /> by <span className="text-white font-bold">{topic.author}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare size={12} /> {topic.replies} Cevap
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> Son: {topic.lastActive}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button className="text-[#64748b] hover:text-white font-bold text-[12px] transition-colors">
                    DAHA FAZLA YÜKLE ↓
                </button>
            </div>

        </div>

        {/* Right Column - Sidebar */}
        <aside className="space-y-6">
            
            {/* Önemli Kategoriler */}
            <div className="habbo-box overflow-hidden">
                <div className="habbo-box-header p-4 flex items-center gap-2">
                    <Search size={16} className="text-[#3b82f6]" />
                    <h2 className="text-[13px] font-bold text-white tracking-wide">ÖNEMLİ KATEGORİLER</h2>
                </div>
                <div className="p-2">
                    {categories.map((cat, i) => (
                        <Link href="#" key={i} className="flex items-center justify-between p-3 rounded hover:bg-[#0a1325] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                                <span className="text-[12px] font-bold text-[#94a3b8] group-hover:text-white transition-colors">{cat.name}</span>
                            </div>
                            <ChevronRight size={14} className="text-[#475569] group-hover:text-white transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Son Aktiviteler */}
            <div className="habbo-box overflow-hidden">
                <div className="habbo-box-header p-4 flex items-center gap-2">
                    <Activity size={16} className="text-[#22c55e]" />
                    <h2 className="text-[13px] font-bold text-white tracking-wide">SON AKTİVİTELER</h2>
                </div>
                <div className="p-4 space-y-4">
                    {recentActivities.map((act) => (
                        <div key={act.id} className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded bg-[#0a1325] border border-[#1e293b] flex items-center justify-center shrink-0 overflow-hidden relative">
                                <HabboAvatar username={act.user} size="m" headOnly direction={3} className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] text-[#94a3b8] leading-tight mb-1">
                                    <span className="font-bold text-white">{act.user}</span> {act.action}
                                </p>
                                <p className="text-[12px] font-bold text-[#3b82f6] line-clamp-1 mb-1 hover:underline cursor-pointer">
                                    {act.target}
                                </p>
                                <p className="text-[10px] text-[#64748b]">{act.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </aside>

      </div>
    </div>
  );
}
