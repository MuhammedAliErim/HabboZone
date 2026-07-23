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

  const { data: magazines } = await supabase
    .from('magazines')
    .select('*')
    .eq('is_active', true)
    .lte('published_at', new Date().toISOString())
    .order('issue_number', { ascending: false });

  const latestMagazine = magazines?.[0];

  return (
    <div className="w-full bg-[#0a0f18] min-h-screen text-white font-sans py-8">
      
      {/* Breadcrumb */}
      <div className="max-w-[1300px] mx-auto px-4 flex items-center gap-2 text-gray-400 text-[12px] font-medium mb-6">
         <Link href="/" className="hover:text-white flex items-center"><Newspaper size={14} className="mr-1"/> Ana Sayfa</Link>
         <ChevronRight size={12} />
         <span className="text-white">Gazete/Dergi Arşivi</span>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 flex flex-col xl:flex-row gap-6">
         
         {/* ======================= LEFT SIDEBAR ======================= */}
         <div className="w-full xl:w-[260px] shrink-0 flex flex-col gap-6">
            
            {/* Gazete Kategorileri */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-4 uppercase">GAZETE KATEGORİLERİ</h3>
               <div className="flex flex-col gap-1">
                  {[
                    { label: 'Tümü', count: magazines?.length || 0, icon: List, color: 'text-yellow-400' },
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

         </div>


         {/* ======================= CENTER CONTENT ======================= */}
         <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {latestMagazine ? (
              <>
                {/* Hero Banner */}
                <div className="w-full h-[200px] rounded-[6px] border-2 border-[#1e293b] relative overflow-hidden shadow-xl flex flex-col items-center justify-center">
                   <div className="absolute inset-0 bg-cover bg-center pixelated opacity-70" style={{ backgroundImage: `url(${latestMagazine.cover_image_url || "/landing-bg.jpg"})` }}></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] to-transparent"></div>
                   <div className="absolute inset-0 bg-[#000000]/30"></div>
                   
                   <div className="relative z-10 flex flex-col items-center text-center">
                      <h1 className="text-[36px] md:text-[48px] font-black text-[#facc15] leading-none tracking-tighter" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 0 #854d0e' }}>
                         HABBOZONE
                      </h1>
                      <h1 className="text-[32px] md:text-[44px] font-black text-white leading-none tracking-tighter mb-2" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 0 #475569' }}>
                         GAZETESİ
                      </h1>
                      <span className="text-white font-bold text-[13px] md:text-[15px] tracking-[0.2em] bg-black/60 px-4 py-1 rounded-[4px] backdrop-blur-sm border border-white/10 mt-2 uppercase">
                         #{latestMagazine.issue_number} SAYI - {new Date(latestMagazine.published_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                      </span>
                   </div>
                </div>

                {/* Latest Featured Article */}
                <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col md:flex-row gap-6 shadow-lg group">
                   <div className="w-full md:w-[30%] h-[240px] rounded-[4px] border border-[#2b3548] relative overflow-hidden shrink-0">
                      <img src={latestMagazine.cover_image_url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500" alt="" />
                   </div>
                   <div className="flex flex-col flex-1 justify-center py-2">
                      <span className="bg-[#6b21a8] text-white font-black text-[10px] px-2 py-0.5 rounded-[3px] uppercase tracking-wider w-max mb-3">YENİ SAYI YAYINDA</span>
                      <h2 className="text-white font-black text-[22px] leading-tight mb-4 group-hover:text-[#a78bfa] transition-colors">
                         {latestMagazine.title}
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-[11px] font-bold mb-4 border-b border-[#1e293b] pb-4">
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-[#1e293b] rounded-full flex items-center justify-center text-[#facc15] font-black text-[10px]">H</div>
                            <span className="text-gray-200">HabboZone Ekibi</span>
                         </div>
                         <div className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(latestMagazine.published_at).toLocaleDateString('tr-TR')}</div>
                      </div>

                      <p className="text-gray-300 text-[13px] leading-relaxed mb-6 line-clamp-3">
                         HabboZone gazetesinin en yeni sayısı çıktı! İçeriği okumak ve indirmek için aşağıdaki butonu kullanabilirsiniz.
                      </p>

                      <div className="flex items-center gap-4">
                         <a href={latestMagazine.pdf_url} target="_blank" rel="noreferrer" className="bg-[#4c1d95] hover:bg-[#6b21a8] text-white font-bold text-[12px] px-5 py-2.5 rounded-[4px] w-max flex items-center gap-2 transition-colors uppercase tracking-wider">
                            PDF OLARAK OKU <ExternalLink size={14} />
                         </a>
                      </div>
                   </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-[#131b28] border-2 border-[#1e293b] rounded-[6px]">
                <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                <h2 className="text-xl font-bold text-gray-400">Henüz yayınlanmış bir dergi/gazete bulunmuyor.</h2>
              </div>
            )}

            {/* Grid Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {magazines && magazines.slice(1).map((post) => (
                  <div key={post.id} className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-3 flex flex-col gap-3 group hover:border-[#4c1d95] hover:shadow-[0_0_15px_rgba(76,29,149,0.3)] transition-all">
                     <div className="w-full h-[180px] bg-[#0a0f18] rounded-[4px] border border-[#2b3548] relative overflow-hidden">
                        <img src={post.cover_image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500" alt="" />
                        <span className={`absolute top-2 left-2 bg-[#3b82f6] text-white text-[9px] font-black px-2 py-0.5 rounded-[3px] uppercase shadow-md`}>SAYI #{post.issue_number}</span>
                     </div>
                     <div className="flex flex-col flex-1">
                        <h3 className="text-white font-bold text-[15px] leading-tight group-hover:text-[#a78bfa] transition-colors mb-2">{post.title}</h3>
                        <div className="flex justify-between items-center text-[#6b7280] text-[11px] font-bold border-t border-[#1e293b] pt-2 mt-auto">
                           <span>{new Date(post.published_at).toLocaleDateString('tr-TR')}</span>
                           <a href={post.pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300">
                              <ExternalLink size={12} />
                              <span>OKU</span>
                           </a>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

         </div>


         {/* ======================= RIGHT SIDEBAR ======================= */}
         <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
            
            {/* Son Gazete Sayıları */}
            <div className="bg-[#131b28] border-2 border-[#1e293b] rounded-[6px] p-4 flex flex-col shadow-lg">
               <h3 className="text-[#a78bfa] font-black text-[12px] tracking-wider mb-4 uppercase">TÜM SAYILAR</h3>
               <div className="flex flex-col gap-3 h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {magazines && magazines.map((issue) => (
                    <a key={issue.id} href={issue.pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 hover:bg-[#1e293b] border border-transparent hover:border-[#2b3548] rounded-[4px] transition-colors group">
                       <div className="w-[45px] h-[60px] bg-[#d1d5db] border border-black shadow-[2px_2px_0_rgba(0,0,0,0.5)] flex flex-col overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          <img src={issue.cover_image_url} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="flex flex-col justify-center">
                          <span className="text-gray-200 font-bold text-[13px] group-hover:text-white">#{issue.issue_number} - {new Date(issue.published_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric'})}</span>
                          <span className="text-gray-500 text-[11px] font-medium">{new Date(issue.published_at).toLocaleDateString('tr-TR')}</span>
                       </div>
                    </a>
                  ))}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
