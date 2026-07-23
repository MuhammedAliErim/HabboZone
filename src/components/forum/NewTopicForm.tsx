'use client';

import { useActionState, useEffect, useState } from 'react';
import { createTopic } from '@/app/(main)/forum/actions';
import { Send, AlertCircle, Loader2 } from 'lucide-react';

export default function NewTopicForm({ forums }: { forums: any[] }) {
    const [state, formAction, isPending] = useActionState(createTopic, null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <form action={formAction} className="space-y-6">
            
            {state?.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="font-medium text-sm">{state.error}</p>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">Kategori Seçin</label>
                <select 
                    name="forum_id" 
                    required
                    className="w-full bg-[#020610] border border-[#1e293b] rounded p-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
                >
                    <option value="">-- Lütfen bir kategori seçin --</option>
                    {forums.map(forum => (
                        <option key={forum.id} value={forum.id}>
                            {forum.category?.name ? `${forum.category.name} > ` : ''}{forum.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">Konu Başlığı</label>
                <input 
                    type="text" 
                    name="title" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Konu başlığını buraya girin..."
                    className="w-full bg-[#020610] border border-[#1e293b] rounded p-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
                    maxLength={100}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">İçerik</label>
                <textarea 
                    name="content" 
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Konu içeriğini buraya yazın..."
                    className="w-full bg-[#020610] border border-[#1e293b] rounded p-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors min-h-[300px] resize-y"
                    maxLength={10000}
                ></textarea>
                <p className="text-[10px] text-[#64748b] text-right">
                    {content.length}/10000
                </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1e293b]">
                <button 
                    type="submit" 
                    disabled={isPending || !title || !content}
                    className="habbo-button success px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {isPending ? 'GÖNDERİLİYOR...' : 'KONUYU YAYINLA'}
                </button>
            </div>
        </form>
    );
}
