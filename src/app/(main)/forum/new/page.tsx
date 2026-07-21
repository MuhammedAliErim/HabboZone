'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { Save, ArrowLeft, PlusCircle, Trash2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forumId = searchParams.get('forum_id');
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [forumDetails, setForumDetails] = useState<any>(null);
  
  // Poll State
  const [addPoll, setAddPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState([{ text: '' }, { text: '' }]);
  const [pollMultiple, setPollMultiple] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (forumId) {
      fetchForumDetails();
    } else {
      router.push('/forum');
    }
  }, [forumId]);

  const fetchForumDetails = async () => {
    const { data } = await supabase.from('forums').select('title, slug').eq('id', forumId).single();
    if (data) {
      setForumDetails(data);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, { text: '' }]);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index].text = value;
    setPollOptions(newOptions);
  };

  const generateSlug = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-') + '-' + Math.floor(Math.random() * 10000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumId) return;
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Konu açmak için giriş yapmalısın.');

      if (title.length < 5) throw new Error('Başlık çok kısa!');
      if (content.length < 10) throw new Error('İçerik çok kısa!');

      const slug = generateSlug(title);

      // 1. Insert Topic
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .insert({
          forum_id: forumId,
          author_id: user.id,
          title,
          slug,
          content,
          tags: [], // Could be added from UI later
        })
        .select()
        .single();

      if (topicError) throw topicError;

      // 2. Insert Poll if enabled
      if (addPoll && pollQuestion.length > 3) {
        const validOptions = pollOptions.filter(o => o.text.trim() !== '');
        
        if (validOptions.length >= 2) {
          const { data: pollData, error: pollError } = await supabase
            .from('polls')
            .insert({
              topic_id: topicData.id,
              question: pollQuestion,
              is_multiple_choice: pollMultiple,
            })
            .select()
            .single();

          if (pollError) throw pollError;

          // Insert options
          const optionsToInsert = validOptions.map((opt, idx) => ({
            poll_id: pollData.id,
            option_text: opt.text,
            order_index: idx
          }));

          const { error: optError } = await supabase.from('poll_options').insert(optionsToInsert);
          if (optError) throw optError;
        }
      }

      router.push(`/forum/topic/${slug}`);
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Yeni Konu Aç</h2>
          <p className="text-white/60">
            {forumDetails ? `${forumDetails.title} forumuna konu açıyorsun.` : 'Yükleniyor...'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Konu Başlığı</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors font-bold text-lg"
            placeholder="İlgi çekici bir başlık gir..."
          />
        </div>

        {/* Content Editor */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-bold mb-4 opacity-80 uppercase">İçerik</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        {/* Poll Options */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setAddPoll(!addPoll)}>
            <div className="flex items-center gap-2">
              <HelpCircle size={24} className={addPoll ? "text-primary" : "text-white/50"} />
              <h3 className="text-lg font-bold uppercase tracking-widest">Konuya Anket Ekle</h3>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${addPoll ? 'bg-primary' : 'bg-white/20'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${addPoll ? 'left-7' : 'left-1'}`} />
            </div>
          </div>

          {addPoll && (
            <div className="pt-4 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-bold mb-2 opacity-80 uppercase">Anket Sorusu</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors font-bold"
                  placeholder="Üyelere ne sormak istersin?"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold opacity-80 uppercase">Seçenekler</label>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      className="flex-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                      placeholder={`${idx + 1}. Seçenek`}
                    />
                    {pollOptions.length > 2 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
                
                {pollOptions.length < 10 && (
                  <button 
                    type="button" 
                    onClick={handleAddPollOption}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors py-2"
                  >
                    <PlusCircle size={16} /> Yeni Seçenek Ekle
                  </button>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input 
                  type="checkbox" 
                  checked={pollMultiple} 
                  onChange={(e) => setPollMultiple(e.target.checked)} 
                  className="w-4 h-4 accent-primary" 
                />
                <span className="text-sm font-bold text-white/70">Üyeler birden fazla seçeneğe oy verebilsin</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 sticky bottom-8">
          <button
            type="submit"
            disabled={loading || content.length < 10 || title.length < 5}
            className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest pixel-borders hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <><span className="animate-spin">⚙</span> Açılıyor...</>
            ) : (
              <><Save size={20} /> Konuyu Aç</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
