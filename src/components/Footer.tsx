export default function Footer() {
  return (
    <footer className="w-full bg-black/10 dark:bg-black/40 border-t-4 border-white/20 mt-12 py-8 text-center text-sm opacity-80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="font-bold tracking-widest uppercase">
          HabboZone © 2026
        </div>
        <p className="max-w-md mx-auto text-xs opacity-70">
          HabboZone is an independent community portal. Not affiliated with, endorsed, sponsored, or specifically approved by Sulake Corporation Oy or its Affiliates.
        </p>
      </div>
    </footer>
  );
}
