import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { 
  Flame, Users, Calendar, Trophy, MessageSquare, ChevronRight, 
  Newspaper, BookOpen, ShoppingBag, ArrowRight, Gift, LifeBuoy,
  List, Star, Megaphone, Mic, Download, ExternalLink, ChevronLeft
} from 'lucide-react';

export const revalidate = 60;

export default async function MagazinesPage() {
  const supabase = await createClient();

  return (
    <div className="w-full bg-[#0a0f18] min-h-screen text-white font-sans py-8">
      
      {/* Breadcrumb */}
      <div className="max-w-[1300px] mx-auto px-4 flex items-center gap-2 text-gray-400 text-[12px] font-medium mb-6">
         <Link href="/" className="hover:text-white flex items-center"><Newspaper size={14} className="mr-1"/> Ana Sayfa</Link>
         <ChevronRight size={12} />
         <Link href="/magazines" className="hover:text-white">Gazete</Link>
         <ChevronRight size={12} />
         <span className="text-white">HabboZone Gazetesi #12</span>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 flex flex-col xl:flex-row gap-6">
         
         {/* ======================= LEFT SIDEBAR ======================= */}
         <div className="w-full xl:w-[260px] shrink-0 flex flex-col gap-6">
            
            {/* Gazete Kategorileri */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-4 uppercase">GAZETE KATEGORİLERİ</h3>
               <div className="flex flex-col gap-1">
                  {[
                    { label: 'Tümü', count: 48, icon: List, color: 'text-yellow-400' },
                    { label: 'Başlık Haberler', count: 12, icon: Star, color: 'text-red-400' },
                    { label: 'Etkinlikler', count: 10, icon: Gift, color: 'text-green-400' },
                    { label: 'Rehberler', count: 8, icon: BookOpen, color: 'text-blue-400' },
                    { label: 'Duyurular', count: 7, icon: Megaphone, color: 'text-orange-400' },
                    { label: 'Röportajlar', count: 5, icon: Mic, color: 'text-purple-400' },
                    { label: 'Topluluk', count: 6, icon: Users, color: 'text-pink-400' }
                  ].map((cat, i) => (
                    <Link key={i} href="#" className="flex justify-between items-center px-2 py-2 hover:bg-[#1e293b] rounded-[4px] transition-colors group">
                       <div className="flex items-center gap-2">
                          <cat.icon size={14} className={`${cat.color} group-hover:scale-110 transition-transform`} />
                          <span className="text-gray-300 text-[13px] font-medium group-hover:text-white">{cat.label}</span>
                       </div>
                       <span className="text-gray-500 text-[11px]">{cat.count}</span>
                    </Link>
                  ))}
               </div>
            </div>

            {/* Gazete Hakkında */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-3 uppercase">GAZETE HAKKINDA</h3>
               <p className="text-gray-300 text-[12px] leading-relaxed mb-4">
                 HabboZone Gazetesi, Habbo dünyasındaki en güncel gelişmeleri, etkinlikleri ve özel içerikleri sizlere sunar.
                 <br/><br/>
                 Her hafta yeni sayılarla karşınızdayız!
               </p>
               <div className="w-full h-24 bg-[#0a0f18] rounded-[4px] border border-[#1e293b] overflow-hidden flex items-center justify-center relative">
                 <img src="https://images.habbo.com/c_images/reception/newspaper_promo.png" className="pixelated opacity-80" alt="" />
               </div>
            </div>

            {/* Etiketler */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-3 uppercase">ETİKETLER</h3>
               <div className="flex flex-wrap gap-2">
                  {['#yaz2024', '#güncelleme', '#etkinlik', '#habbo hotel', '#rozet', '#furni', '#rehber', '#plaj partisi', '#topluluk'].map((tag, i) => (
                     <Link key={i} href="#" className="bg-[#1e293b] border border-[#2b3548] text-gray-300 text-[11px] px-2 py-1 rounded-[4px] hover:bg-[#6b21a8] hover:border-[#6b21a8] hover:text-white transition-colors font-medium">
                        {tag}
                     </Link>
                  ))}
               </div>
            </div>

            {/* Bültene Katıl */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-2 uppercase">BÜLTENE KATIL!</h3>
               <p className="text-gray-300 text-[11px] leading-relaxed mb-4">
                 En yeni haber ve etkinliklerden haberdar olmak için e-posta bültenimize katıl!
               </p>
               <input type="email" placeholder="E-posta adresiniz" className="bg-[#0a0f18] border border-[#2b3548] text-white text-[12px] px-3 py-2.5 rounded-[4px] mb-2 outline-none focus:border-[#a78bfa]" />
               <button className="w-full bg-[#6b21a8] hover:bg-[#7e22ce] text-white font-bold text-[12px] py-2.5 rounded-[4px] transition-colors uppercase tracking-wider">
                  KATIL
               </button>
            </div>

         </div>


         {/* ======================= CENTER CONTENT ======================= */}
         <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* Hero Banner */}
            <div className="w-full h-[200px] rounded-[6px] border-2 border-[#1e293b] relative overflow-hidden shadow-xl flex flex-col items-center justify-center">
               <div className="absolute inset-0 bg-cover bg-center pixelated opacity-70" style={{ backgroundImage: 'url("/landing-bg.jpg")' }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] to-transparent"></div>
               <div className="absolute inset-0 bg-[#000000]/30"></div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                  <h1 className="text-[36px] md:text-[48px] font-black text-[#facc15] leading-none tracking-tighter" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 0 #854d0e' }}>
                     HABBOZONE
                  </h1>
                  <h1 className="text-[32px] md:text-[44px] font-black text-white leading-none tracking-tighter mb-2" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 0 #475569' }}>
                     GAZETESİ
                  </h1>
                  <span className="text-white font-bold text-[13px] md:text-[15px] tracking-[0.2em] bg-black/60 px-4 py-1 rounded-[4px] backdrop-blur-sm border border-white/10">
                     #12 SAYI - MAYIS 2024
                  </span>
               </div>
            </div>

            {/* Menu Bar under Hero */}
            <div className="w-full bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-1.5 flex gap-1 overflow-x-auto hide-scrollbar shadow-lg">
               <button className="bg-[#4c1d95] text-white font-bold text-[13px] px-6 py-2 rounded-[4px] whitespace-nowrap uppercase tracking-wider">
                  GAZETE
               </button>
               <button className="text-gray-300 hover:text-white hover:bg-[#1e293b] font-bold text-[13px] px-6 py-2 rounded-[4px] whitespace-nowrap transition-colors uppercase tracking-wider">
                  ARŞİV
               </button>
               <button className="text-gray-300 hover:text-white hover:bg-[#1e293b] font-bold text-[13px] px-6 py-2 rounded-[4px] whitespace-nowrap transition-colors uppercase tracking-wider">
                  YAZARLAR
               </button>
               <button className="text-gray-300 hover:text-white hover:bg-[#1e293b] font-bold text-[13px] px-6 py-2 rounded-[4px] whitespace-nowrap transition-colors uppercase tracking-wider">
                  HAKKIMIZDA
               </button>
            </div>

            {/* Featured Article */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col md:flex-row gap-6 shadow-lg group">
               <div className="w-full md:w-[50%] h-[240px] rounded-[4px] border border-[#2b3548] relative overflow-hidden shrink-0">
                  <img src="https://images.habbo.com/c_images/reception/new_furni_promo.png" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500 pixelated" alt="" />
               </div>
               <div className="flex flex-col flex-1 justify-center py-2">
                  <span className="bg-[#6b21a8] text-white font-black text-[10px] px-2 py-0.5 rounded-[3px] uppercase tracking-wider w-max mb-3">BAŞLIK HABER</span>
                  <h2 className="text-white font-black text-[22px] leading-tight mb-4 group-hover:text-[#a78bfa] transition-colors">
                     Habbo 2024 Yaz Güncellemesi Tüm Detaylarıyla Yayında!
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-[11px] font-bold mb-4 border-b border-[#1e293b] pb-4">
                     <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#1e293b] rounded-full flex items-center justify-center text-[#facc15] font-black text-[10px]">H</div>
                        <span className="text-gray-200">HabboZone Ekibi</span>
                     </div>
                     <div className="flex items-center gap-1.5"><Calendar size={12}/> 20 Mayıs 2024</div>
                     <div className="flex items-center gap-1.5"><MessageSquare size={12}/> 125</div>
                  </div>

                  <p className="text-gray-300 text-[13px] leading-relaxed mb-6 line-clamp-3">
                     Habbo Hotel'de yaz mevsimi resmen başladı! Yepyeni furniler, kıyafetler, odalar ve etkinliklerle dolu bu güncelleme ile otelin tadını doyasıya çıkar! HabboZone ekibi olarak sizler için inceledik.
                  </p>

                  <Link href="/news/yaz-guncellemesi" className="bg-[#4c1d95] hover:bg-[#6b21a8] text-white font-bold text-[12px] px-5 py-2.5 rounded-[4px] w-max flex items-center gap-2 transition-colors uppercase tracking-wider">
                     DEVAMINI OKU <ArrowRight size={14} />
                  </Link>
               </div>
            </div>

            {/* Grid Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { tag: "ETKİNLİK", tagColor: "bg-[#22c55e]", title: "Plaj Partisi Etkinliği Başladı!", desc: "Güneş, kum ve eğlence! Plaj Partisi etkinliği ile yazın tadını çıkar, rozetleri kazanmayı unutma!", date: "14 Mayıs 2024", comments: "85" },
                 { tag: "REHBER", tagColor: "bg-[#3b82f6]", title: "Yeni Yazlık Furniler Rehberi", desc: "Yaz temalı yeni furnileri keşfet! Odalarını yaz havasına uygun şekilde dekore etmenin ipuçları burada.", date: "10 Mayıs 2024", comments: "60" },
                 { tag: "DUYURU", tagColor: "bg-[#f97316]", title: "Habbo Hotel Bakım Çalışması", desc: "21 Mayıs Salı günü saat 10:00'da sunucularımızda bakım çalışması yapılacaktır. Lütfen dikkate alınız.", date: "15 Mayıs 2024", comments: "45" }
               ].map((post, i) => (
                  <Link key={i} href="#" className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-3 flex flex-col gap-3 group hover:border-[#4c1d95] hover:shadow-[0_0_15px_rgba(76,29,149,0.3)] transition-all">
                     <div className="w-full h-[140px] bg-[#0a0f18] rounded-[4px] border border-[#2b3548] relative overflow-hidden">
                        <img src="https://images.habbo.com/c_images/reception/new_furni_promo.png" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500 pixelated" alt="" />
                        <span className={`absolute top-2 left-2 ${post.tagColor} text-white text-[9px] font-black px-2 py-0.5 rounded-[3px] uppercase shadow-md`}>{post.tag}</span>
                     </div>
                     <div className="flex flex-col flex-1">
                        <h3 className="text-white font-bold text-[15px] leading-tight group-hover:text-[#a78bfa] transition-colors mb-2">{post.title}</h3>
                        <p className="text-gray-400 text-[12px] leading-snug line-clamp-3 mb-3 flex-1">{post.desc}</p>
                        <div className="flex justify-between items-center text-[#6b7280] text-[11px] font-bold border-t border-[#1e293b] pt-2">
                           <span>{post.date}</span>
                           <div className="flex items-center gap-1.5 text-gray-500">
                              <MessageSquare size={12} />
                              <span>{post.comments} yorum</span>
                           </div>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 mt-4">
               <button className="bg-[#131b28] border border-[#2b3548] text-gray-400 hover:text-white hover:bg-[#1e293b] px-3 py-1.5 rounded-[4px] text-[12px] font-bold flex items-center gap-1 transition-colors uppercase">
                  <ChevronLeft size={14} /> ÖNCEKİ
               </button>
               <button className="bg-[#131b28] border border-[#2b3548] text-gray-400 hover:text-white hover:bg-[#1e293b] w-8 h-8 rounded-[4px] text-[12px] font-bold flex items-center justify-center transition-colors">
                  1
               </button>
               <button className="bg-[#6b21a8] border border-[#6b21a8] text-white w-8 h-8 rounded-[4px] text-[12px] font-bold flex items-center justify-center shadow-md">
                  2
               </button>
               <button className="bg-[#131b28] border border-[#2b3548] text-gray-400 hover:text-white hover:bg-[#1e293b] w-8 h-8 rounded-[4px] text-[12px] font-bold flex items-center justify-center transition-colors">
                  3
               </button>
               <button className="bg-[#131b28] border border-[#2b3548] text-gray-400 hover:text-white hover:bg-[#1e293b] w-8 h-8 rounded-[4px] text-[12px] font-bold flex items-center justify-center transition-colors hidden sm:flex">
                  4
               </button>
               <button className="bg-[#131b28] border border-[#2b3548] text-gray-400 hover:text-white hover:bg-[#1e293b] w-8 h-8 rounded-[4px] text-[12px] font-bold flex items-center justify-center transition-colors hidden sm:flex">
                  5
               </button>
               <span className="text-gray-500 px-1">...</span>
               <button className="bg-[#131b28] border border-[#2b3548] text-gray-400 hover:text-white hover:bg-[#1e293b] w-8 h-8 rounded-[4px] text-[12px] font-bold flex items-center justify-center transition-colors">
                  12
               </button>
               <button className="bg-[#131b28] border border-[#2b3548] text-gray-400 hover:text-white hover:bg-[#1e293b] px-3 py-1.5 rounded-[4px] text-[12px] font-bold flex items-center gap-1 transition-colors uppercase">
                  SONRAKİ <ChevronRight size={14} />
               </button>
            </div>

         </div>


         {/* ======================= RIGHT SIDEBAR ======================= */}
         <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
            
            {/* Son Gazete Sayıları */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-4 uppercase">SON GAZETE SAYILARI</h3>
               <div className="flex flex-col gap-3">
                  {[
                    { id: '#12', date: '20 Mayıs 2024', month: 'Mayıs 2024' },
                    { id: '#11', date: '22 Nisan 2024', month: 'Nisan 2024' },
                    { id: '#10', date: '24 Mart 2024', month: 'Mart 2024' },
                    { id: '#09', date: '25 Şubat 2024', month: 'Şubat 2024' },
                    { id: '#08', date: '28 Ocak 2024', month: 'Ocak 2024' },
                  ].map((issue, i) => (
                    <Link key={i} href={`/magazines/${issue.id.replace('#','')}`} className="flex items-center gap-3 p-2 hover:bg-[#1e293b] border border-transparent hover:border-[#2b3548] rounded-[4px] transition-colors group">
                       <div className="w-[45px] h-[60px] bg-[#d1d5db] border border-black shadow-[2px_2px_0_rgba(0,0,0,0.5)] flex flex-col overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          <div className="w-full h-3 bg-[#202a3a] border-b border-black flex items-center justify-center">
                             <span className="text-[#facc15] font-black" style={{ fontSize: '5px' }}>HABBO ZONE</span>
                          </div>
                          <img src="https://images.habbo.com/c_images/reception/newspaper_promo.png" className="w-full h-full object-cover pixelated" alt="" />
                       </div>
                       <div className="flex flex-col justify-center">
                          <span className="text-gray-200 font-bold text-[13px] group-hover:text-white">{issue.id} - {issue.month}</span>
                          <span className="text-gray-500 text-[11px] font-medium">{issue.date}</span>
                       </div>
                    </Link>
                  ))}
               </div>
               <Link href="/magazines/archive" className="mt-4 bg-[#1e293b] hover:bg-[#2b3548] text-gray-300 hover:text-white text-[11px] font-bold py-2 rounded-[4px] flex items-center justify-center gap-2 transition-colors uppercase">
                 TÜM ARŞİV <ArrowRight size={14} />
               </Link>
            </div>

            {/* Gazete Yazarları */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-4 uppercase">GAZETE YAZARLARI</h3>
               <div className="flex flex-col gap-2">
                  {[
                    { name: 'HabboZone Ekibi', role: 'Baş Editör', avatar: 'H' },
                    { name: '.Amora', role: 'Yazar', avatar: 'https://www.habbo.com.tr/habbo-imaging/avatarimage?user=Amora&direction=2&head_direction=2&action=&gesture=sml&size=s' },
                    { name: 'RetroCan', role: 'Yazar', avatar: 'https://www.habbo.com.tr/habbo-imaging/avatarimage?user=RetroCan&direction=2&head_direction=2&action=&gesture=sml&size=s' },
                    { name: 'LegendPanda', role: 'Yazar', avatar: 'https://www.habbo.com.tr/habbo-imaging/avatarimage?user=LegendPanda&direction=2&head_direction=2&action=&gesture=sml&size=s' },
                  ].map((author, i) => (
                    <Link key={i} href="#" className="flex items-center gap-3 p-2 hover:bg-[#1e293b] rounded-[4px] transition-colors group">
                       <div className="w-9 h-9 bg-[#1e293b] border border-[#2b3548] rounded-full overflow-hidden flex items-center justify-center shrink-0">
                          {author.avatar === 'H' ? (
                            <span className="text-[#facc15] font-black text-[14px]">H</span>
                          ) : (
                            <img src={author.avatar} alt={author.name} className="pixelated drop-shadow-md" />
                          )}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-gray-200 font-bold text-[13px] group-hover:text-white">{author.name}</span>
                          <span className="text-gray-500 text-[11px] font-medium">{author.role}</span>
                       </div>
                    </Link>
                  ))}
               </div>
               <Link href="/magazines/authors" className="mt-4 bg-[#1e293b] hover:bg-[#2b3548] text-gray-300 hover:text-white text-[11px] font-bold py-2 rounded-[4px] flex items-center justify-center gap-2 transition-colors uppercase">
                 TÜM YAZARLAR <Users size={14} />
               </Link>
            </div>

            {/* Banner Ad */}
            <div className="bg-[#1e293b] border-2 border-[#2b3548] rounded-[6px] overflow-hidden flex flex-col relative shadow-lg group cursor-pointer">
               <div className="absolute inset-0 bg-cover bg-center pixelated opacity-50 group-hover:opacity-60 transition-opacity" style={{ backgroundImage: 'url("/landing-bg.jpg")' }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/80 to-transparent"></div>
               
               <div className="relative z-10 p-5 flex flex-col items-center text-center">
                  <h3 className="text-[#facc15] font-black text-[20px] leading-tight mb-1" style={{ textShadow: '2px 2px 0 #000' }}>HABBOZONE</h3>
                  <h3 className="text-white font-black text-[22px] leading-tight mb-2" style={{ textShadow: '2px 2px 0 #000' }}>MAĞAZA</h3>
                  <p className="text-gray-200 text-[11px] font-bold mb-4 uppercase" style={{ textShadow: '1px 1px 0 #000' }}>
                    EN YENİ FURNİLER<br/>EN UYGUN FİYATLAR!
                  </p>
                  <button className="bg-[#facc15] hover:bg-[#eab308] text-black font-black text-[11px] px-4 py-2 rounded-[4px] shadow-[0_3px_0_#a16207] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider">
                     ALIŞVERİŞE BAŞLA
                  </button>
               </div>
               
               <img src="https://images.habbo.com/c_images/reception/reception_backdrop_6.png" className="absolute -right-10 -bottom-4 h-[120px] pixelated drop-shadow-2xl z-0 pointer-events-none opacity-80" alt="" />
            </div>

         </div>

      </div>
    </div>
  );
}

