export default function Footer() {
  return (
    <footer className="w-full bg-white border-t-2 border-gray-200 mt-12 py-8 text-center text-sm shadow-[0_-4px_0_0_rgba(0,0,0,0.05)]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="font-black tracking-widest uppercase text-gray-800 text-lg">
          HabboZone © 2026
        </div>
        <p className="max-w-3xl mx-auto text-xs font-medium text-gray-500 leading-relaxed">
          Bu HabboZone, Sulake Oy veya İştirakleri tarafından doğrulanmamış, onaylanmamış ve desteklenmemiştir ve bunlar ile bağlı değildir. Bu HabboZone, Habbo Fan Sitesi Poliçesi altında izin verilen ticaret markalarını ve diğer Habbo fikrî mülkiyetlerini kullanabilir.
        </p>
      </div>
    </footer>
  );
}
