'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { Send } from 'lucide-react';

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
      alert("Cevabın çok kısa.");
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
      <div className="bg-[#050a14] border border-[#1e293b] rounded p-8 text-center space-y-4 habbo-box">
        <h3 className="text-xl font-bold uppercase tracking-widest text-white">Tartışmaya Katıl</h3>
        <p className="text-[#64748b]">Cevap yazabilmek için üye girişi yapman gerekiyor.</p>
        <button onClick={() => router.push('/login')} className="bg-[#3b82f6] text-white px-6 py-2 rounded font-bold hover:bg-[#2563eb] transition-colors border-b-4 border-[#1d4ed8]">Giriş Yap</button>
      </div>
    );
  }

  return (
    <div className="bg-[#050a14] border border-[#1e293b] rounded p-6 shadow-xl habbo-box">
      <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-white">Cevap Yaz</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TipTapEditor content={content} onChange={setContent} />
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={loading || content.length < 10}
            className="flex items-center gap-2 bg-[#22c55e] text-white font-bold uppercase tracking-widest px-8 py-3 rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50 border-b-4 border-[#15803d]"
          >
            {loading ? <span className="animate-spin">⚙</span> : <Send size={18} />}
            Gönder
          </button>
        </div>
      </form>
    </div>
  );
}
