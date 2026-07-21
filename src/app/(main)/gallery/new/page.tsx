'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Save, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewGallerySubmissionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      if (!user) {
        throw new Error('Görsel yükleyebilmek için giriş yapmalısınız.');
      }

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `submissions/${user.id}/${fileName}`;

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
          description,
          image_url: publicUrl,
          author_id: user.id,
          // Not: Supabase veritabanında "is_approved" sütunu varsayılan olarak false kabul edilmelidir.
        });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex p-4 bg-green-500/20 text-green-500 rounded-full mb-4">
          <CheckCircle size={64} />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          Başarıyla Gönderildi!
        </h2>
        <p className="text-xl text-white/70">
          Görseliniz admin onayına sunuldu. Onaylandıktan sonra galeride yerini alacaktır.
        </p>
        <div className="pt-8 flex justify-center gap-4">
          <Link href="/gallery" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors">
            Galeriye Dön
          </Link>
          <button 
            onClick={() => {
              setSuccess(false);
              setTitle('');
              setDescription('');
              setImageFile(null);
            }} 
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold pixel-borders hover:bg-primary/90 transition-colors"
          >
            Yeni Görsel Gönder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-12 px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/gallery" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Görsel Gönder</h2>
          <p className="text-white/60">HabboZone galerisinde yer almak için görselini bizimle paylaş.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl font-bold animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Görsel Başlığı</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
              placeholder="Örn: 2026 Yılbaşı Partisi"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Açıklama (İsteğe Bağlı)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Görselle ilgili eklemek istedikleriniz..."
              maxLength={500}
            />
          </div>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={20} className="text-primary"/> Dosya Seç
          </h3>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-xl border-2 border-dashed border-primary/30 group-hover:border-primary/60 transition-colors pointer-events-none" />
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-white/60 p-8 cursor-pointer
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/80 transition-colors z-10 relative"
            />
          </div>
          {imageFile && (
            <div className="mt-4 text-sm text-green-400 flex items-center gap-2">
              <CheckCircle size={16} /> {imageFile.name} seçildi.
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 text-lg shadow-xl shadow-primary/20 group hover:-translate-y-1"
        >
          {loading ? (
            <span className="animate-pulse">Yükleniyor...</span>
          ) : (
            <>
              <Save size={24} className="group-hover:scale-110 transition-transform" /> 
              Onaya Gönder
            </>
          )}
        </button>
      </form>
    </div>
  );
}
