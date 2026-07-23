'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { UserPlus, User, Lock, Mail, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [habboUsername, setHabboUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // 1. Register Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Wait a moment to ensure trigger creates the profile (if you have a database trigger)
    // Or manually update the profile created by the trigger.
    if (authData.user) {
        const { error: profileError } = await supabase
        .from('profiles')
        .update({ username, habbo_username: habboUsername })
        .eq('id', authData.user.id);

        if (profileError) {
            console.error(profileError);
            // Optionally set error
        }
    }

    window.location.href = '/';
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 animate-in fade-in duration-500 relative">
      <div className="absolute inset-0 bg-cover bg-center pixelated opacity-20" style={{ backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")' }}></div>
      <div className="absolute inset-0 bg-[#050a14]/80"></div>
      
      <div className="habbo-box max-w-md w-full relative z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1e293b] p-6 text-center border-b border-black">
           <div className="w-16 h-16 mx-auto bg-[#0a1325] rounded-full border-2 border-black flex items-center justify-center mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
             <UserPlus size={28} className="text-[#22c55e]" />
           </div>
           <h1 className="text-2xl font-black text-white drop-shadow-[0_2px_0_#000] tracking-wider uppercase">Kayıt Ol</h1>
           <p className="text-[#94a3b8] text-[12px] font-bold mt-1">HabboZone ailesine katılmak için formu doldur.</p>
        </div>

        <div className="p-6 md:p-8 bg-[#0a1325]">
            {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-red-500 font-bold text-[12px] leading-tight">{error}</span>
            </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
            <div>
                <label className="block text-[11px] font-black mb-1.5 text-gray-300 uppercase tracking-widest">Kullanıcı Adı</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#1e293b] text-white border-2 border-black rounded-[4px] py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-colors text-[13px] font-bold placeholder-gray-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                        placeholder="Site içi kullanıcı adın"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-[11px] font-black mb-1.5 text-gray-300 uppercase tracking-widest">Habbo Adı (Opsiyonel)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        value={habboUsername}
                        onChange={(e) => setHabboUsername(e.target.value)}
                        className="w-full bg-[#1e293b] text-white border-2 border-black rounded-[4px] py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-colors text-[13px] font-bold placeholder-gray-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                        placeholder="Oyundaki ismin"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[11px] font-black mb-1.5 text-gray-300 uppercase tracking-widest">E-Posta Adresin</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-500" />
                    </div>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#1e293b] text-white border-2 border-black rounded-[4px] py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-colors text-[13px] font-bold placeholder-gray-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                        placeholder="E-Posta adresin"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-[11px] font-black mb-1.5 text-gray-300 uppercase tracking-widest">Şifren</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-500" />
                    </div>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1e293b] text-white border-2 border-black rounded-[4px] py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-colors text-[13px] font-bold placeholder-gray-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                        placeholder="Güçlü bir şifre"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full habbo-button px-6 py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? 'KAYIT YAPILIYOR...' : <><UserPlus size={18} /> KAYIT OL</>}
            </button>
            </form>

            <div className="mt-6 text-center border-t border-[#1e293b] pt-6">
                <p className="text-[12px] text-gray-400 font-medium">
                    Zaten hesabın var mı? <Link href="/login" className="text-[#facc15] hover:underline font-bold">Giriş Yap</Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
