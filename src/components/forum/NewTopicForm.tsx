'use client';

import { useActionState, useState } from 'react';
import { createTopic } from '@/app/(main)/forum/actions';
import { Send, AlertCircle, Loader2, Sparkles, Folder, Type, AlignLeft } from 'lucide-react';

export default function NewTopicForm({ forums }: { forums: any[] }) {
    const [state, formAction, isPending] = useActionState(createTopic, null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <form action={formAction} className="space-y-6">
            
            {state?.error && (
                <div className="bg-red-500/10 border-2 border-red-500/40 text-red-300 p-4 rounded-xl flex items-center gap-3 shadow-lg animate-in fade-in">
                    <AlertCircle size={20} className="text-red-400 shrink-0" />
                    <p className="font-bold text-xs uppercase tracking-wider">{state.error}</p>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Folder size={16} /> Kategori Seçin
                </label>
                <select 
                    name="forum_id" 
                    required
                    className="w-full bg-[#0a1325]/80 border-2 border-white/10 rounded-xl p-3.5 text-white font-bold focus:outline-none focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
                >
                    <option value="" className="bg-[#050b14]">-- Lütfen Bir Kategori Seçin --</option>
                    {forums.map(forum => (
                        <option key={forum.id} value={forum.id} className="bg-[#050b14] py-2">
                            {(Array.isArray(forum.category) ? forum.category[0]?.name : (forum.category as any)?.name) ? `${Array.isArray(forum.category) ? forum.category[0]?.name : (forum.category as any)?.name} > ` : ''}{forum.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Type size={16} /> Konu Başlığı
                </label>
                <input 
                    type="text" 
                    name="title" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Konu başlığını buraya girin (Örn: 2026 Yaz Etkinliği Ödülleri Hakkında)..."
                    className="w-full bg-[#0a1325]/80 border-2 border-white/10 rounded-xl p-3.5 text-white font-bold focus:outline-none focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all placeholder:text-gray-500 placeholder:font-normal"
                    maxLength={100}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft size={16} /> İçerik & Detaylar
                </label>
                <textarea 
                    name="content" 
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Konu içeriğini buraya yazın. Düşüncelerinizi, rehberlerinizi veya sorularınızı detaylandırın..."
                    className="w-full bg-[#0a1325]/80 border-2 border-white/10 rounded-xl p-4 text-white font-medium focus:outline-none focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all min-h-[300px] resize-y leading-relaxed placeholder:text-gray-500 placeholder:font-normal"
                    maxLength={10000}
                />
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 pt-1">
                    <span>* Habbo Kurallarına uygun şekilde saygılı bir dil kullanınız.</span>
                    <span className={content.length > 9000 ? 'text-amber-400' : ''}>{content.length}/10000</span>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
                <button 
                    type="submit" 
                    disabled={isPending || !title || !content}
                    className="habbo-button success px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all scale-100 hover:scale-105 active:scale-95"
                >
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {isPending ? 'YAYINLANIYOR...' : 'KONUYU YAYINLA'}
                </button>
            </div>
        </form>
    );
}
