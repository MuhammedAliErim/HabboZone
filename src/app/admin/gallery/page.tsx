'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setImages(data || []);
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görseli galeriden silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase.from('gallery').delete().eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setImages(images.filter((img) => img.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 text-primary rounded-2xl">
            <ImageIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Galeri</h1>
            <p className="text-white/60">Topluluk galerisine görsel ekleyin ve yönetin.</p>
          </div>
        </div>
        <Link
          href="/admin/gallery/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} /> Yeni Görsel
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg mb-8 font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-4xl text-primary">⚙</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/10">
              Galeri henüz boş.
            </div>
          ) : (
            images.map((img) => (
              <div key={img.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group relative">
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>

                <div className="aspect-video w-full bg-black/40 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{img.title}</h3>
                  <div className="text-sm text-white/50 flex justify-between">
                    <span>{new Date(img.created_at).toLocaleDateString('tr-TR')}</span>
                    {img.profiles && <span>@{img.profiles.username}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
