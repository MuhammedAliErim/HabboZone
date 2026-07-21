import { MOCK_MAGAZINES } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function MagazineReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const magazine = MOCK_MAGAZINES.find(m => m.id === resolvedParams.id);

  if (!magazine) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col">
      {/* Reader Header */}
      <header className="h-16 flex-none bg-zinc-900 border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/magazines" 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-xl font-bold"
            title="Geri Dön"
          >
            ←
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-tight">{magazine.title}</h1>
            <p className="text-xs text-white/60">Sayı #{magazine.issue_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href={magazine.pdf_url} 
            download 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors pixel-borders"
          >
            PDF İndir
          </a>
        </div>
      </header>

      {/* Reader Body */}
      <main className="flex-1 w-full bg-zinc-950 overflow-hidden relative">
        {/* We use an iframe to render the PDF for now. If PDF loading fails, show a placeholder. */}
        <iframe 
          src={`${magazine.pdf_url}#toolbar=0`} 
          className="w-full h-full border-none bg-zinc-950"
          title={magazine.title}
        />
        
        {/* Simple overlay when iframe might be loading or blocked */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center mix-blend-difference opacity-50">
          {/* <span className="text-6xl mb-4">📖</span> */}
          {/* <p className="font-bold tracking-widest uppercase">HabboZone Reader</p> */}
        </div>
      </main>
    </div>
  );
}
