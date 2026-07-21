'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Save, FileText, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewMagazinePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [readLink, setReadLink] = useState('');
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile) {
      setError('Lütfen bir kapak görseli seçin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload Cover Image
      const coverExt = coverFile.name.split('.').pop();
      const coverFileName = `cover_${Math.random()}.${coverExt}`;
      const { error: coverUploadError } = await supabase.storage.from('magazines').upload(coverFileName, coverFile);
      if (coverUploadError) throw coverUploadError;
      const { data: { publicUrl: coverUrl } } = supabase.storage.from('magazines').getPublicUrl(coverFileName);

      // 2. Upload PDF (optional)
      let finalPdfUrl = '';
      if (pdfFile) {
        const pdfExt = pdfFile.name.split('.').pop();
        const pdfFileName = `pdf_${Math.random()}.${pdfExt}`;
        const { error: pdfUploadError } = await supabase.storage.from('magazines').upload(pdfFileName, pdfFile);
        if (pdfUploadError) throw pdfUploadError;
        const { data: { publicUrl: pdfUrl } } = supabase.storage.from('magazines').getPublicUrl(pdfFileName);
        finalPdfUrl = pdfUrl;
      }

      // 3. Insert Database Record
      const { error: insertError } = await supabase
        .from('magazines')
        .insert({
          title,
          issue_number: issueNumber ? parseInt(issueNumber) : null,
          cover_image_url: coverUrl,
          pdf_url: finalPdfUrl || null,
          read_link: readLink || null
        });

      if (insertError) throw insertError;

      router.push('/admin/magazines');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/magazines" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Yeni Dergi / Yayın</h2>
          <p className="text-white/60">Sisteme yeni bir dergi sayısı veya bülten ekleyin.</p>
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
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Başlık</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="Örn: HabboZone Mayıs Sayısı"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Sayı No (Opsiyonel)</label>
              <input
                type="number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="Örn: 12"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Okuma Linki (Opsiyonel)</label>
              <input
                type="url"
                value={readLink}
                onChange={(e) => setReadLink(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={20}/> Kapak (Zorunlu)</h3>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-white/60
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/80 transition-colors"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><FileText size={20}/> PDF (Opsiyonel)</h3>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-white/60
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-600 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest pixel-borders hover:bg-primary/90 transition-colors disabled:opacity-50 text-lg shadow-xl shadow-primary/20"
        >
          {loading ? 'Yükleniyor...' : <><Save size={24} /> Dergiyi Kaydet</>}
        </button>
      </form>
    </div>
  );
}
