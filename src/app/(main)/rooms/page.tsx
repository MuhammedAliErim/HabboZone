import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Users, Plus, ArrowRight } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export const metadata = { title: 'Odalar - HabboZone', description: 'HabboZone öne çıkan odaları, labirentler ve oyun alanları.' };
export const revalidate = 60;

export default async function RoomsPage() {
  const supabase = await createClient();

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  const displayRooms = rooms || [];

  return (
    <div className="pb-16 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <section className="relative w-full h-[220px] mb-8 border-b border-[#1e293b] overflow-hidden flex flex-col justify-end p-8">
        <div 
          className="absolute inset-0 z-0 opacity-40 pixelated"
          style={{
            backgroundImage: 'url("https://images.habbo.com/c_images/reception/background_right_party_1.png")',
            backgroundPosition: 'right center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020610] to-[#020610]/10"></div>
        
        <div className="relative z-20 max-w-[1200px] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight text-shadow-sm mb-1">ODALAR</h1>
                <p className="text-[#94a3b8] text-sm font-medium">HabboZone topluluğunun en popüler odalarını keşfet!</p>
            </div>
            
            <button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-black text-xs px-6 py-3 rounded-[3px] border border-[#16a34a] transition-colors flex items-center gap-2 uppercase tracking-wider shadow-md">
                <Plus size={16} /> ODA OLUŞTUR
            </button>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1e293b] pb-4 mb-6">
            <button className="px-5 py-2 bg-[#0a1325] text-[#facc15] font-black text-xs rounded-[3px] border border-[#3b82f6] uppercase tracking-wider transition-colors shadow">
                TÜM ODALAR
            </button>
            <button className="px-5 py-2 bg-[#050a14] text-gray-400 hover:text-white font-bold text-xs rounded-[3px] border border-[#1e293b] hover:bg-[#0a1325] uppercase tracking-wider transition-colors">
                POPÜLER ODALAR
            </button>
            <button className="px-5 py-2 bg-[#050a14] text-gray-400 hover:text-white font-bold text-xs rounded-[3px] border border-[#1e293b] hover:bg-[#0a1325] uppercase tracking-wider transition-colors">
                ETKİNLİK ODALARI
            </button>
            <button className="px-5 py-2 bg-[#050a14] text-gray-400 hover:text-white font-bold text-xs rounded-[3px] border border-[#1e293b] hover:bg-[#0a1325] uppercase tracking-wider transition-colors">
                RESMİ ODALAR
            </button>
        </div>

        {/* Room List */}
        <div className="space-y-3">
            {displayRooms.length > 0 ? (
              displayRooms.map((room) => (
                  <Link href="#" key={room.id} className="habbo-box habbo-card-hover p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden">
                      
                      {/* Thumbnail */}
                      <div className="w-full sm:w-[140px] h-[90px] shrink-0 rounded-[2px] overflow-hidden relative border border-[#1e293b] bg-[#050a14]">
                          <Image src={room.image_url || 'https://images.habbo.com/c_images/reception/reception_backdrop_4.png'} alt={room.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                          <span className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded-[2px] text-[9px] font-black text-[#facc15] border border-[#1e293b] uppercase">
                            {room.category}
                          </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h3 className="text-base font-black text-white group-hover:text-[#facc15] transition-colors mb-1 line-clamp-1 uppercase tracking-tight">{room.name}</h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-2">
                              <HabboAvatar username={room.owner} size="m" headOnly direction={3} className="w-5 h-5 -mt-1" />
                              <span className="font-medium text-gray-500">Oda Sahibi:</span> <span className="font-bold text-gray-300">{room.owner}</span>
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1 font-medium">{room.description}</p>
                      </div>

                      {/* Action & Stats */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-[120px] pt-3 sm:pt-0 border-t sm:border-0 border-[#1e293b] gap-3">
                          <div className="text-xs font-black text-white flex items-center gap-1.5 bg-[#050a14] px-3 py-1.5 rounded-[2px] border border-[#1e293b]">
                              <Users size={14} className="text-[#22c55e]" />
                              {room.current_users} / {room.max_users}
                          </div>
                          <button className="bg-[#2563eb] group-hover:bg-[#1d4ed8] text-white font-black text-xs px-6 py-2 rounded-[2px] border border-[#3b82f6] transition-colors uppercase tracking-wider">
                              ODAYA GİT
                          </button>
                      </div>
                      
                  </Link>
              ))
            ) : (
              <div className="habbo-box text-center py-12 bg-[#0a1325] rounded-[3px] border border-[#1e293b]">
                <h3 className="text-gray-400 font-bold text-sm">Henüz hiç oda bulunamadı.</h3>
              </div>
            )}
        </div>

        {displayRooms.length > 0 && (
          <div className="mt-8 text-center">
              <button className="inline-flex items-center gap-1 bg-[#050a14] hover:bg-[#0a1325] text-gray-300 hover:text-white font-black text-xs px-6 py-3 rounded-[3px] border border-[#1e293b] transition-colors uppercase tracking-wider">
                  TÜM ODALARI GÖR <ArrowRight size={14} />
              </button>
          </div>
        )}

      </div>
    </div>
  );
}
