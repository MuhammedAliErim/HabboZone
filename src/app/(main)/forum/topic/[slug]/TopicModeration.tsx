'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Unlock, Pin, CheckCircle } from 'lucide-react';

export default function TopicModeration({ 
  topic, 
  userProfile 
}: { 
  topic: any, 
  userProfile: any 
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Sadece yetkili roller (Owner, Developer, Administrator, Moderator) veya yazar modere edebilir (örneğin yazar kendi konusunu çözüldü yapabilir)
  const isModerator = userProfile && ['Owner', 'Developer', 'Administrator', 'Moderator'].includes(userProfile.role);
  const isAuthor = userProfile && userProfile.id === topic.author.id;

  if (!isModerator && !isAuthor) return null;

  const handleToggle = async (field: 'is_locked' | 'is_pinned' | 'is_solved') => {
    setLoading(true);
    const newValue = !topic[field];
    
    const { error } = await supabase
      .from('topics')
      .update({ [field]: newValue })
      .eq('id', topic.id);

    if (!error) {
      router.refresh();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isModerator && (
        <>
          <button 
            onClick={() => handleToggle('is_locked')}
            disabled={loading}
            className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded transition-colors ${topic.is_locked ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
          >
            {topic.is_locked ? <><Lock size={14} /> Kilitli</> : <><Unlock size={14} /> Kilitle</>}
          </button>
          
          <button 
            onClick={() => handleToggle('is_pinned')}
            disabled={loading}
            className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded transition-colors ${topic.is_pinned ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
          >
            <Pin size={14} /> {topic.is_pinned ? 'Sabiti Kaldır' : 'Sabitle'}
          </button>
        </>
      )}

      {(isModerator || isAuthor) && (
        <button 
          onClick={() => handleToggle('is_solved')}
          disabled={loading}
          className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded transition-colors ${topic.is_solved ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
        >
          <CheckCircle size={14} /> {topic.is_solved ? 'Çözüldü İşaretini Kaldır' : 'Çözüldü İşaretle'}
        </button>
      )}
    </div>
  );
}
