import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Edit3 } from 'lucide-react';
import NewTopicForm from '@/components/forum/NewTopicForm';

export default async function NewTopicPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/forum/new');
    }

    const { data: forums } = await supabase
        .from('forums')
        .select(`
            id, title,
            category:categories(name)
        `)
        .order('category_id');

    return (
        <div className="max-w-[800px] mx-auto px-6 pb-16 animate-in fade-in duration-500 pt-8">
            
            <Link href="/forum" className="inline-flex items-center gap-2 text-[#94a3b8] hover:text-white font-bold text-[12px] mb-6 transition-colors">
                <ChevronLeft size={16} />
                FORUM ANA SAYFASINA DÖN
            </Link>

            <div className="habbo-box overflow-hidden">
                <div className="habbo-box-header p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#1e293b] flex items-center justify-center">
                        <Edit3 size={20} className="text-[#3b82f6]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-wide">Yeni Konu Aç</h1>
                        <p className="text-[#94a3b8] text-[12px]">Toplulukla yeni bir fikir, soru veya içerik paylaş.</p>
                    </div>
                </div>

                <div className="p-6">
                    <NewTopicForm forums={forums || []} />
                </div>
            </div>

        </div>
    );
}
