'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

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
      setError('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
      setLoading(false);
      return;
    }

    // Başarılı giriş sonrası yönlendirme
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full bg-white/10 dark:bg-black/40 backdrop-blur-xl p-8 rounded-3xl border-4 border-white/20 shadow-2xl relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-widest text-primary mb-2">
            HABBO<span className="text-black dark:text-white">ZONE</span>
          </Link>
          <h1 className="text-xl font-bold uppercase opacity-80">Yönetim Paneli Girişi</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg text-red-500 text-center font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase tracking-wider">E-Posta</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 dark:bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="admin@habbozone.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 opacity-80 uppercase tracking-wider">Şifre</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 dark:bg-black/20 border-2 border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-lg pixel-borders hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin text-xl">⚙</span> Giriş Yapılıyor...
              </>
            ) : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm opacity-60">
          <p>Yalnızca yetkili hesaplar giriş yapabilir.</p>
        </div>
      </div>
    </div>
  );
}
