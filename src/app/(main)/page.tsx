import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { 
  Flame, Users, Calendar, Trophy, MessageSquare, ChevronRight, 
  Newspaper, BookOpen, ShoppingBag, ArrowRight, Gift, LifeBuoy, Clock, Eye, Award, Play
} from 'lucide-react';

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  return (
    <div className="pb-16 w-full">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[450px] overflow-hidden flex justify-center border-b border-[#1e293b]">
         <div className="absolute inset-0 pixelated opacity-90 scale-105">
           <Image src="/landing-bg.jpg" alt="HabboZone Landing Background" fill priority className="object-cover object-center" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#0a1325]/95 via-[#0a1325]/60 to-[#0a1325]/80"></div>
         
         <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex justify-between items-center h-full">
            
            {/* Left Texts & Buttons */}
            <div className="max-w-[500px]">
               <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ef4444] text-white px-2 py-1 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#991b1b]">GÜNÜN MANŞETİ</span>
                  <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-1 rounded">Yeni Sezon</span>
               </div>
               <h1 className="text-[40px] md:text-[50px] font-black mb-4 leading-[1.1] tracking-tighter hover:scale-[1.02] transition-transform duration-300">
                  <span className="text-white block hover:text-[#facc15] transition-colors cursor-pointer" style={{ textShadow: '2px 2px 0 #000' }}>Habbo Yaz Etkinlikleri Tüm Hızıyla Sürüyor!</span>
               </h1>
               <p className="text-base text-gray-200 mb-8 font-medium leading-relaxed max-w-[450px]" style={{ textShadow: '1px 1px 0 #000' }}>
                 Yepyeni furniler, kıyafetler ve nadirelerle dolu yaz güncellemesi aktif. Etkinliklere katıl, rozetleri topla ve yaza damganı vur!
               </p>
               <div className="flex gap-4">
                  <Link href="/news" className="bg-[#facc15] hover:bg-[#eab308] text-black px-6 py-3 rounded-[4px] font-black text-sm border-2 border-black shadow-[0_4px_0_#a16207] hover:translate-y-1 hover:shadow-[0_0px_0_#a16207] active:shadow-none transition-all uppercase tracking-wider flex items-center gap-2">
                    HABERİ OKU <ArrowRight size={16} />
                  </Link>
                  <Link href="/register" className="bg-[#4ade80] hover:bg-[#22c55e] text-black px-6 py-3 rounded-[4px] font-black text-sm border-2 border-black shadow-[0_4px_0_#14532d] hover:translate-y-1 hover:shadow-[0_0px_0_#14532d] active:shadow-none transition-all uppercase tracking-wider hidden sm:flex items-center gap-2">
                    KAYIT OL <Play size={16} className="fill-black" />
                  </Link>
               </div>
            </div>

            {/* Right: HABBO NEWS floating box */}
            <div className="hidden lg:flex flex-col w-[340px] mt-4 relative">
               {/* Online Users Badge */}
               <div className="absolute -top-12 right-0 bg-[#0a1325]/80 backdrop-blur-md border border-[#1e293b] rounded-full px-4 py-1.5 flex items-center gap-3">
                   <div className="relative flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                   </div>
                   <span className="text-white font-bold text-sm">248 Çevrimiçi</span>
               </div>

               <div className="habbo-box flex flex-col">
                 <div className="habbo-box-header flex justify-between items-center">
                    <span className="text-[#facc15] font-black tracking-wide text-sm" style={{ textShadow: '1px 1px 0 #000' }}>HABBO NEWS</span>
                    <ArrowRight size={14} className="text-gray-400" />
                 </div>
                 <div className="p-3 flex flex-col gap-3">
                    {[
                      { tag: "YENİ", tagColor: "bg-[#ef4444]", title: "Habbo 2024 Yaz Etkinlikleri", desc: "Tüm detaylar burada!" },
                      { tag: "ETKİNLİK", tagColor: "bg-[#22c55e]", title: "HabboZone Gazetesi #12", desc: "Okumak için tıkla!" },
                      { tag: "REHBER", tagColor: "bg-[#3b82f6]", title: "Nadir Eşya Rehberi", desc: "Nadirleri keşfet!" }
                    ].map((item, i) => (
                      <Link key={i} href="/news" className="flex items-center gap-3 group hover:bg-[#1e293b] p-1.5 rounded transition-all hover:pl-2">
                        <div className="w-12 h-12 bg-[#050a14] rounded-[4px] border border-[#1e293b] relative overflow-hidden shrink-0">
                          <img src="https://images.habbo.com/c_images/reception/new_furni_promo.png" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pixelated" alt="" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className={`${item.tagColor} text-white text-[9px] font-black px-1.5 py-0.5 rounded-[3px] mb-0.5 uppercase`}>{item.tag}</span>
                          <span className="text-white font-bold text-[12px] group-hover:text-[#facc15] transition-colors line-clamp-1">{item.title}</span>
                          <span className="text-gray-400 text-[11px] line-clamp-1">{item.desc}</span>
                        </div>
                      </Link>
                    ))}
                 </div>
                 <div className="p-3 pt-0">
                   <Link href="/news" className="habbo-button block w-full text-center p-2">
                     TÜM HABERLER
                   </Link>
                 </div>
               </div>
            </div>
         </div>

         {/* Ticker Bar */}
         <div className="absolute bottom-0 w-full h-10 bg-[#020610]/80 border-t border-[#1e293b] flex items-center overflow-hidden z-20 backdrop-blur-sm">
             <div className="w-full max-w-[1200px] mx-auto flex items-center relative h-full">
                 <div className="bg-[#ef4444] text-white font-black text-[11px] px-3 h-full flex items-center z-10 absolute left-0 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
                   SON DAKİKA
                 </div>
                 <div className="flex-1 overflow-hidden ml-[100px] flex items-center h-full relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
                     <div className="flex w-[200%] animate-ticker">
                         <div className="flex gap-12 shrink-0 items-center whitespace-nowrap text-white text-[12px] font-medium pr-12">
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Yeni bir nadire eklendi: Altın Ejderha</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> HabboZone yaz turnuvası kayıtları başladı!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Hafta sonu %50 indirimli HC fırsatı!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Odalardaki pet sınırı 50'ye yükseltildi!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Yeni HabboZone gazete sayısı yayınlandı, hemen oku!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Forumda haftanın en iyi oda tasarımı oylaması devam ediyor!</span>
                         </div>
                         <div className="flex gap-12 shrink-0 items-center whitespace-nowrap text-white text-[12px] font-medium pr-12">
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Yeni bir nadire eklendi: Altın Ejderha</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> HabboZone yaz turnuvası kayıtları başladı!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Hafta sonu %50 indirimli HC fırsatı!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Odalardaki pet sınırı 50'ye yükseltildi!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Yeni HabboZone gazete sayısı yayınlandı, hemen oku!</span>
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></div> Forumda haftanın en iyi oda tasarımı oylaması devam ediyor!</span>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* MID MENU BAR */}
      <div className="max-w-[1200px] mx-auto px-4 -mt-8 relative z-20">
         <div className="habbo-box p-4 flex justify-between items-center shadow-xl gap-4 flex-wrap">
            {[
              { icon: Newspaper, title: 'HABERLER', desc: 'En güncel duyurular', color: 'text-yellow-400' },
              { icon: BookOpen, title: 'GAZETE', desc: 'Habbo Zone Gazetesi', color: 'text-green-400' },
              { icon: MessageSquare, title: 'REHBERLER', desc: 'Strateji ve ipuçları', color: 'text-blue-400' },
              { icon: Users, title: 'TOPLULUK', desc: 'Habbo severler burada', color: 'text-orange-400' },
              { icon: Gift, title: 'ETKİNLİKLER', desc: 'Yarışmalar & Etkinlikler', color: 'text-purple-400' },
              { icon: ShoppingBag, title: 'DEĞERLER', desc: 'Nadir Eşyalar & Fiyatlar', color: 'text-pink-400' }
            ].map((item, i) => (
              <Link key={i} href="#" className="flex items-center gap-3 flex-1 min-w-[150px] group cursor-pointer hover:bg-[#1e293b] p-2 rounded-[6px] transition-colors">
                <item.icon size={28} strokeWidth={1.5} className={`${item.color} group-hover:scale-110 transition-transform`} />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[13px] tracking-wide group-hover:text-white">{item.title}</span>
                  <span className="text-gray-400 text-[11px]">{item.desc}</span>
                </div>
              </Link>
            ))}
         </div>
      </div>

      {/* MAIN CONTENT 3 COLUMNS */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
         
         {/* Left Col: SON HABERLER */}
         <div className="flex-1 lg:w-[30%] flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-2">
               <div className="flex items-center gap-2">
                  <Newspaper size={16} className="text-red-400" />
                  <h2 className="text-[#facc15] font-black text-sm tracking-wide">SON HABERLER</h2>
               </div>
               <Link href="/news" className="text-gray-400 hover:text-white text-[11px] font-bold flex items-center gap-1 uppercase">
                 TÜM HABERLER <ArrowRight size={12} />
               </Link>
            </div>

            {[
              { tag: "YENİ", tagColor: "bg-[#ef4444]", title: "Habbo Yaz Güncellemesi Yayında!", desc: "Habbo Hotel'e gelen yeni yaz güncellemesi ile yepyeni furniler, kıyafetler ve odalar seni bekliyor!", date: "Bugün", comments: "125", views: "1.2b", time: "3 dk", author: "admin" },
              { tag: "ETKİNLİK", tagColor: "bg-[#22c55e]", title: "HabboZone Yaz Etkinlikleri Başladı!", desc: "Yarışmalar, odalar, hediyeler ve daha fazlası! Detaylar haberimizde.", date: "Dün", comments: "85", views: "850", time: "2 dk", author: "frank" },
              { tag: "GAZETE", tagColor: "bg-[#a855f7]", title: "HabboZone Gazetesi #12 Yayında!", desc: "En yeni haberler, röportajlar ve özel içerikler yeni sayımızda seni bekliyor!", date: "2 gün önce", comments: "60", views: "540", time: "5 dk", author: "bonnie" }
             ].map((news, i) => (
                <Link key={i} href="#" className="habbo-box hover:border-[#3b82f6]/50 p-3 flex flex-col gap-3 group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]">
                   <div className="w-full h-[140px] bg-[#0a1325] rounded-[4px] relative overflow-hidden border border-[#1e293b]">
                      <Image src="https://images.habbo.com/c_images/reception/new_furni_promo.png" alt={news.title} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pixelated" />
                      <span className={`absolute top-2 left-2 ${news.tagColor} text-white text-[10px] font-black px-2 py-0.5 rounded-[3px] uppercase shadow-md z-10`}>{news.tag}</span>
                   </div>
                   <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-white font-bold text-[15px] leading-tight group-hover:text-[#facc15] transition-colors mb-2">{news.title}</h3>
                        <p className="text-gray-400 text-[12px] leading-snug line-clamp-2 mb-3">{news.desc}</p>
                      </div>
                      <div className="flex flex-col gap-2 border-t border-[#1e293b]/50 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-white text-[11px] font-bold"><img src="https://www.habbo.com.tr/habbo-imaging/avatarimage?user=presh&direction=2&head_direction=2&action=&gesture=&size=s" className="w-5 h-5 rounded-full bg-[#0a1325] pixelated border border-[#1e293b]" alt=""/> {news.author}</span>
                          <span className="text-[#6b7280] text-[10px] font-bold">{news.date}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#6b7280] text-[10px] font-bold">
                           <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors"><Clock size={10} /> {news.time}</span>
                              <span className="flex items-center gap-1 group-hover:text-green-400 transition-colors"><Eye size={10} /> {news.views}</span>
                           </div>
                           <span className="flex items-center gap-1 group-hover:text-[#facc15] transition-colors"><MessageSquare size={10} /> {news.comments} Yorum</span>
                        </div>
                      </div>
                   </div>
                </Link>
             ))}
         </div>

         {/* Center Col: HABBO ZONE GAZETESI */}
         <div className="flex-[1.4] lg:w-[45%] flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-2">
               <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#facc15]" />
                  <h2 className="text-[#facc15] font-black text-sm tracking-wide">HABBO ZONE GAZETESİ</h2>
               </div>
               <Link href="/magazines" className="text-gray-400 hover:text-white text-[11px] font-bold flex items-center gap-1 uppercase">
                 TÜM SAYILAR <ArrowRight size={12} />
               </Link>
            </div>

            <div className="habbo-box p-4 flex flex-col gap-4">
               {/* Featured Issue */}
               <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pb-4 border-b border-[#1e293b]">
                  <div className="w-[140px] h-[190px] shrink-0 border-[3px] border-black bg-[#d1d5db] shadow-[4px_4px_0_#000] rotate-2 hover:rotate-0 transition-transform cursor-pointer overflow-hidden flex flex-col relative">
                     <div className="w-full h-8 bg-[#0a1325] border-b-2 border-black flex items-center justify-center">
                        <span className="text-[#facc15] font-black text-[12px]">HABBO ZONE</span>
                     </div>
                     <div className="flex-1 w-full flex items-center justify-center p-2 relative">
                        <img src="https://images.habbo.com/c_images/reception/newspaper_promo.png" className="w-full h-full object-cover pixelated opacity-90" alt="" />
                     </div>
                  </div>
                  <div className="flex flex-col flex-1 pt-2">
                     <h3 className="text-white font-black text-[20px] mb-2 leading-tight">HabboZone Gazetesi #12</h3>
                     <p className="text-gray-300 text-[13px] mb-4">Habbo dünyasındaki en sıcak gelişmeler, röportajlar, odalar ve daha fazlası!</p>
                     <Link href="/magazines/12" className="bg-[#facc15] hover:bg-[#eab308] text-black w-max px-6 py-2.5 rounded-[4px] font-black text-[13px] border-2 border-black shadow-[0_4px_0_#a16207] hover:translate-y-1 hover:shadow-none transition-all uppercase">
                       HEMEN OKU
                     </Link>
                  </div>
               </div>
               
               {/* Grid of issues */}
               <div className="grid grid-cols-4 gap-3 pt-2">
                  {['#12', '#11', '#00', '#09'].map((issue, i) => (
                    <Link key={i} href={`/magazines/${issue.replace('#','')}`} className="flex flex-col items-center gap-2 group">
                      <span className="text-white font-bold text-[12px]">{issue}</span>
                      <div className="w-full aspect-[3/4] border-2 border-black bg-[#d1d5db] shadow-[2px_2px_0_#000] group-hover:rotate-2 transition-transform overflow-hidden flex flex-col">
                        <div className="w-full h-6 bg-[#0a1325] border-b border-black flex items-center justify-center">
                          <span className="text-[#facc15] font-black text-[8px]">HABBO ZONE</span>
                        </div>
                        <div className="flex-1 w-full flex items-center justify-center p-1 relative">
                          <img src="https://images.habbo.com/c_images/reception/newspaper_promo.png" className="w-full h-full object-cover pixelated opacity-80" alt="" />
                        </div>
                      </div>
                    </Link>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Col: WIDGETS */}
         <div className="flex-1 lg:w-[25%] flex flex-col gap-6">
            
            {/* Sıcak Konular */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                  <h2 className="text-[#facc15] font-black text-sm tracking-wide">SICAK KONULAR</h2>
                  <Link href="/forum" className="text-gray-400 hover:text-white text-[11px] font-bold flex items-center gap-1 uppercase">TÜMÜ <ArrowRight size={12} /></Link>
               </div>
               <div className="habbo-box p-2 flex flex-col gap-1">
                  {[
                    'Yeni nadir geldi!',
                    'Habbo 20. Yıl kutlaması başlıyor!',
                    'Best Habbo Odaları',
                    'Güvenli Takas Rehberi',
                    'Habbo\'nun Eski Dönemleri'
                  ].map((topic, i) => (
                    <Link key={i} href="#" className="flex items-center gap-2 p-2 hover:bg-[#1e293b] rounded-[4px] transition-colors group">
                       <Flame size={14} className="text-orange-500 group-hover:scale-125 transition-transform" />
                       <span className="text-gray-200 text-[13px] font-medium group-hover:text-white">{topic}</span>
                    </Link>
                  ))}
               </div>
            </div>

            {/* Çevrimiçi Kullanıcılar */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                  <h2 className="text-[#facc15] font-black text-sm tracking-wide">TOPLULUK ÜYELERİMİZ</h2>
                  <Link href="/staff" className="text-gray-400 hover:text-white text-[11px] font-bold flex items-center gap-1 uppercase">TÜMÜ <ArrowRight size={12} /></Link>
               </div>
               <div className="habbo-box p-3 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {['frank', 'bonnie', 'piccolo', 'admin', 'moderator', 'builder', 'player'].map((usr, i) => (
                       <div key={i} className="w-8 h-8 rounded-full bg-[#0a1325] border border-[#1e293b] overflow-hidden flex items-center justify-center z-10 relative">
                          <img src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${usr}&direction=2&head_direction=2&action=&gesture=&size=s`} className="pixelated" alt="" />
                       </div>
                    ))}
                  </div>
                  <span className="text-white font-bold text-[13px] ml-2">1.248+</span>
               </div>
            </div>

            {/* Discord Status */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                  <h2 className="text-[#5865F2] font-black text-sm tracking-wide">DISCORD TOPLULUĞU</h2>
               </div>
               <div className="habbo-box p-4 bg-[#5865F2]/10 border-[#5865F2]/20 flex flex-col gap-3 items-center text-center">
                  <div className="w-12 h-12 bg-[#5865F2] rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(88,101,242,0.4)]">
                     <MessageSquare size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[14px] mb-1">HabboZone Discord</h3>
                    <p className="text-gray-400 text-[11px] mb-3">Sohbete katıl, etkinlikleri kaçırma ve yeni arkadaşlar edin!</p>
                    <Link href="#" className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2 rounded-[4px] font-bold text-[12px] transition-colors">
                      Topluluğa Katıl
                    </Link>
                  </div>
               </div>
            </div>

            {/* Yeni Rozetler */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                  <h2 className="text-[#facc15] font-black text-sm tracking-wide">YENİ ROZETLER</h2>
                  <Link href="/badges" className="text-gray-400 hover:text-white text-[11px] font-bold flex items-center gap-1 uppercase">TÜMÜ <ArrowRight size={12} /></Link>
               </div>
               <div className="habbo-box p-3">
                  <div className="grid grid-cols-5 gap-2">
                     {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="bg-[#0a1325] border border-[#1e293b] rounded-[4px] aspect-square flex items-center justify-center hover:bg-[#1e293b] hover:border-gray-500 transition-colors cursor-pointer group" title={`Rozet #${i+1}\n\nKazanma Yöntemi:\nEtkinliklere katılarak bu rozeti kazanabilirsin.`}>
                           <img src={`https://images.habbo.com/c_images/album1584/TR${100+i}.gif`} alt="Badge" className="group-hover:scale-125 transition-transform duration-300 pixelated" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Etkinlik Takvimi */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                  <h2 className="text-[#a855f7] font-black text-sm tracking-wide flex items-center gap-2">ETKİNLİK TAKVİMİ</h2>
                  <Link href="/events" className="text-gray-400 hover:text-white text-[11px] font-bold flex items-center gap-1 uppercase">TÜMÜ <ArrowRight size={12} /></Link>
               </div>
               <div className="habbo-box p-3 flex flex-col gap-2">
                  {[
                    { day: 'BUGÜN', time: '20:00', title: 'Yaz Partisi', host: 'frank', color: 'text-green-400', border: 'border-green-400/30' },
                    { day: 'YARIN', time: '21:30', title: 'Oda Tasarım Yarışması', host: 'bonnie', color: 'text-purple-400', border: 'border-purple-400/30' },
                    { day: 'PAZAR', time: '19:00', title: 'Saklambaç', host: 'admin', color: 'text-blue-400', border: 'border-blue-400/30' }
                  ].map((evt, i) => (
                     <div key={i} className={`flex items-center justify-between p-2 bg-[#0a1325] border ${evt.border} rounded-[4px] hover:bg-[#1e293b] transition-colors cursor-pointer`}>
                        <div className="flex items-center gap-3">
                           <div className="flex flex-col items-center justify-center min-w-[40px]">
                              <span className={`text-[10px] font-black ${evt.color}`}>{evt.day}</span>
                              <span className="text-white text-[11px] font-bold">{evt.time}</span>
                           </div>
                           <div className="w-px h-8 bg-[#1e293b]"></div>
                           <div className="flex flex-col">
                              <span className="text-gray-300 text-[12px] font-medium truncate">{evt.title}</span>
                              <span className="text-gray-500 text-[10px] flex items-center gap-1"><Users size={10} /> {evt.host}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Hızlı Erişim */}
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                  <h2 className="text-[#facc15] font-black text-sm tracking-wide">HIZLI ERİŞİM</h2>
               </div>
               <div className="grid grid-cols-4 gap-2 habbo-box p-3">
                  {[
                    { icon: Newspaper, label: 'Habbo Hotel' },
                    { icon: BookOpen, label: 'Habbo Rehber' },
                    { icon: MessageSquare, label: 'Habbo Forum' },
                    { icon: LifeBuoy, label: 'Destek Merkezi' }
                  ].map((item, i) => (
                    <Link key={i} href="#" className="flex flex-col items-center gap-1.5 p-2 hover:bg-[#1e293b] rounded-[4px] transition-colors group text-center">
                      <div className="w-8 h-8 rounded bg-[#0a1325] border border-[#1e293b] flex items-center justify-center text-[#facc15] group-hover:scale-110 transition-transform">
                         <item.icon size={16} />
                      </div>
                      <span className="text-gray-400 text-[10px] font-medium leading-tight group-hover:text-white">{item.label}</span>
                    </Link>
                  ))}
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}

