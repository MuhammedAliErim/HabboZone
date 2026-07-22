import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Settings, User, MessageSquare, Save } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/');
  }

  async function updateProfile(formData: FormData) {
    'use server';
    
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) return;

    const username = formData.get('username') as string;
    const habbo_username = formData.get('habbo_username') as string;
    const motto = formData.get('motto') as string;

    await supabaseServer
      .from('profiles')
      .update({
        username,
        habbo_username,
        motto,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    revalidatePath('/settings');
    revalidatePath(`/profile/${username}`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-4 bg-primary/20 rounded-2xl text-primary">
          <Settings size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Profil Ayarları
          </h1>
          <p className="text-white/50 font-medium mt-1">
            Hesap bilgilerinizi ve Habbo karakterinizi buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sol Sütun: Avatar Önizleme */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
            <h3 className="font-bold uppercase tracking-wider text-white/70 mb-4">Mevcut Karakterin</h3>
            
            <div className="h-48 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 mb-4 relative overflow-hidden group">
              <HabboAvatar 
                username={profile.habbo_username} 
                direction={4} 
                headDirection={4} 
                size="l"
                action="wlk"
                className="w-24 h-48 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            
            <p className="text-sm text-white/50">
              Gerçek Habbo.com.tr hesabını bağlayarak karakterini sitede sergileyebilirsin.
            </p>
          </div>
        </div>

        {/* Sağ Sütun: Form */}
        <div className="md:col-span-2">
          <form action={updateProfile} className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/70 mb-2">
                  <User size={16} /> Site Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={profile.username}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/70 mb-2">
                  <HabboAvatar username="Habbo" size="m" className="w-4 h-4 overflow-hidden" /> Habbo Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="habbo_username"
                  defaultValue={profile.habbo_username || ''}
                  placeholder="Gerçek Habbo adın..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/70 mb-2">
                  <MessageSquare size={16} /> Motto (Söz)
                </label>
                <input
                  type="text"
                  name="motto"
                  defaultValue={profile.motto || ''}
                  placeholder="Kısa bir biyografi veya motto..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
            >
              <Save size={20} /> Değişiklikleri Kaydet
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
