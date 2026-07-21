'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function PollView({ poll, currentUser }: { poll: any, currentUser: any }) {
  const [votes, setVotes] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    // Fetch all votes for this poll's options to calculate percentages
    const optionIds = poll.poll_options.map((o: any) => o.id);
    const { data } = await supabase.from('poll_votes').select('poll_option_id, user_id').in('poll_option_id', optionIds);
    
    if (data) {
      setVotes(data);
      if (currentUser) {
        const userVotes = data.filter((v: any) => v.user_id === currentUser.id).map((v: any) => v.poll_option_id);
        if (userVotes.length > 0) {
          setHasVoted(true);
          setSelectedOptions(userVotes);
        }
      }
    }
  };

  const toggleOption = (optId: string) => {
    if (hasVoted) return; // Can't change UI optimistically if already voted without removing vote first (we won't support vote changing for simplicity now unless requested)
    
    if (poll.is_multiple_choice) {
      if (selectedOptions.includes(optId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optId));
      } else {
        setSelectedOptions([...selectedOptions, optId]);
      }
    } else {
      setSelectedOptions([optId]);
    }
  };

  const handleVote = async () => {
    if (!currentUser) return alert('Oy vermek için giriş yapmalısın.');
    if (selectedOptions.length === 0) return alert('Lütfen bir seçenek işaretle.');
    
    setLoading(true);

    const votesToInsert = selectedOptions.map(optId => ({
      poll_option_id: optId,
      user_id: currentUser.id
    }));

    const { error } = await supabase.from('poll_votes').insert(votesToInsert);

    if (!error) {
      setHasVoted(true);
      fetchVotes();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  const totalVotes = votes.length; // Actually, in multiple choice total votes might be more than total voters.

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 space-y-4">
      <h3 className="text-xl font-bold text-primary flex items-center gap-2">
        📊 Anket: {poll.question}
        {poll.is_multiple_choice && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-auto">Çoklu Seçim</span>}
      </h3>
      <div className="space-y-3 mt-4">
        {poll.poll_options?.map((opt: any) => {
          const optVotes = votes.filter(v => v.poll_option_id === opt.id).length;
          const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const isSelected = selectedOptions.includes(opt.id);

          return (
            <div 
              key={opt.id} 
              onClick={() => toggleOption(opt.id)}
              className={`relative overflow-hidden rounded-lg border transition-all ${
                isSelected ? 'border-primary/50 bg-primary/10' : 'border-white/5 bg-black/20 hover:bg-black/40'
              } ${!hasVoted ? 'cursor-pointer' : ''}`}
            >
              {/* Progress bar background for results */}
              {hasVoted && (
                <div 
                  className="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              )}
              
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!hasVoted && (
                    <div className={`w-5 h-5 flex items-center justify-center rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-white/30'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  )}
                  <span className={`font-bold ${isSelected ? 'text-primary' : 'text-white'}`}>{opt.option_text}</span>
                </div>
                {hasVoted && (
                  <div className="text-sm font-bold text-white/60">
                    {optVotes} oy ({percentage}%)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {!hasVoted && (
        <button 
          onClick={handleVote} 
          disabled={loading || selectedOptions.length === 0}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm mt-4 hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {loading ? 'Oylanıyor...' : 'Oy Ver'}
        </button>
      )}
      {hasVoted && (
        <div className="text-sm text-green-400 font-bold mt-4 flex items-center gap-2">
          ✅ Oyunuz kaydedildi. (Toplam {totalVotes} oy kullanıldı)
        </div>
      )}
    </div>
  );
}
