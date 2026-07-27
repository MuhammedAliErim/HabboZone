'use client';

import { useActionState } from 'react';
import { createReply } from '@/app/(main)/forum/actions';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

export default function ReplyForm({ topicId, topicSlug, user, currentUser }: { topicId: string, topicSlug?: string, user?: any, currentUser?: any }) {
    const [state, formAction, isPending] = useActionState(createReply, null);
    const activeUser = user || currentUser;

    if (!activeUser) {
        return (
            <div className="bg-[#0a1325] border border-[#1e293b] rounded p-6 text-center">
                <p className="text-[#94a3b8] text-[13px] font-bold mb-4">Cevap yazabilmek için giriş yapmalısınız.</p>
                <a href={`/login?redirect=/forum/${topicSlug || ''}`} className="bg-[#3b82f6] text-white px-6 py-2 rounded-[4px] font-bold text-xs border-b-4 border-[#1d4ed8] uppercase inline-block">GİRİŞ YAP</a>
            </div>
        );
    }

    return (
        <form action={formAction} className="habbo-box overflow-hidden bg-[#0a1325]">
            <div className="bg-[#050a14] border-b border-[#1e293b] p-3">
                <h3 className="text-[12px] font-black text-white tracking-wide uppercase">CEVAP YAZ</h3>
            </div>
            
            <div className="p-0 flex flex-col md:flex-row">
                {/* Author Info (Left) */}
                <div className="w-full md:w-[180px] bg-[#050a14] p-4 flex flex-row md:flex-col items-center gap-4 md:gap-2 border-b md:border-b-0 md:border-r border-[#1e293b]">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-[4px] bg-[#0a1325] border border-[#1e293b] flex items-center justify-center shrink-0 overflow-hidden relative">
                        <HabboAvatar username={activeUser.user_metadata?.habbo_username || activeUser.user_metadata?.username} size="l" direction={3} className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <span className="text-white font-bold text-xs text-left md:text-center w-full truncate">
                        @{activeUser.user_metadata?.username || 'Üye'}
                    </span>
                </div>

                {/* Content (Right) */}
                <div className="flex-1 p-5 bg-[#0a1325]">
                    {state?.error && (
                        <div className="bg-[#7f1d1d] border border-black text-white p-3 rounded-[3px] flex items-center gap-2 mb-4">
                            <AlertCircle size={16} />
                            <p className="font-bold text-xs">{state.error}</p>
                        </div>
                    )}
                    
                    <input type="hidden" name="topic_id" value={topicId} />
                    <input type="hidden" name="topic_slug" value={topicSlug || ''} />

                    <textarea 
                        name="content" 
                        required
                        placeholder="Cevabınızı buraya yazın..."
                        className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] p-3 text-white text-xs md:text-sm focus:outline-none focus:border-[#3b82f6] transition-colors min-h-[120px] resize-y mb-4 font-medium"
                        maxLength={5000}
                    ></textarea>

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2 rounded-[4px] font-bold text-xs border-b-4 border-[#15803d] uppercase flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
