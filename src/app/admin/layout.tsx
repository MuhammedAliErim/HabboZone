import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-2xl font-black tracking-widest text-primary">
            HABBO<span className="text-white">ZONE</span>
          </Link>
          <div className="text-xs font-bold text-white/50 uppercase mt-1">Yönetim Paneli</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-bold text-sm">
            🏠 Dashboard
          </Link>
          <Link href="/admin/news" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold text-sm">
            📰 Haber Yönetimi
          </Link>
          <Link href="/admin/categories" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold text-sm">
            📁 Kategoriler
          </Link>
          <Link href="/admin/magazines" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold text-sm">
            📖 E-Dergi Yönetimi
          </Link>
          <Link href="/admin/staff" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold text-sm">
            👔 Kadro Yönetimi
          </Link>
          <Link href="/admin/radio" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold text-sm">
            📻 Radyo İstekleri
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="block px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-bold text-sm text-center border border-red-500/50 pixel-borders">
            Çıkış Yap
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-zinc-900 border-b border-white/10 flex items-center justify-between px-8 flex-none">
          <h1 className="font-bold">Yönetim Paneli</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">Admin Kullanıcısı</div>
            <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary overflow-hidden flex items-center justify-center text-xs font-bold">
              A
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
