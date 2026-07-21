'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
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

  const handleApprove = async (id: string, isApproved: boolean) => {
    const { error } = await supabase.from('gallery').update({ is_approved: isApproved }).eq('id', id);
    if (error) {
      alert(error.message);
    } else {
      setImages(images.map((img) => img.id === id ? { ...img, is_approved: isApproved } : img));
    }
  };

  const pendingImages = images.filter((img) => img.is_approved === false);
  const approvedImages = images.filter((img) => img.is_approved !== false); // treating null/undefined as true for backwards compatibility if table just altered

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 text-primary rounded-2xl">
            <ImageIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-1">Galeri Yönetimi</h1>
            <p className="text-white/60">Kullanıcı gönderilerini onaylayın veya silin.</p>
          </div>
        </div>
        <Link
          href="/admin/gallery/new"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider pixel-borders hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} /> Yeni Ekle
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-4xl text-primary">⚙</div>
        </div>
      ) : (
        <>
          {/* Pending Submissions */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-white/10 pb-2 text-[#FF9800]">
              Onay Bekleyenler ({pendingImages.length})
            </h2>
            {pendingImages.length === 0 ? (
              <div className="text-white/40 bg-white/5 rounded-2xl p-6 border border-white/10">
                Onay bekleyen görsel bulunmuyor.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingImages.map((img) => (
                  <div key={img.id} className="bg-white/5 border border-[#FF9800]/30 rounded-2xl overflow-hidden group relative">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <button 
                        onClick={() => handleApprove(img.id, true)}
                        className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
                        title="Onayla"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(img.id)}
                        className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
                        title="Reddet (Sil)"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="aspect-video w-full bg-black/40 relative">
                      <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 truncate">{img.title}</h3>
                      {img.description && <p className="text-xs text-white/70 mb-2 truncate">{img.description}</p>}
                      <div className="text-sm text-white/50 flex justify-between">
                        <span>{new Date(img.created_at).toLocaleDateString('tr-TR')}</span>
                        {img.profiles && <span>@{img.profiles.username}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Approved Images */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-white/10 pb-2">
              Onaylanmış Görseller ({approvedImages.length})
            </h2>
            {approvedImages.length === 0 ? (
              <div className="text-white/40 bg-white/5 rounded-2xl p-6 border border-white/10">
                Galeri henüz boş.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedImages.map((img) => (
                  <div key={img.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group relative">
                    <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleApprove(img.id, false)}
                        className="p-2 bg-orange-500 text-white rounded-lg hover:scale-110 transition-transform"
                        title="Onayı Kaldır"
                      >
                        <XCircle size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(img.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="aspect-video w-full bg-black/40 relative">
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
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
