import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';
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
        <div className="max-w-[900px] mx-auto px-4 pb-20 pt-6">
            
            <div className="mb-6">
                <Link href="/forum" className="bg-[#0a1325] hover:bg-[#1e293b] text-gray-300 hover:text-white px-4 py-2 rounded-[3px] font-bold text-xs border border-[#1e293b] uppercase inline-flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} className="text-[#3b82f6]" /> FORUM ANA SAYFASINA DÖN
                </Link>
            </div>

            <div className="habbo-box bg-[#0a1325] border border-[#1e293b]">
                <div className="bg-[#050a14] border-b border-[#1e293b] p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[4px] bg-[#0a1325] border border-[#1e293b] flex items-center justify-center">
                            <Edit3 size={24} className="text-[#facc15]" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">
                                YENİ KONU AÇ
                            </h1>
                            <p className="text-gray-400 text-xs mt-0.5">Toplulukla yeni bir fikir, soru, rehber veya içerik paylaş.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#0a1325]">
                    <NewTopicForm forums={forums} />
                </div>
            </div>

        </div>
    );
}
