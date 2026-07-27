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
      <div className="max-w-xl mx-auto py-16 px-4 animate-in fade-in zoom-in duration-500">
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] p-8 text-center">
          <div className="inline-flex p-3 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e] rounded-[3px] mb-4">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-[#facc15] mb-2">
            BAŞARIYLA GÖNDERİLDİ!
          </h2>
          <p className="text-sm text-gray-300 mb-6 font-medium">
            Görseliniz admin onayına sunuldu. Onaylandıktan sonra galeride yerini alacaktır.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/gallery" className="px-5 py-2.5 bg-[#050a14] hover:bg-[#1e293b] text-white rounded-[3px] border border-[#1e293b] font-black text-xs uppercase tracking-wider transition-colors">
              Galeriye Dön
            </Link>
            <button 
              onClick={() => {
                setSuccess(false);
                setTitle('');
                setDescription('');
                setImageFile(null);
              }} 
              className="px-5 py-2.5 bg-[#2563eb] text-white rounded-[3px] border border-[#3b82f6] font-black text-xs uppercase tracking-wider hover:bg-[#1d4ed8] transition-colors"
            >
              Yeni Görsel Gönder
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-10 px-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Link href="/gallery" className="p-2 bg-[#0a1325] border border-[#1e293b] hover:border-[#3b82f6] text-gray-300 hover:text-white rounded-[3px] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-[#facc15] drop-shadow">GÖRSEL GÖNDER</h2>
          <p className="text-xs text-gray-400 font-medium">HabboZone galerisinde yer almak için görselini bizimle paylaş.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-[3px] text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] overflow-hidden">
          <div className="bg-[#050a14] border-b border-[#1e293b] px-4 py-3">
            <h3 className="text-xs font-black text-[#facc15] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={16} className="text-[#3b82f6]"/> GÖRSEL BİLGİLERİ
            </h3>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-black mb-1.5 text-gray-300 uppercase tracking-wider">Görsel Başlığı <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#3b82f6] transition-colors font-medium"
                placeholder="Örn: 2026 Yılbaşı Partisi"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-xs font-black mb-1.5 text-gray-300 uppercase tracking-wider">Açıklama (İsteğe Bağlı)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#3b82f6] transition-colors font-medium resize-none"
                placeholder="Görselle ilgili eklemek istedikleriniz..."
                maxLength={500}
              />
            </div>
          </div>
        </div>

        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] overflow-hidden">
          <div className="bg-[#050a14] border-b border-[#1e293b] px-4 py-3">
            <h3 className="text-xs font-black text-[#facc15] uppercase tracking-wider flex items-center gap-2">
              📁 DOSYA SEÇİMİ
            </h3>
          </div>
          
          <div className="p-6">
            <div className="relative group bg-[#050a14] border-2 border-dashed border-[#1e293b] hover:border-[#3b82f6] rounded-[3px] p-6 text-center transition-colors">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-gray-400 cursor-pointer
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-[2px] file:border file:border-[#3b82f6]
                  file:text-xs file:font-black file:uppercase file:tracking-wider
                  file:bg-[#2563eb] file:text-white
                  hover:file:bg-[#1d4ed8] transition-colors"
              />
            </div>
            {imageFile && (
              <div className="mt-3 text-xs text-[#22c55e] font-bold flex items-center gap-1.5">
                <CheckCircle size={14} /> {imageFile.name} seçildi.
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] border border-[#16a34a] text-black font-black uppercase tracking-widest px-6 py-3.5 rounded-[3px] transition-all disabled:opacity-50 text-sm shadow-md"
        >
          {loading ? (
            <span className="animate-pulse">YÜKLENİYOR...</span>
          ) : (
            <>
              <Save size={18} /> 
              ONAYA GÖNDER
            </>
          )}
        </button>
      </form>
    </div>
  );
}
