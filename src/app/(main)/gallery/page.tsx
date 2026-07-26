import { createClient } from '@/utils/supabase/server';
import { Image as ImageIcon, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import GalleryUploadModal from '@/components/gallery/GalleryUploadModal';

export const revalidate = 60; // Cache for 60 seconds

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: images } = await supabase
    .from('gallery')
    .select('*, profiles(username)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box overflow-hidden relative text-center border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header flex items-center justify-between" style={{backgroundColor: '#ea580c', borderBottomColor: '#c2410c'}}>
          <span className="flex items-center gap-2"><Camera size={18} /> Topluluk Fotoğraf & Anı Galerisi</span>
          {user && (
            <GalleryUploadModal />
          )}
        </div>
        
        <div className="p-8 md:p-14 bg-gradient-to-br from-[#0a1224] via-[#111827] to-[#070c18] flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <ImageIcon size={260} className="text-orange-500" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-4 py-1.5 rounded-full text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles size={14} className="animate-spin text-yellow-400" style={{ animationDuration: '4s' }} /> Nostalji & Oda Fotoğrafları
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Fotoğraf Galerisi
                </h1>
                <p className="text-sm md:text-base text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
                    HabboZone topluluğunun en unutulmaz anları, heyecan dolu etkinlik kareleri, efsanevi oda tasarımları ve nostaljik hatıraları. Sen de kendi ekran görüntünü paylaş!
                </p>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="habbo-box overflow-hidden border-2 border-white/10 shadow-2xl">
        <div className="habbo-box-header dark flex items-center justify-between">
          <span className="flex items-center gap-2"><ImageIcon size={16} className="text-orange-400" /> Onaylanmış Topluluk Kareleri ({images?.length || 0})</span>
          <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2.5 py-0.5 rounded font-black uppercase tracking-widest">Canlı Akış</span>
        </div>

        <div className="p-6 bg-[#070c18]/90">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images?.map((img) => (
                <div key={img.id} className="break-inside-avoid bg-[#0a1325]/80 border border-white/10 rounded-2xl p-4 hover:border-orange-500/60 hover:bg-[#0f1d38] transition-all duration-300 shadow-xl group hover:-translate-y-1">
                <div className="rounded-xl overflow-hidden border border-white/10 mb-3 shadow-inner relative group-hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt={img.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 relative z-0" />
                </div>
                
                <h3 className="font-bold text-sm mb-3 text-white group-hover:text-orange-400 transition-colors">{img.title}</h3>
                
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-[#050b14]/80 p-2.5 rounded-xl border border-white/5 shadow-inner">
                    <span>{new Date(img.created_at).toLocaleDateString('tr-TR')}</span>
                    {img.profiles && (
                        <Link href={`/profile/${img.profiles.username}`} className="text-orange-400 hover:text-white transition-colors flex items-center gap-1 bg-orange-950/60 px-2 py-1 rounded-lg border border-orange-500/30">
                            @{img.profiles.username}
                        </Link>
                    )}
                </div>
                </div>
            ))}
            </div>

            {images?.length === 0 && (
            <div className="text-center py-16 bg-[#0a1325]/60 border border-white/10 rounded-2xl shadow-xl">
                <ImageIcon size={48} className="mx-auto text-orange-500/50 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Galeri Boş</h3>
                <p className="text-xs text-gray-400">Henüz galeriye görsel eklenmemiş veya onay bekliyor.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
}

