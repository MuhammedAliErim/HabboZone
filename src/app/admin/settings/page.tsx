'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    maintenance_mode: false,
    discord_url: '',
    instagram_url: '',
    x_url: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [currentLogo, setCurrentLogo] = useState('');
  const [currentFavicon, setCurrentFavicon] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'site_config')
      .single();

    if (data) {
      setFormData({
        site_name: data.site_name || '',
        site_description: data.site_description || '',
        maintenance_mode: data.maintenance_mode || false,
        discord_url: data.discord_url || '',
        instagram_url: data.instagram_url || '',
        x_url: data.x_url || '',
      });
      setCurrentLogo(data.logo_url || '');
      setCurrentFavicon(data.favicon_url || '');
    }
    setLoading(false);
  };

  const uploadImage = async (file: File, pathPrefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}_${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('settings')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('settings')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let finalLogoUrl = currentLogo;
      let finalFaviconUrl = currentFavicon;

      if (logoFile) {
        finalLogoUrl = await uploadImage(logoFile, 'logo');
      }
      
      if (faviconFile) {
        finalFaviconUrl = await uploadImage(faviconFile, 'favicon');
      }

      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'site_config',
          ...formData,
          logo_url: finalLogoUrl,
          favicon_url: finalFaviconUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
      setCurrentLogo(finalLogoUrl);
      setCurrentFavicon(finalFaviconUrl);
      setLogoFile(null);
      setFaviconFile(null);
      
      router.refresh();
      
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin text-4xl text-primary">⚙</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-primary/20 text-primary rounded-2xl">
          <Settings size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Site Ayarları</h1>
          <p className="text-white/60">HabboZone genel yapılandırmasını yönetin.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-bold border ${message.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Temel Bilgiler */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-white/10 pb-4">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Site Adı</label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({...formData, site_name: e.target.value})}
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Site Açıklaması (SEO)</label>
              <textarea
                value={formData.site_description}
                onChange={(e) => setFormData({...formData, site_description: e.target.value})}
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/10">
              <input
                type="checkbox"
                id="maintenance"
                checked={formData.maintenance_mode}
                onChange={(e) => setFormData({...formData, maintenance_mode: e.target.checked})}
                className="w-5 h-5 accent-primary"
              />
              <label htmlFor="maintenance" className="font-bold cursor-pointer">Bakım Modunu Aktifleştir</label>
            </div>
          </div>
        </div>

        {/* Görseller */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-white/10 pb-4">Görseller</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold opacity-80 uppercase">Logo (PNG/SVG)</label>
              <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-4 min-h-[150px]">
                {currentLogo && !logoFile && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={currentLogo} alt="Current Logo" className="h-12 object-contain" />
                )}
                {logoFile && <span className="text-sm text-primary font-bold">Yeni dosya seçildi</span>}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold opacity-80 uppercase">Favicon (ICO/PNG)</label>
              <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-4 min-h-[150px]">
                {currentFavicon && !faviconFile && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={currentFavicon} alt="Current Favicon" className="w-12 h-12 object-contain" />
                )}
                {faviconFile && <span className="text-sm text-primary font-bold">Yeni dosya seçildi</span>}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-white/10 pb-4">Sosyal Medya Linkleri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Discord</label>
              <input
                type="url"
                value={formData.discord_url}
                onChange={(e) => setFormData({...formData, discord_url: e.target.value})}
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="https://discord.gg/..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Instagram</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80 uppercase">X (Twitter)</label>
              <input
                type="url"
                value={formData.x_url}
                onChange={(e) => setFormData({...formData, x_url: e.target.value})}
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="https://x.com/..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 pixel-borders shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : <><Save size={24} /> Ayarları Kaydet</>}
        </button>
      </form>
    </div>
  );
}
