'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewGalleryImagePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Lütfen bir görsel seçin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum bulunamadı.');

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('gallery')
        .insert({
          title,
          image_url: publicUrl,
          author_id: user.id
        });

      if (insertError) throw insertError;

      router.push('/admin/gallery');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/gallery" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Yeni Görsel</h2>
          <p className="text-white/60">Topluluk galerisine yeni bir anı ekleyin.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Görsel Başlığı</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="Örn: 2026 Yılbaşı Partisi"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={20}/> Dosya Yükle</h3>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-white/60
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/80 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest pixel-borders hover:bg-primary/90 transition-colors disabled:opacity-50 text-lg shadow-xl shadow-primary/20"
        >
          {loading ? 'Yükleniyor...' : <><Save size={24} /> Görseli Kaydet</>}
        </button>
      </form>
    </div>
  );
}
