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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 py-6">
      
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header blue">
          Profil Ayarları
        </div>
        
        <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Settings size={150} className="text-blue-600" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-2">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Hesap Bilgilerin
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                    Hesap bilgilerinizi ve Habbo karakterinizi buradan yönetebilirsiniz.
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sol Sütun: Avatar Önizleme */}
        <div className="md:col-span-1 space-y-6">
          <div className="habbo-box bg-white text-center">
            <div className="habbo-box-header green">Mevcut Karakterin</div>
            <div className="p-6 bg-gray-50 flex flex-col items-center">
                <div className="h-48 w-full flex items-center justify-center bg-white rounded border border-gray-200 mb-4 relative overflow-hidden shadow-inner group">
                <HabboAvatar 
                    username={profile.habbo_username || 'Habbo'} 
                    direction={4} 
                    headDirection={4} 
                    size="l"
                    action="wlk"
                    className="w-24 h-48 drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
                />
                </div>
                
                <p className="text-[10px] text-gray-500 font-medium bg-gray-100 p-2 rounded border border-gray-200 shadow-sm leading-tight">
                Gerçek Habbo.com.tr hesabını bağlayarak karakterini sitede sergileyebilirsin.
                </p>
            </div>
          </div>
        </div>

        {/* Sağ Sütun: Form */}
        <div className="md:col-span-2">
          <div className="habbo-box bg-white">
            <div className="habbo-box-header dark">Profili Düzenle</div>
            <div className="p-6 md:p-8 bg-gray-50">
                <form action={updateProfile} className="space-y-5">
                    
                    <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                        <User size={14} className="text-blue-500" /> Site Kullanıcı Adı
                        </label>
                        <input
                        type="text"
                        name="username"
                        defaultValue={profile.username}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-gray-800 text-sm font-bold shadow-inner focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                        <HabboAvatar username="Habbo" size="m" className="w-4 h-4 overflow-hidden -mt-2" /> Habbo Kullanıcı Adı
                        </label>
                        <input
                        type="text"
                        name="habbo_username"
                        defaultValue={profile.habbo_username || ''}
                        placeholder="Gerçek Habbo adın..."
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-gray-800 text-sm font-bold shadow-inner focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                        <MessageSquare size={14} className="text-green-500" /> Motto (Söz)
                        </label>
                        <input
                        type="text"
                        name="motto"
                        defaultValue={profile.motto || ''}
                        placeholder="Kısa bir biyografi veya motto..."
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-gray-800 text-sm font-bold shadow-inner focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    </div>

                    <div className="pt-2">
                        <button 
                        type="submit"
                        className="habbo-button green w-full flex items-center justify-center gap-2 py-3"
                        >
                        <Save size={16} /> Değişiklikleri Kaydet
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
