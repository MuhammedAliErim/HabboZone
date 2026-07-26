import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3, Sparkles } from 'lucide-react';
import NewTopicForm from '@/components/forum/NewTopicForm';

export default async function NewTopicPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/forum/new');
    }

    const { data: rawForums } = await supabase
        .from('forums')
        .select(`
            id, title,
            category:categories(name)
        `)
        .order('category_id');

    let forums: any[] = rawForums || [];

    // Fallback mock forums if database is empty so user can still test form UI
    if (!forums || forums.length === 0) {
        forums = [
            { id: 'f-1', title: 'Resmi Haberler & Güncellemeler', category: { name: 'HABBO OTEL' } },
            { id: 'f-2', title: 'Yarışmalar & Çekilişler', category: { name: 'HABBO OTEL' } },
            { id: 'f-3', title: 'Genel Sohbet & Tanışma', category: { name: 'TOPLULUK & SOSYAL' } },
            { id: 'f-4', title: 'Oda Tasarımları & Mimarlık', category: { name: 'TOPLULUK & SOSYAL' } },
            { id: 'f-5', title: 'Fiyat & Değer Tartışmaları', category: { name: 'EKONOMİ & TAKAS' } },
            { id: 'f-6', title: 'Takas Pazaryeri & İlanlar', category: { name: 'EKONOMİ & TAKAS' } },
        ];
    }

    return (
        <div className="max-w-[900px] mx-auto px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8">
            
            <Link href="/forum" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-[#0a1325]/80 border border-white/10 hover:border-white/30 px-4 py-2.5 rounded-xl shadow-md mb-6">
                <ArrowLeft size={16} className="text-cyan-400" /> FORUM ANA SAYFASINA DÖN
            </Link>

            <div className="habbo-box bg-[#0a1325]/80 border-2 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
                <div className="habbo-box-header bg-gradient-to-r from-[#14233d] to-[#0d172a] border-b border-white/10 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            <Edit3 size={24} className="text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow-md flex items-center gap-2">
                                Yeni Konu Aç <Sparkles size={18} className="text-amber-400" />
                            </h1>
                            <p className="text-gray-400 text-xs mt-0.5">Toplulukla yeni bir fikir, soru, rehber veya içerik paylaş.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-[#050b14]">
                    <NewTopicForm forums={forums} />
                </div>
            </div>

        </div>
    );
}
