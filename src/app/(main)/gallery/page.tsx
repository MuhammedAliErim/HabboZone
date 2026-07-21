import { createClient } from '@/utils/supabase/server';
import { Image as ImageIcon } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: images } = await supabase
    .from('gallery')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-900/40 to-orange-900/40 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <ImageIcon size={200} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)]" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Topluluk Galerisi
          </h1>
          <p className="text-lg text-white/70 font-medium">
            HabboZone topluluğunun en unutulmaz anları, etkinlik kareleri ve nostaljik fotoğrafları.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images?.map((img) => (
          <div key={img.id} className="break-inside-avoid bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all hover:border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.image_url} alt={img.title} className="w-full h-auto object-cover" />
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 leading-tight">{img.title}</h3>
              <div className="flex justify-between items-center text-xs font-bold text-white/50 uppercase tracking-wider">
                <span>{new Date(img.created_at).toLocaleDateString('tr-TR')}</span>
                {img.profiles && <span className="text-primary">@{img.profiles.username}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {images?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <ImageIcon size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Galeri Boş</h3>
          <p className="text-white/50">Henüz galeriye görsel eklenmemiş.</p>
        </div>
      )}

    </div>
  );
}

