'use client';

import { useState, useTransition } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VoteButtonsProps {
  targetId: string;
  targetType: 'news' | 'topic' | 'reply' | 'guide';
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: 'upvote' | 'downvote' | null;
  onVoteAction: (targetId: string, targetType: string, reactionType: 'upvote' | 'downvote') => Promise<{ success: boolean; message?: string }>;
}

export default function VoteButtons({
  targetId,
  targetType,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
  onVoteAction
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(initialUserVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = (type: 'upvote' | 'downvote') => {
    if (isPending) return;

    startTransition(async () => {
      // Optimistic update
      let prevVote = userVote;
      let newUp = upvotes;
      let newDown = downvotes;

      if (userVote === type) {
        // Remove vote
        if (type === 'upvote') newUp--;
        else newDown--;
        setUserVote(null);
      } else {
        // Change or add vote
        if (prevVote === 'upvote') newUp--;
        if (prevVote === 'downvote') newDown--;
        
        if (type === 'upvote') newUp++;
        else newDown++;
        
        setUserVote(type);
      }

      setUpvotes(newUp);
      setDownvotes(newDown);

      try {
        const result = await onVoteAction(targetId, targetType, type);
        if (!result.success) {
          // Revert on failure
          setUserVote(prevVote);
          setUpvotes(initialUpvotes);
          setDownvotes(initialDownvotes);
          toast.error(result.message || 'Oylama işlemi başarısız oldu.');
        }
      } catch (error) {
        setUserVote(prevVote);
        setUpvotes(initialUpvotes);
        setDownvotes(initialDownvotes);
        toast.error('Bir hata oluştu.');
      }
    });
  };

  return (
    <div className="flex items-center gap-3 bg-[#1e293b] p-3 rounded-[4px] border border-black shadow-[0_4px_0_#000] max-w-fit">
      <span className="text-[11px] font-bold text-gray-400 uppercase mr-2">BU HABER FAYDALI MIYDI?</span>
      
      <button
        onClick={() => handleVote('upvote')}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-black transition-all ${
          userVote === 'upvote' 
            ? 'bg-[#22c55e] text-white shadow-[inset_0_2px_0_rgba(0,0,0,0.2)] translate-y-[1px]' 
            : 'bg-[#334155] text-gray-300 hover:bg-[#475569] hover:text-white shadow-[0_2px_0_#000]'
        }`}
      >
        <ThumbsUp size={14} className={userVote === 'upvote' ? 'fill-current' : ''} />
        <span className="font-bold text-[13px]">{upvotes}</span>
      </button>

      <button
        onClick={() => handleVote('downvote')}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-black transition-all ${
          userVote === 'downvote' 
            ? 'bg-[#ef4444] text-white shadow-[inset_0_2px_0_rgba(0,0,0,0.2)] translate-y-[1px]' 
            : 'bg-[#334155] text-gray-300 hover:bg-[#475569] hover:text-white shadow-[0_2px_0_#000]'
        }`}
      >
        <ThumbsDown size={14} className={userVote === 'downvote' ? 'fill-current' : ''} />
        <span className="font-bold text-[13px]">{downvotes}</span>
      </button>
    </div>
  );
}
