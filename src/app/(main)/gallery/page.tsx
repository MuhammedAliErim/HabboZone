import { createClient } from '@/utils/supabase/server';
import { Image as ImageIcon } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header orange flex items-center justify-between">
          <span>Topluluk Galerisi</span>
          {user && (
            <GalleryUploadModal />
          )}
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-r from-orange-50 to-orange-100 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ImageIcon size={150} className="text-orange-600" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Fotoğraf Galerisi
                </h1>
                <p className="text-sm text-gray-600 font-medium max-w-lg mx-auto">
                    HabboZone topluluğunun en unutulmaz anları, etkinlik kareleri ve nostaljik fotoğrafları.
                </p>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="habbo-box bg-white">
        <div className="p-4 md:p-6 bg-gray-50">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images?.map((img) => (
                <div key={img.id} className="break-inside-avoid bg-white border border-gray-200 rounded p-3 hover:border-orange-300 hover:bg-orange-50 transition-colors shadow-sm group">
                <div className="rounded overflow-hidden border border-gray-200 mb-3 shadow-inner relative group-hover:shadow-md transition-shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt={img.title} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
                
                <h3 className="font-bold text-sm mb-2 text-gray-800 group-hover:text-orange-700 transition-colors">{img.title}</h3>
                
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 p-2 rounded border border-gray-200 shadow-sm">
                    <span>{new Date(img.created_at).toLocaleDateString('tr-TR')}</span>
                    {img.profiles && (
                        <Link href={`/profile/${img.profiles.username}`} className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-1 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">
                            @{img.profiles.username}
                        </Link>
                    )}
                </div>
                </div>
            ))}
            </div>

            {images?.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded">
                <ImageIcon size={48} className="mx-auto text-gray-300 mb-2" />
                <h3 className="text-sm font-bold text-gray-700 mb-1">Galeri Boş</h3>
                <p className="text-xs text-gray-500">Henüz galeriye görsel eklenmemiş.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
}
