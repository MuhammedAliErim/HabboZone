'use client';

import { useActionState } from 'react';
import { createReply } from '@/app/(main)/forum/actions';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export default function ReplyForm({ topicId, topicSlug, user }: { topicId: string, topicSlug: string, user: any }) {
    const [state, formAction, isPending] = useActionState(createReply, null);

    if (!user) {
        return (
            <div className="bg-[#0a1325] border border-[#1e293b] rounded p-6 text-center">
                <p className="text-[#94a3b8] text-[13px] mb-4">Cevap yazabilmek için giriş yapmalısınız.</p>
                <a href={`/login?redirect=/forum/${topicSlug}`} className="habbo-button text-[12px] px-6 py-2">GİRİŞ YAP</a>
            </div>
        );
    }

    return (
        <form action={formAction} className="habbo-box overflow-hidden">
            <div className="habbo-box-header p-4">
                <h3 className="text-[13px] font-bold text-white tracking-wide">CEVAP YAZ</h3>
            </div>
            
            <div className="p-0 flex flex-col md:flex-row">
                {/* Author Info (Left) */}
                <div className="w-full md:w-[200px] bg-[#0a1325] p-4 md:p-6 flex flex-row md:flex-col items-center gap-4 md:gap-0 border-b md:border-b-0 md:border-r border-[#1e293b]">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded bg-[#1e293b] flex items-center justify-center shrink-0 overflow-hidden relative mb-0 md:mb-3">
                        <HabboAvatar username={user.user_metadata?.habbo_username || user.user_metadata?.username} size="l" direction={3} className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <span className="text-white font-bold text-[13px] text-left md:text-center w-full truncate">
                        {user.user_metadata?.username}
                    </span>
                </div>

                {/* Content (Right) */}
                <div className="flex-1 p-6">
                    {state?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded flex items-center gap-3 mb-4">
                            <AlertCircle size={20} />
                            <p className="font-medium text-sm">{state.error}</p>
                        </div>
                    )}
                    
                    <input type="hidden" name="topic_id" value={topicId} />
                    <input type="hidden" name="topic_slug" value={topicSlug} />

                    <textarea 
                        name="content" 
                        required
                        placeholder="Cevabınızı buraya yazın..."
                        className="w-full bg-[#020610] border border-[#1e293b] rounded p-4 text-white focus:outline-none focus:border-[#3b82f6] transition-colors min-h-[150px] resize-y mb-4"
                        maxLength={5000}
                    ></textarea>

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="habbo-button success px-6 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {isPending ? 'GÖNDERİLİYOR...' : 'CEVABI GÖNDER'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
