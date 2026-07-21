'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewBadgePage() {
  const router = useRouter();
  const supabase = createClient();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Lütfen bir rozet görseli seçin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${code}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('badges')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('badges')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('badges')
        .insert({
          code: code.toUpperCase(),
          name,
          description,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      router.push('/admin/badges');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/badges" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Yeni Rozet</h2>
          <p className="text-white/60">Sisteme yeni bir rozet tanımlayın.</p>
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
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Rozet Kodu</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors uppercase"
              placeholder="Örn: TR123"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Rozet Adı</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="Örn: Altın Kupa"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Açıklama</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={20}/> Görsel Yükle (GIF/PNG)</h3>
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
          {loading ? 'Kaydediliyor...' : <><Save size={24} /> Rozeti Kaydet</>}
        </button>
      </form>
    </div>
  );
}
