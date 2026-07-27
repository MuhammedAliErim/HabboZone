'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { Send, LogIn, Loader2 } from 'lucide-react';

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
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-[2px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center mx-auto">
          <LogIn size={24} className="text-[#3b82f6]" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-wider text-[#facc15]">TARTIŞMAYA KATIL & FİKİRLERİNİ PAYLAŞ</h3>
          <p className="text-gray-300 text-xs mt-1 max-w-md mx-auto font-medium">Bu konuya cevap yazabilmek, oy kullanabilmek ve nadire ödülleri kazanabilmek için üye girişi yapman gerekiyor.</p>
        </div>
        <button 
          onClick={() => router.push('/login')} 
          className="bg-[#2563eb] hover:bg-[#1d4ed8] border border-[#3b82f6] text-white px-6 py-3 rounded-[3px] font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-md"
        >
          <LogIn size={16} /> HEMEN GİRİŞ YAP VEYA KAYIT OL
        </button>
      </div>
    );
  }

  return (
    <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 space-y-4">
      <div className="bg-[#050a14] border-b border-[#1e293b] -mx-6 -mt-6 p-4 mb-4 flex items-center justify-between">
        <h3 className="text-xs font-black text-[#facc15] uppercase tracking-wider flex items-center gap-2">
          💬 CEVAP YAZ
        </h3>
        <span className="text-[10px] font-black text-gray-400 uppercase">HabboZone Kurallarına Uyunuz</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#050a14] border border-[#1e293b] rounded-[2px] overflow-hidden">
          <TipTapEditor content={content} onChange={setContent} />
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] font-bold text-gray-400">
            * Düşüncelerini özgürce ve saygı çerçevesinde paylaş.
          </span>
          <button 
            type="submit" 
            disabled={loading || content.length < 10}
            className="bg-[#22c55e] hover:bg-[#16a34a] border border-[#16a34a] text-black px-6 py-3 rounded-[3px] font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? 'GÖNDERİLİYOR...' : 'CEVABI YAYINLA'}
          </button>
        </div>
      </form>
    </div>
  );
}
