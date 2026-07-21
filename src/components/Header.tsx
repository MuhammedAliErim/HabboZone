import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border-b-4 border-white/30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-black tracking-tighter text-primary group-hover:scale-105 transition-transform drop-shadow-md">
            Habbo<span className="text-foreground">Zone</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 font-bold uppercase text-sm tracking-wide">
          <Link href="/" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Ana Sayfa</Link>
          <Link href="/news" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Haberler</Link>
          <Link href="/magazines" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">E-Dergi</Link>
          <Link href="/events" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Etkinlikler</Link>
          <Link href="/profile" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Profil Arama</Link>
        </nav>

        {/* Mobile Menu Button (Placeholder) */}
        <button className="md:hidden p-2">
          <div className="w-6 h-0.5 bg-current mb-1.5 rounded" />
          <div className="w-6 h-0.5 bg-current mb-1.5 rounded" />
          <div className="w-6 h-0.5 bg-current rounded" />
        </button>
      </div>
    </header>
  );
}
