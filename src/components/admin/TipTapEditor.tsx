'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { 
  Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, 
  Undo, Redo, Image as ImageIcon, Link as LinkIcon, Unlink, 
  Palette, Sparkles, Code, Minus, Check
} from 'lucide-react';
import { useState } from 'react';

const COLORS = [
  { label: 'Varsayılan Beyaz', value: '#ffffff', class: 'bg-white' },
  { label: 'Habbo Sarısı', value: '#facc15', class: 'bg-yellow-400' },
  { label: 'Okyanus Mavisi', value: '#3b82f6', class: 'bg-blue-500' },
  { label: 'Doğa Yeşili', value: '#22c55e', class: 'bg-green-500' },
  { label: 'Ateş Kırmızısı', value: '#ef4444', class: 'bg-red-500' },
  { label: 'Neon Mor', value: '#a855f7', class: 'bg-purple-500' },
  { label: 'Günbatımı Turuncu', value: '#f97316', class: 'bg-orange-500' },
  { label: 'Siber Turkuaz', value: '#06b6d4', class: 'bg-cyan-500' },
];

export default function TipTapEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-h-[400px] object-cover mx-auto my-4 border-2 border-white/20 shadow-2xl',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline font-bold hover:text-blue-300 transition-colors cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[350px] p-6 text-gray-200 leading-relaxed text-base',
      },
    },
  });

  if (!editor) {
    return (
      <div className="border-2 border-white/10 rounded-xl h-[350px] bg-black/30 flex items-center justify-center text-gray-400 text-sm animate-pulse">
        Profesyonel Editör Yükleniyor...
      </div>
    );
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const insertHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  const addImage = () => {
    const url = window.prompt('Görsel URL adresini yapıştırın:');
    if (url && url.trim() !== '') {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Bağlantı (Link) URL adresi:', previousUrl);

    // iptal edildiyse
    if (url === null) {
      return;
    }

    // boş bırakıldıysa linki kaldır
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // link ekle/güncelle
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  return (
    <div className="border-2 border-white/20 rounded-xl overflow-hidden bg-[#0a1224] shadow-2xl flex flex-col">
      
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-black tracking-wider text-emerald-300 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> PRO HABER EDİTÖRÜ v2.0
          </span>
        </div>
        <span className="text-[11px] text-gray-400 font-medium">
          Canva & Habbo Tarzı Zengin İçerik Desteği
        </span>
      </div>

      {/* Araç Kutusunu İçeren Araç Çubuğu (Toolbar) */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 bg-[#111827] border-b-2 border-white/10">
        
        {/* Yazı Tipleri */}
        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
          <button
            type="button"
            onClick={toggleBold}
            title="Kalın (Bold)"
            className={`p-2 rounded-md transition-all ${editor.isActive('bold') ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            title="İtalik (Italic)"
            className={`p-2 rounded-md transition-all ${editor.isActive('italic') ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={toggleCode}
            title="Satır İçi Kod"
            className={`p-2 rounded-md transition-all ${editor.isActive('code') ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Code size={16} />
          </button>
        </div>

        {/* Renk Seçici (Color Palette) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Metin Rengi"
            className={`flex items-center gap-1.5 p-2 rounded-lg border transition-all ${showColorPicker ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-black/40 border-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            <Palette size={16} className="text-yellow-400" />
            <span className="text-xs font-bold hidden sm:inline">Renk</span>
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-[#1e293b] border-2 border-white/20 rounded-xl shadow-2xl z-50 grid grid-cols-4 gap-2 w-56 animate-in fade-in zoom-in-95 duration-150">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className="group relative flex flex-col items-center justify-center p-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/5 transition-transform hover:scale-105"
                >
                  <div className={`w-6 h-6 rounded-full ${c.class} shadow-md flex items-center justify-center`}>
                    {editor.isActive('textStyle', { color: c.value }) && (
                      <Check size={12} className={c.value === '#ffffff' ? 'text-black font-black' : 'text-white font-black'} />
                    )}
                  </div>
                  <span className="text-[9px] text-gray-300 mt-1 truncate w-full text-center">{c.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Başlıklar (Headings) */}
        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
          <button
            type="button"
            onClick={toggleHeading2}
            title="Ana Başlık (H2)"
            className={`p-2 rounded-md transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={toggleHeading3}
            title="Alt Başlık (H3)"
            className={`p-2 rounded-md transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Heading3 size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Listeler & Alıntılar */}
        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
          <button
            type="button"
            onClick={toggleBulletList}
            title="Madde İmleri"
            className={`p-2 rounded-md transition-all ${editor.isActive('bulletList') ? 'bg-green-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={toggleOrderedList}
            title="Numaralı Liste"
            className={`p-2 rounded-md transition-all ${editor.isActive('orderedList') ? 'bg-green-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={toggleBlockquote}
            title="Alıntı Kutusu (Quote)"
            className={`p-2 rounded-md transition-all ${editor.isActive('blockquote') ? 'bg-green-600 text-white shadow' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            onClick={insertHorizontalRule}
            title="Yatay Çizgi Ekle"
            className="p-2 rounded-md transition-all text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Minus size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Medya & Bağlantılar (Image / Link) */}
        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
          <button
            type="button"
            onClick={addImage}
            title="Görsel (Resim) URL Ekle"
            className="p-2 rounded-md transition-all text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 flex items-center gap-1 font-bold text-xs px-2.5"
          >
            <ImageIcon size={16} />
            <span className="hidden md:inline">Resim</span>
          </button>
          <button
            type="button"
            onClick={setLink}
            title="Bağlantı (Link) Ekle"
            className={`p-2 rounded-md transition-all flex items-center gap-1 font-bold text-xs px-2.5 ${editor.isActive('link') ? 'bg-cyan-600 text-white' : 'text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'}`}
          >
            <LinkIcon size={16} />
            <span className="hidden md:inline">Link</span>
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={removeLink}
              title="Linki Kaldır"
              className="p-2 rounded-md transition-all text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <Unlink size={16} />
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Geri / İleri (Undo / Redo) */}
        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
          <button
            type="button"
            onClick={undo}
            disabled={!editor.can().undo()}
            title="Geri Al (Undo)"
            className="p-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!editor.can().redo()}
            title="Yeniden Yap (Redo)"
            className="p-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>

      {/* Editör Alanı */}
      <div className="flex-1 relative overflow-y-auto max-h-[600px] bg-gradient-to-b from-[#0a1224] to-[#050a14]">
        <EditorContent editor={editor} />
      </div>

      {/* Alt Durum Çubuğu */}
      <div className="bg-[#0b1329] px-4 py-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>📝 Kelime Sayısı: <strong className="text-white">{editor.state.doc.textContent.trim().split(/\s+/).filter(Boolean).length}</strong></span>
          <span>⌨️ Karakter: <strong className="text-white">{editor.state.doc.textContent.length}</strong></span>
        </div>
        <div className="text-yellow-400/80 font-semibold hidden sm:inline">
          💡 İpucu: Resim ekledikten sonra üzerine tıklayıp sürükleyebilir veya link bağlayabilirsiniz.
        </div>
      </div>

    </div>
  );
}
