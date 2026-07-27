import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { 
  Calendar, ChevronRight, 
  Newspaper, BookOpen, ExternalLink, Lock, List
} from 'lucide-react';
import Countdown from '@/components/Countdown';

export const revalidate = 60;

function formatDeterministicDate(dateString: string, includeTime = false) {
  if (!dateString) return '26.07.2026';
  try {
    const d = new Date(dateString);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const month = monthNames[d.getUTCMonth()] || 'Temmuz';
    const year = d.getUTCFullYear();
    if (includeTime) {
      const hours = String(d.getUTCHours()).padStart(2, '0');
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }
    return `${day} ${month} ${year}`;
  } catch {
    return '26.07.2026';
  }
}

export default async function MagazinesPage() {
  const supabase = await createClient();

  // Fetch all active magazines, even those scheduled for the future
  const { data: magazines } = await supabase
    .from('magazines')
    .select('*')
    .or('is_published.eq.true,is_ai_generated.eq.false,is_ai_generated.is.null')
    .order('issue_number', { ascending: false });

  const latestMagazine = magazines?.[0];
  
  // Calculate locked status based on server time initially
  const isLatestLocked = latestMagazine && new Date(latestMagazine.published_at).getTime() > Date.now();

  return (
    <div className="w-full bg-[#050a14] min-h-screen text-white font-sans py-8">
      
      {/* Breadcrumb */}
      <div className="max-w-[1300px] mx-auto px-4 flex items-center gap-2 text-gray-400 text-[11px] font-bold mb-6 uppercase tracking-wider">
         <Link href="/" className="hover:text-white flex items-center"><Newspaper size={14} className="mr-1 text-[#facc15]"/> Ana Sayfa</Link>
         <ChevronRight size={12} />
         <span className="text-white">Gazete / Dergi Arşivi</span>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 flex flex-col xl:flex-row gap-6">
         
         {/* ======================= LEFT SIDEBAR ======================= */}
         <div className="w-full xl:w-[260px] shrink-0 flex flex-col gap-6">
            
            {/* Gazete Kategorileri */}
            <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 flex flex-col shadow">
               <h3 className="text-[#facc15] font-black text-xs tracking-wider mb-4 uppercase flex items-center gap-2 border-b border-[#1e293b] pb-2">
                 <span className="w-2 h-2 bg-[#facc15] rounded-[1px]"></span>
                 GAZETE KATEGORİLERİ
               </h3>
               <div className="flex flex-col gap-1">
                  {[
                    { label: 'Tümü', count: magazines?.length || 0, icon: List, color: 'text-[#facc15]' },
                  ].map((cat, i) => (
                    <Link key={i} href="#" className="flex justify-between items-center px-2.5 py-2 bg-[#050a14] hover:bg-[#1e293b] rounded-[2px] border border-[#1e293b] transition-colors group">
                       <div className="flex items-center gap-2">
                          <cat.icon size={14} className={`${cat.color} group-hover:scale-110 transition-transform`} />
                          <span className="text-gray-300 text-xs font-black group-hover:text-white uppercase tracking-tight">{cat.label}</span>
                       </div>
                       <span className="text-gray-400 font-bold text-[10px]">{cat.count}</span>
                    </Link>
                  ))}
               </div>
            </div>

            {/* Gazete Hakkında */}
            <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 flex flex-col shadow">
               <h3 className="text-[#facc15] font-black text-xs tracking-wider mb-3 uppercase flex items-center gap-2 border-b border-[#1e293b] pb-2">
                 <span className="w-2 h-2 bg-[#facc15] rounded-[1px]"></span>
                 GAZETE HAKKINDA
               </h3>
               <p className="text-gray-300 text-xs font-medium leading-relaxed mb-4">
                 HabboZone Gazetesi, Habbo dünyasındaki en güncel gelişmeleri, etkinlikleri ve özel içerikleri sizlere sunar.
                 <br/><br/>
                 Her hafta yeni sayılarla karşınızdayız!
               </p>
               <div className="w-full h-24 bg-[#050a14] rounded-[2px] border border-[#1e293b] overflow-hidden flex items-center justify-center relative shadow-inner">
                 <img src="https://images.habbo.com/c_images/reception/newspaper_promo.png" className="pixelated opacity-80" alt="" />
               </div>
            </div>

         </div>


         {/* ======================= CENTER CONTENT ======================= */}
         <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {latestMagazine ? (
              <>
                {/* Hero Banner */}
                <div className="w-full h-[200px] rounded-[3px] border border-[#1e293b] relative overflow-hidden shadow flex flex-col items-center justify-center bg-[#0a1325]">
                   <div className="absolute inset-0 bg-cover bg-center pixelated opacity-60" style={{ backgroundImage: `url(${latestMagazine.cover_image_url || "/landing-bg.jpg"})` }}></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-transparent"></div>
                   
                   <div className="relative z-10 flex flex-col items-center text-center">
                      <h1 className="text-[36px] md:text-[48px] font-black text-[#facc15] leading-none tracking-tighter" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 0 #000' }}>
                         HABBOZONE
                      </h1>
                      <h1 className="text-[32px] md:text-[44px] font-black text-white leading-none tracking-tighter mb-2" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 0 #000' }}>
                         GAZETESİ
                      </h1>
                      <span className="text-white font-black text-xs md:text-sm tracking-[0.2em] bg-[#050a14] px-4 py-1.5 rounded-[2px] border border-[#1e293b] mt-2 uppercase shadow">
                         #{latestMagazine.issue_number} SAYI
                      </span>
                   </div>
                </div>

                {/* Latest Featured Article */}
                <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-5 flex flex-col md:flex-row gap-6 shadow group relative overflow-hidden">
                   {isLatestLocked && (
                      <div className="absolute inset-0 z-20 bg-[#050a14]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-[#0a1325] rounded-[2px] flex items-center justify-center border border-[#facc15] shadow">
                           <Lock size={32} className="text-[#facc15]" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">BU SAYI KİLİTLİ</h2>
                        <div className="bg-[#0a1325] px-6 py-3 rounded-[3px] border border-[#1e293b] text-center">
                           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">AÇILMASINA KALAN SÜRE</p>
                           <div className="text-2xl font-black text-[#facc15]">
                             <Countdown targetDate={latestMagazine.published_at} />
                           </div>
                        </div>
                      </div>
                   )}
                   
                   <div className={`w-full md:w-[30%] h-[240px] rounded-[2px] border border-[#1e293b] relative overflow-hidden shrink-0 bg-[#050a14] ${isLatestLocked ? 'opacity-30' : ''}`}>
                      <img src={latestMagazine.cover_image_url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500" alt="" />
                   </div>
                   <div className={`flex flex-col flex-1 justify-center py-2 ${isLatestLocked ? 'opacity-30' : ''}`}>
                      <span className="bg-[#3b82f6] text-white font-black text-[10px] px-2.5 py-1 rounded-[2px] uppercase tracking-wider w-max mb-3 border border-blue-400">
                         {isLatestLocked ? 'GELECEK SAYI' : 'YENİ SAYI YAYINDA'}
                      </span>
                      <h2 className="text-white font-black text-xl leading-tight mb-4 group-hover:text-[#facc15] transition-colors uppercase tracking-tight">
                         {latestMagazine.title}
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs font-bold mb-4 border-b border-[#1e293b] pb-4">
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-[#050a14] border border-[#1e293b] rounded-[2px] flex items-center justify-center text-[#facc15] font-black text-[10px]">H</div>
                            <span className="text-gray-200">HabboZone Ekibi</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[#3b82f6]"><Calendar size={14}/> <span className="text-gray-300">{formatDeterministicDate(latestMagazine.published_at, true)}</span></div>
                      </div>

                      <p className="text-gray-300 text-xs font-medium leading-relaxed mb-6 line-clamp-3">
                         {isLatestLocked 
                           ? "Bu sayı henüz erişime açılmadı. Belirtilen tarihte geri gelerek yeni sayımızı PDF olarak okuyabilir ve indirebilirsiniz."
                           : "HabboZone gazetesinin en yeni sayısı çıktı! İçeriği okumak ve indirmek için aşağıdaki butonu kullanabilirsiniz."
                         }
                      </p>

                      <div className="flex items-center gap-4">
                         {!isLatestLocked && (
                           <Link href={`/magazines/${latestMagazine.issue_number}`} className="bg-[#2563eb] hover:bg-[#1d4ed8] border border-[#3b82f6] text-white font-black text-xs px-6 py-3 rounded-[3px] w-max flex items-center gap-2 transition-colors uppercase tracking-wider shadow">
                              DERGİYİ OKU <ExternalLink size={14} />
                           </Link>
                         )}
                      </div>
                   </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px]">
                <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
                <h2 className="text-base font-black text-gray-400 uppercase tracking-wider">Henüz yayınlanmış veya planlanmış bir dergi/gazete bulunmuyor.</h2>
              </div>
            )}

            {/* Grid Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {magazines && magazines.slice(1).map((post) => {
                  const isLocked = new Date(post.published_at).getTime() > Date.now();
                  
                  return (
                    <div key={post.id} className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-3 flex flex-col gap-3 group hover:border-[#3b82f6] transition-all relative overflow-hidden shadow">
                       
                       {isLocked && (
                          <div className="absolute inset-0 z-20 bg-[#050a14]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-[2px]">
                            <Lock size={24} className="text-[#facc15]" />
                            <div className="bg-[#0a1325] px-3 py-1.5 rounded-[2px] border border-[#1e293b] text-center">
                               <div className="text-xs font-black text-[#facc15]">
                                 <Countdown targetDate={post.published_at} />
                               </div>
                            </div>
                          </div>
                       )}

                       <div className={`w-full h-[180px] bg-[#050a14] rounded-[2px] border border-[#1e293b] relative overflow-hidden ${isLocked ? 'opacity-30' : ''}`}>
                          <img src={post.cover_image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500" alt="" />
                          <span className={`absolute top-2 left-2 ${isLocked ? 'bg-gray-700' : 'bg-[#2563eb]'} text-white text-[9px] font-black px-2 py-0.5 rounded-[2px] border border-black/30 uppercase shadow`}>SAYI #{post.issue_number}</span>
                       </div>
                       <div className={`flex flex-col flex-1 ${isLocked ? 'opacity-30' : ''}`}>
                          <h3 className="text-white font-black text-xs leading-tight group-hover:text-[#facc15] transition-colors mb-2 uppercase tracking-tight">{post.title}</h3>
                          <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold border-t border-[#1e293b] pt-2 mt-auto">
                             <span className="flex items-center gap-1"><Calendar size={12} className="text-[#3b82f6]"/> {formatDeterministicDate(post.published_at)}</span>
                             {!isLocked && (
                               <Link href={`/magazines/${post.issue_number}`} className="flex items-center gap-1 text-[#3b82f6] hover:text-[#60a5fa] font-black uppercase tracking-wider">
                                  <ExternalLink size={12} />
                                  <span>OKU</span>
                               </Link>
                             )}
                          </div>
                       </div>
                    </div>
                  )
               })}
            </div>

         </div>


         {/* ======================= RIGHT SIDEBAR ======================= */}
         <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
            
            {/* Son Gazete Sayıları */}
            <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 flex flex-col shadow">
               <h3 className="text-[#facc15] font-black text-xs tracking-wider mb-4 uppercase flex items-center gap-2 border-b border-[#1e293b] pb-2">
                 <span className="w-2 h-2 bg-[#facc15] rounded-[1px]"></span>
                 TÜM SAYILAR
               </h3>
               <div className="flex flex-col gap-2 h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {magazines && magazines.map((issue) => {
                    const isLocked = new Date(issue.published_at).getTime() > Date.now();
                    
                    return (
                      <div key={issue.id} className="relative block group">
                        {isLocked ? (
                          <div className="flex items-center gap-3 p-2 bg-[#050a14] border border-[#1e293b] rounded-[2px] transition-colors opacity-60">
                             <div className="w-[45px] h-[60px] bg-[#0a1325] border border-[#1e293b] flex flex-col overflow-hidden shrink-0 relative">
                                <img src={issue.cover_image_url} className="w-full h-full object-cover grayscale" alt="" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60"><Lock size={16} className="text-[#facc15]"/></div>
                             </div>
                             <div className="flex flex-col justify-center min-w-0">
                                <span className="text-gray-300 font-black text-xs line-clamp-1 uppercase tracking-tight">#{issue.issue_number} - {formatDeterministicDate(issue.published_at)}</span>
                                <span className="text-gray-500 text-[10px] font-bold flex items-center gap-1 text-[#facc15] mt-1"><Lock size={10}/>Kilitli</span>
                             </div>
                          </div>
                        ) : (
                          <Link href={`/magazines/${issue.issue_number}`} className="flex items-center gap-3 p-2 bg-[#050a14] hover:bg-[#1e293b] border border-[#1e293b] hover:border-[#3b82f6] rounded-[2px] transition-colors group">
                             <div className="w-[45px] h-[60px] bg-[#0a1325] border border-[#1e293b] flex flex-col overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                <img src={issue.cover_image_url} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div className="flex flex-col justify-center min-w-0">
                                <span className="text-gray-300 font-black text-xs group-hover:text-[#facc15] line-clamp-1 uppercase tracking-tight transition-colors">#{issue.issue_number} - {formatDeterministicDate(issue.published_at)}</span>
                                <span className="text-gray-500 text-[10px] font-bold mt-1">{formatDeterministicDate(issue.published_at)}</span>
                             </div>
                          </Link>
                        )}
                      </div>
                    )
                  })}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
