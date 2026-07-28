import { createClient } from '@/utils/supabase/server';
import { Image as ImageIcon, Camera } from 'lucide-react';
import Link from 'next/link';
import GalleryUploadModal from '@/components/gallery/GalleryUploadModal';

export const metadata = { title: 'Galeri - HabboZone', description: 'HabboZone topluluk galerisi — görsel ve medya arşivi.' };
export const revalidate = 60;

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: images } = await supabase
    .from('gallery')
    .select('*, profiles(username)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  const formatDeterministicDate = (dateStr?: string) => {
    if (!dateStr) return '26.07.2026';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6">
      
      {/* AUTHENTIC HABBO HERO */}
      <div className="habbo-box mb-6 p-6 bg-[#0a1325] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#ea580c] text-white px-2 py-0.5 rounded-[3px] text-[10px] font-black uppercase tracking-wider shadow-[0_2px_0_#c2410c]">TOPLULUK GALERİSİ</span>
            <span className="text-gray-300 text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-[3px]">Oda Tasarımları & Anılar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
            HABBOZONE FOTOĞRAF GALERİSİ
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-medium">
            HabboZone topluluğunun en unutulmaz anları, heyecan dolu etkinlik kareleri, efsanevi oda tasarımları ve nostaljik hatıraları. Sen de kendi ekran görüntünü paylaş!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="bg-[#050a14] border border-[#1e293b] px-6 py-4 rounded-[4px] text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Toplam Fotoğraf</div>
            <div className="text-xl font-black text-white">{images?.length || 0}</div>
          </div>
          {user && (
            <GalleryUploadModal />
          )}
        </div>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-[#1e293b] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-[#facc15]" />
          <h2 className="text-[#facc15] font-black text-sm tracking-wide uppercase">ONAYLANMIŞ TOPLULUK KARELERİ</h2>
        </div>
        <span className="text-gray-400 text-[11px] font-bold uppercase">TOPLAM {images?.length || 0} GÖRSEL</span>
      </div>

      {/* Grid */}
      <div className="habbo-box p-6 bg-[#0a1325] border border-[#1e293b]">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {images?.map((img) => (
            <div key={img.id} className="break-inside-avoid bg-[#050a14] border border-[#1e293b] rounded-[3px] p-3 hover:border-[#3b82f6] transition-all group">
              <div className="rounded-[2px] overflow-hidden border border-[#1e293b] mb-2 bg-[#0a1325] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt={img.title} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform" />
              </div>
              
              <h3 className="font-bold text-xs mb-2 text-white group-hover:text-[#facc15] transition-colors">{img.title}</h3>
              
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase bg-[#0a1325] p-2 rounded-[2px] border border-[#1e293b]">
                <span>{formatDeterministicDate(img.created_at)}</span>
                {img.profiles && (
                  <Link href={`/profile/${img.profiles.username}`} className="text-[#3b82f6] hover:text-white transition-colors bg-[#050a14] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b]">
                    @{img.profiles.username}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {(!images || images.length === 0) && (
          <div className="text-center py-12 bg-[#050a14] border border-[#1e293b] rounded-[3px]">
            <ImageIcon size={40} className="mx-auto text-gray-600 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Galeri Boş</h3>
            <p className="text-xs text-gray-400">Henüz galeriye görsel eklenmemiş veya onay bekliyor.</p>
          </div>
        )}
      </div>

    </div>
  );
}
