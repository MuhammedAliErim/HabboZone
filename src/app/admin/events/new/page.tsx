'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [rewardText, setRewardText] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate || !eventTime) {
      setError('Lütfen etkinlik tarihini ve saatini seçin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `event_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('events').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      // Combine date and time
      const combinedDateTime = new Date(`${eventDate}T${eventTime}`).toISOString();

      const { error: insertError } = await supabase
        .from('events')
        .insert({
          title,
          description,
          event_date: combinedDateTime,
          reward_text: rewardText || null,
          image_url: imageUrl,
          is_active: isActive
        });

      if (insertError) throw insertError;

      router.push('/admin/events');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/events" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Yeni Etkinlik</h2>
          <p className="text-white/60">Topluluğa yeni bir etkinlik duyurusu yapın.</p>
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
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Etkinlik Başlığı</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="Örn: Labirent Oyunu"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Açıklama (Opsiyonel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors min-h-[100px]"
              placeholder="Etkinlik kuralları, odası vs..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Tarih</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Saat</label>
              <input
                type="time"
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Ödül (Opsiyonel)</label>
            <input
              type="text"
              value={rewardText}
              onChange={(e) => setRewardText(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="Örn: 50 Kredi + Rozet"
            />
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <label htmlFor="isActive" className="font-bold cursor-pointer">Etkinlik Aktif Mi?</label>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={20}/> Görsel (Opsiyonel)</h3>
          <input
            type="file"
            accept="image/*"
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
          {loading ? 'Yükleniyor...' : <><Save size={24} /> Etkinliği Kaydet</>}
        </button>
      </form>
    </div>
  );
}
