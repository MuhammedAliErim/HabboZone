'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ThumbsUp, Heart, Laugh, Frown, Angry, Zap } from 'lucide-react';

const REACTIONS = [
  { type: 'like', icon: ThumbsUp, label: 'Beğen', color: 'text-blue-400' },
  { type: 'love', icon: Heart, label: 'İnanılmaz', color: 'text-red-400' },
  { type: 'haha', icon: Laugh, label: 'Haha', color: 'text-yellow-400' },
  { type: 'sad', icon: Frown, label: 'Üzgün', color: 'text-orange-400' },
  { type: 'angry', icon: Angry, label: 'Kızgın', color: 'text-red-600' },
  { type: 'wow', icon: Zap, label: 'Vay Canına', color: 'text-purple-400' },
];

export default function ReactionView({ 
  targetId, 
  targetType, 
  currentUser 
}: { 
  targetId: string, 
  targetType: 'topic' | 'reply', 
  currentUser: any 
}) {
  const [reactions, setReactions] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchReactions();
  }, [targetId]);

  const fetchReactions = async () => {
    const { data } = await supabase
      .from('likes')
      .select('reaction_type, user_id')
      .eq('target_id', targetId)
      .eq('target_type', targetType);
    
    if (data) setReactions(data);
  };

  const myReaction = currentUser ? reactions.find(r => r.user_id === currentUser.id) : null;

  const handleReact = async (type: string) => {
    if (!currentUser) return alert('Tepki vermek için giriş yapmalısın.');
    setLoading(true);
    setShowPicker(false);

    if (myReaction) {
      if (myReaction.reaction_type === type) {
        // Remove reaction
        await supabase.from('likes').delete()
          .eq('target_id', targetId)
          .eq('target_type', targetType)
          .eq('user_id', currentUser.id);
        
        setReactions(reactions.filter(r => r.user_id !== currentUser.id));
      } else {
        // Change reaction
        await supabase.from('likes').update({ reaction_type: type })
          .eq('target_id', targetId)
          .eq('target_type', targetType)
          .eq('user_id', currentUser.id);
        
        setReactions(reactions.map(r => r.user_id === currentUser.id ? { ...r, reaction_type: type } : r));
      }
    } else {
      // Add reaction
      await supabase.from('likes').insert({
        target_id: targetId,
        target_type: targetType,
        user_id: currentUser.id,
        reaction_type: type
      });
      
      setReactions([...reactions, { user_id: currentUser.id, reaction_type: type }]);
    }
    
    setLoading(false);
  };

  // Group reactions for display
  const reactionCounts = reactions.reduce((acc, curr) => {
    acc[curr.reaction_type] = (acc[curr.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReactions = Object.entries(reactionCounts).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 3);

  return (
    <div className="flex items-center gap-4 select-none relative">
      {/* Active Reaction Display */}
      {reactions.length > 0 && (
        <div className="flex items-center gap-1 bg-black/20 rounded-full px-3 py-1 border border-white/5">
          {topReactions.map(([type]) => {
            const reactionConf = REACTIONS.find(r => r.type === type);
            if (!reactionConf) return null;
            const Icon = reactionConf.icon;
            return <Icon key={type} size={14} className={reactionConf.color} />;
          })}
          <span className="text-xs font-bold ml-1 text-white/60">{reactions.length}</span>
        </div>
      )}

      {/* React Button & Picker */}
      <div 
        className="relative"
        onMouseEnter={() => setShowPicker(true)}
        onMouseLeave={() => setShowPicker(false)}
      >
        <button 
          onClick={() => handleReact('like')}
          disabled={loading}
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${
            myReaction 
              ? REACTIONS.find(r => r.type === myReaction.reaction_type)?.color 
              : 'text-white/50 hover:text-white'
          }`}
        >
          {myReaction ? (
            (() => {
              const Icon = REACTIONS.find(r => r.type === myReaction.reaction_type)?.icon || ThumbsUp;
              return <Icon size={18} />;
            })()
          ) : (
            <ThumbsUp size={18} />
          )}
          <span>{myReaction ? REACTIONS.find(r => r.type === myReaction.reaction_type)?.label : 'Beğen'}</span>
        </button>

        {/* Floating Picker */}
        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-white/10 rounded-full p-2 flex gap-1 shadow-2xl animate-in slide-in-from-bottom-2 fade-in z-10">
            {REACTIONS.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.type}
                  onClick={() => handleReact(r.type)}
                  className={`p-2 rounded-full hover:bg-white/10 transition-transform hover:scale-125 group relative`}
                >
                  <Icon size={24} className={r.color} />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
