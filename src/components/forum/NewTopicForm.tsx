'use client';

import { useActionState, useState } from 'react';
import { createTopic } from '@/app/(main)/forum/actions';
import { Send, AlertCircle, Loader2, Folder, Type, AlignLeft } from 'lucide-react';

export default function NewTopicForm({ forums }: { forums: any[] }) {
    const [state, formAction, isPending] = useActionState(createTopic, null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <form action={formAction} className="space-y-5">
            
            {state?.error && (
                <div className="bg-[#7f1d1d] border border-black text-white p-3 rounded-[3px] flex items-center gap-2 mb-4">
                    <AlertCircle size={16} />
                    <p className="font-bold text-xs uppercase tracking-wider">{state.error}</p>
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#facc15] uppercase tracking-wider flex items-center gap-1.5">
                    <Folder size={14} /> KATEGORİ SEÇİN
                </label>
                <select 
                    name="forum_id" 
                    required
                    className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] p-3 text-white font-bold text-xs focus:outline-none focus:border-[#3b82f6] transition-colors"
                >
                    <option value="" className="bg-[#050a14]">-- Lütfen Bir Kategori Seçin --</option>
                    {forums.map(forum => (
                        <option key={forum.id} value={forum.id} className="bg-[#050a14] py-1.5 text-xs">
                            {(Array.isArray(forum.category) ? forum.category[0]?.name : (forum.category as any)?.name) ? `${Array.isArray(forum.category) ? forum.category[0]?.name : (forum.category as any)?.name} > ` : ''}{forum.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#facc15] uppercase tracking-wider flex items-center gap-1.5">
                    <Type size={14} /> KONU BAŞLIĞI
                </label>
                <input 
                    type="text" 
                    name="title" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Konu başlığını buraya girin..."
                    className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] p-3 text-white font-bold text-xs focus:outline-none focus:border-[#3b82f6] transition-colors placeholder:text-gray-500 placeholder:font-normal"
                    maxLength={100}
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#facc15] uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft size={14} /> İÇERİK & DETAYLAR
                </label>
                <textarea 
                    name="content" 
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Konu içeriğini buraya yazın. Düşüncelerinizi, rehberlerinizi veya sorularınızı detaylandırın..."
                    className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] p-4 text-white font-medium text-xs md:text-sm focus:outline-none focus:border-[#3b82f6] transition-colors min-h-[250px] resize-y leading-relaxed placeholder:text-gray-500 placeholder:font-normal"
                    maxLength={10000}
                />
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 pt-1">
                    <span>* Habbo Kurallarına uygun şekilde saygılı bir dil kullanınız.</span>
                    <span className={content.length > 9000 ? 'text-[#facc15]' : ''}>{content.length}/10000</span>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1e293b]">
                <button 
                    type="submit" 
                    disabled={isPending || !title || !content}
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-3 rounded-[4px] font-bold text-xs border-b-4 border-[#15803d] uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isPending ? 'YAYINLANIYOR...' : 'KONUYU YAYINLA'}
                </button>
            </div>
        </form>
    );
}
