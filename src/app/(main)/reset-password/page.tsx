'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Key, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event !== 'PASSWORD_RECOVERY') {
        router.push('/login');
      }
    });
  }, [supabase, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="habbo-box max-w-md w-full p-8 text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
          <h1 className="text-xl font-black text-white mb-2">Şifren Başarıyla Değiştirildi</h1>
          <p className="text-gray-400 text-sm">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        <div className="habbo-box overflow-hidden bg-[#0f172a] shadow-xl">
          <div className="habbo-box-header dark p-4">
            <h1 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Key size={16} /> Yeni Şifre Belirle
            </h1>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 text-xs p-3 rounded font-bold flex items-center gap-2">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Yeni Şifre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#1e293b] border-2 border-black rounded pl-10 pr-3 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-[#3b82f6]"
                    placeholder="En az 6 karakter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Şifre Tekrar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#1e293b] border-2 border-black rounded pl-10 pr-3 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-[#3b82f6]"
                    placeholder="Şifrenizi tekrar girin"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="habbo-button success w-full py-3 flex items-center justify-center gap-2">
                {loading ? 'KAYDEDİLİYOR...' : 'ŞİFREYİ KAYDET'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
