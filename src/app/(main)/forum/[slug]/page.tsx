import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, MessageSquare, ShieldAlert } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';
import ReplyForm from '@/components/forum/ReplyForm';
import { formatDistanceToNow, format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function TopicDetailPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch the topic
    const { data: topic, error } = await supabase
        .from('topics')
        .select(`
            id, title, slug, content, created_at, updated_at, is_pinned, is_locked,
            author:profiles!topics_author_id_fkey(id, username, habbo_username, created_at, rank),
            forum:forums(title, slug, category:categories(name))
        `)
        .eq('slug', params.slug)
        .single();

    if (error || !topic) {
        notFound();
    }

    // Fetch the replies
    const { data: replies } = await supabase
        .from('replies')
        .select(`
            id, content, created_at, updated_at,
            author:profiles!replies_author_id_fkey(id, username, habbo_username, created_at, rank)
        `)
        .eq('topic_id', topic.id)
        .order('created_at', { ascending: true });

    const formatTime = (dateStr: string) => {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr });
    };

    const formatExactTime = (dateStr: string) => {
        return format(new Date(dateStr), 'dd MMM yyyy, HH:mm', { locale: tr });
    };

    const PostCard = ({ content, author, createdAt, isTopic = false }: { content: string, author: any, createdAt: string, isTopic?: boolean }) => (
        <div className={`habbo-box overflow-hidden mb-6 ${isTopic ? 'border-[#3b82f6]/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : ''}`}>
            {isTopic && (
                <div className="bg-[#3b82f6]/10 border-b border-[#3b82f6]/20 px-6 py-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                    <span className="text-[#3b82f6] text-[10px] font-bold tracking-widest uppercase">İlk Gönderi</span>
                </div>
            )}
            <div className="flex flex-col md:flex-row">
                
                {/* Author Column */}
                <div className="w-full md:w-[200px] bg-[#0a1325] p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-[#1e293b] shrink-0">
                    <div className="w-20 h-20 rounded bg-[#1e293b] flex items-center justify-center relative mb-4">
                        <HabboAvatar username={author?.habbo_username || author?.username} size="l" direction={3} className="w-16 h-16" />
                    </div>
                    <Link href={`/profile/${author?.username}`} className="text-white font-bold text-[14px] text-center w-full truncate hover:text-[#3b82f6] transition-colors">
                        {author?.username}
                    </Link>
                    <div className="text-[10px] text-[#64748b] font-medium uppercase mt-1 mb-4 bg-[#1e293b] px-2 py-0.5 rounded">
                        {author?.rank || 'Kullanıcı'}
                    </div>
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-[11px]">
                            <span className="text-[#64748b]">Kayıt:</span>
                            <span className="text-[#94a3b8]">{author?.created_at ? format(new Date(author.created_at), 'MMM yyyy', { locale: tr }) : '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#64748b] text-[11px]">
                            <Clock size={12} />
                            <span>{formatExactTime(createdAt)}</span>
                            <span className="hidden sm:inline">({formatTime(createdAt)})</span>
                        </div>
                    </div>
                    <div className="p-6 text-[#cbd5e1] text-[14px] leading-relaxed whitespace-pre-wrap flex-1 break-words">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1000px] mx-auto px-6 pb-16 animate-in fade-in duration-500 pt-8">
            
            {/* Breadcrumb & Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 text-[12px] font-bold">
                    <Link href="/forum" className="text-[#64748b] hover:text-white transition-colors">FORUM</Link>
                    <ChevronLeft size={14} className="text-[#475569] rotate-180" />
                    <Link href={`/forum/category/${Array.isArray(topic.forum) ? topic.forum[0]?.slug : (topic.forum as any)?.slug}`} className="text-[#64748b] hover:text-white transition-colors uppercase">{Array.isArray(topic.forum) ? topic.forum[0]?.title : (topic.forum as any)?.title}</Link>
                </div>
                <Link href="/forum" className="inline-flex items-center gap-2 text-[#94a3b8] hover:text-white font-bold text-[11px] transition-colors border border-[#1e293b] px-3 py-1.5 rounded hover:bg-[#1e293b]">
                    <ChevronLeft size={14} />
                    GERİ DÖN
                </Link>
            </div>

            {/* Topic Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                    {topic.is_locked && <ShieldAlert className="text-[#ef4444]" size={24} />}
                    {topic.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#64748b]">
                    <span className="flex items-center gap-1">
                        <MessageSquare size={14} /> {replies?.length || 0} Cevap
                    </span>
                </div>
            </div>

            {/* Original Topic Post */}
            <PostCard 
                content={topic.content} 
                author={topic.author} 
                createdAt={topic.created_at} 
                isTopic={true}
            />

            {/* Replies */}
            {replies?.map((reply: any) => (
                <PostCard 
                    key={reply.id} 
                    content={reply.content} 
                    author={reply.author} 
                    createdAt={reply.created_at} 
                />
            ))}

            {/* Reply Form */}
            <div className="mt-8">
                {topic.is_locked ? (
                    <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded p-6 text-center">
                        <ShieldAlert size={32} className="text-[#ef4444] mx-auto mb-2" />
                        <h3 className="text-white font-bold mb-1">Bu konu kilitli</h3>
                        <p className="text-[#ef4444] text-[13px]">Bu konuya yeni cevap yazılamaz.</p>
                    </div>
                ) : (
                    <ReplyForm topicId={topic.id} topicSlug={topic.slug} user={user} />
                )}
            </div>

        </div>
    );
}
