'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { LogIn, User, Lock, AlertTriangle, Key } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === 'Email not confirmed' ? 'Lütfen e-posta adresinizi doğrulayın.' : authError.message);
      setLoading(false);
      return;
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
             <Key size={28} className="text-[#3b82f6]" />
           </div>
           <h1 className="text-2xl font-black text-white drop-shadow-[0_2px_0_#000] tracking-wider uppercase">Giriş Yap</h1>
           <p className="text-[#94a3b8] text-[12px] font-bold mt-1">Hoş geldin! Lütfen bilgilerini gir.</p>
        </div>

        <div className="p-6 md:p-8 bg-[#0a1325]">
            {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-red-500 font-bold text-[12px] leading-tight">{error}</span>
            </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-[11px] font-black mb-1.5 text-gray-300 uppercase tracking-widest">E-Posta Adresin</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
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
                        placeholder="Şifren"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end -mt-2">
                <Link href="/forgot-password" className="text-[10px] text-[#3b82f6] hover:text-white transition-colors font-bold">
                    Şifremi unuttum?
                </Link>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full habbo-button success py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? 'GİRİŞ YAPILIYOR...' : <><LogIn size={18} /> GİRİŞ YAP</>}
            </button>
            </form>

            <div className="mt-6 text-center border-t border-[#1e293b] pt-6">
                <p className="text-[12px] text-gray-400 font-medium">
                    Hesabın yok mu? <Link href="/register" className="text-[#facc15] hover:underline font-bold">Hemen Kayıt Ol</Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
