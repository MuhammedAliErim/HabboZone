'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { Send, LogIn, Sparkles, Loader2 } from 'lucide-react';

export default function ReplyForm({ topicId, currentUser }: { topicId: string, currentUser: any }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Cevap yazmak için giriş yapmalısın!");
      return;
    }
    if (content.length < 10) {
      alert("Cevabın çok kısa. Lütfen daha detaylı bir görüş belirtin.");
      return;
    }

    // Handle mock topic fallback id
    if (topicId.startsWith('top-')) {
      alert("Bu bir örnek önizleme konusudur. Gerçek konulara cevap gönderebilirsiniz!");
      setContent('');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('replies').insert({
      topic_id: topicId,
      author_id: currentUser.id,
      content: content
    });

    if (!error) {
      setContent('');
      router.refresh();
    } else {
      alert(error.message);
    }
    
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="bg-[#050b14] border-2 border-white/10 rounded-2xl p-10 text-center space-y-5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <LogIn size={28} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white">Tartışmaya Katıl & Fikirlerini Paylaş</h3>
          <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">Bu konuya cevap yazabilmek, oy kullanabilmek ve nadire ödülleri kazanabilmek için üye girişi yapman gerekiyor.</p>
        </div>
        <button 
          onClick={() => router.push('/login')} 
          className="habbo-button blue px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all scale-100 hover:scale-105"
        >
          <LogIn size={16} /> HEMEN GİRİŞ YAP VEYA KAYIT OL
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#050b14] border-2 border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#0a1325]/80 border border-white/10 rounded-xl overflow-hidden shadow-inner">
          <TipTapEditor content={content} onChange={setContent} />
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-bold text-gray-500">
            * Düşüncelerini özgürce ve saygı çerçevesinde paylaş.
          </span>
          <button 
            type="submit" 
            disabled={loading || content.length < 10}
            className="habbo-button success px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed scale-100 hover:scale-105 active:scale-95"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {loading ? 'GÖNDERİLİYOR...' : 'CEVABI YAYINLA'}
          </button>
        </div>
      </form>
    </div>
  );
}
