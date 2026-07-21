'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Undo, Redo } from 'lucide-react';

export default function TipTapEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  return (
    <div className="border-2 border-white/20 rounded-lg overflow-hidden bg-black/20">
      <div className="flex flex-wrap gap-1 p-2 bg-white/5 border-b-2 border-white/10">
        <button
          type="button"
          onClick={toggleBold}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : ''}`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : ''}`}
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 my-auto mx-1" />
        <button
          type="button"
          onClick={toggleHeading2}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : ''}`}
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={toggleHeading3}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : ''}`}
        >
          <Heading3 size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 my-auto mx-1" />
        <button
          type="button"
          onClick={toggleBulletList}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : ''}`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : ''}`}
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={toggleBlockquote}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : ''}`}
        >
          <Quote size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 my-auto mx-1" />
        <button
          type="button"
          onClick={undo}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-white/10 disabled:opacity-50"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-white/10 disabled:opacity-50"
        >
          <Redo size={18} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
