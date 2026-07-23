"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import HabboAvatar from "./HabboAvatar";

export default function NewsComments({ newsId, initialComments }: { newsId: string, initialComments: any[] }) {
  const supabase = createClient();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: profile }) => {
          setUser({ ...data.user, profile });
        });
      }
    });

    // Realtime subscription (optional, but good for UX)
    const channel = supabase.channel(`news_comments_${newsId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `news_id=eq.${newsId}` }, (payload) => {
        // Simple reload logic for brevity. In a real app, you'd merge the payload.
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, author:profiles(username, habbo_username, role, avatar_url)')
      .eq('news_id', newsId)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      news_id: newsId,
      author_id: user.id,
      content: newComment.trim()
    });

    setIsSubmitting(false);
    if (!error) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Yorumu silmek istediğine emin misin?")) return;
    await supabase.from('comments').delete().eq('id', commentId);
    fetchComments();
  };

  return (
    <div className="habbo-box mt-6 p-6">
      <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
        <MessageCircle size={20} className="text-[#facc15]" />
        YORUMLAR ({comments.length})
      </h3>

      <div className="flex flex-col gap-4 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 bg-[#0a1325] border border-[#1e293b] p-4 rounded-[6px] relative">
            <div className="w-12 h-12 shrink-0 bg-[#1e293b] border-2 border-black overflow-hidden flex items-center justify-center rounded-[4px] relative">
              <HabboAvatar 
                username={comment.author?.habbo_username || 'Admin'} 
                direction={2} headDirection={2} size="m" 
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#facc15] font-bold text-[14px]">
                  {comment.author?.username}
                </span>
                <span className="text-[#64748b] text-[11px] font-bold">
                  {new Date(comment.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-300 text-[13px] leading-relaxed break-words">
                {comment.content}
              </p>
            </div>
            {/* Delete button if owner or admin */}
            {user && (user.id === comment.author_id || ['Owner', 'Administrator', 'Moderator'].includes(user.profile?.role)) && (
              <button 
                onClick={() => handleDelete(comment.id)}
                className="absolute top-4 right-4 text-[#ef4444] hover:text-red-400 transition-colors"
                title="Yorumu Sil"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-[#64748b] text-[13px] py-4">
            Henüz yorum yapılmamış. İlk yorumu sen yap!
          </div>
        )}
      </div>

      {user ? (
        <form onSubmit={handlePostComment} className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunu yaz..."
            className="w-full bg-[#050a14] border border-[#1e293b] text-white p-3 rounded-[6px] text-[13px] focus:outline-none focus:border-[#facc15] resize-y min-h-[80px]"
            required
            maxLength={500}
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="self-end bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 text-white font-bold text-[13px] px-6 py-2 rounded-[4px] border-2 border-[#14532d] shadow-[0_4px_0_#14532d] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <Send size={14} />
            {isSubmitting ? 'GÖNDERİLİYOR...' : 'YORUM YAP'}
          </button>
        </form>
      ) : (
        <div className="bg-[#050a14] border border-[#1e293b] p-4 rounded-[6px] text-center text-[#94a3b8] text-[13px]">
          Yorum yapabilmek için lütfen <a href="/login" className="text-[#facc15] font-bold hover:underline">giriş yap</a>.
        </div>
      )}
    </div>
  );
}
