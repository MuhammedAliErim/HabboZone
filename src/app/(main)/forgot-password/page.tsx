'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        <div className="habbo-box overflow-hidden bg-[#0f172a] shadow-xl">
          <div className="habbo-box-header dark p-4 flex items-center justify-between">
            <h1 className="text-sm font-bold text-white tracking-wide uppercase">Şifremi Unuttum</h1>
          </div>
          
          <div className="p-8 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Mail size={80} className="text-[#3b82f6]" />
            </div>

            <p className="text-[#94a3b8] text-[12px] mb-6 relative z-10 leading-relaxed">
              Hesabınıza ait e-posta adresini girin. Size şifrenizi sıfırlayabilmeniz için bir bağlantı göndereceğiz.
            </p>

            {error && (
              <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444] text-[#ef4444] text-[12px] p-3 rounded font-bold">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e] text-[12px] p-3 rounded font-bold">
                {message}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">E-Posta Adresiniz</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-500" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#1e293b] border-2 border-black rounded pl-10 pr-3 py-2.5 text-white text-[13px] font-bold focus:outline-none focus:border-[#3b82f6] transition-colors" 
                      placeholder="ornek@email.com" 
                    />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="habbo-button success w-full py-3 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? 'GÖNDERİLİYOR...' : (
                    <>
                        <Send size={16} /> SIFIRLAMA BAĞLANTISI GÖNDER
                    </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#1e293b] text-center relative z-10">
              <Link href="/login" className="text-[#3b82f6] hover:text-white text-[12px] font-bold flex items-center justify-center gap-1 transition-colors">
                <ArrowLeft size={14} /> GİRİŞ SAYFASINA DÖN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
