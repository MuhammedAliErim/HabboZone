export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black mb-8">Dashboard'a Hoş Geldin!</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-sm opacity-60 uppercase font-bold tracking-widest mb-1">Toplam Haber</div>
            <div className="text-4xl font-black text-primary">124</div>
          </div>
          <div className="text-5xl opacity-20">📰</div>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-sm opacity-60 uppercase font-bold tracking-widest mb-1">E-Dergi Sayısı</div>
            <div className="text-4xl font-black text-primary">14</div>
          </div>
          <div className="text-5xl opacity-20">📖</div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-sm opacity-60 uppercase font-bold tracking-widest mb-1">Günlük Ziyaretçi</div>
            <div className="text-4xl font-black text-primary">8.5K</div>
          </div>
          <div className="text-5xl opacity-20">👥</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Quick Actions */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Hızlı İşlemler</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold transition-colors">
              + Yeni Haber Yaz
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold transition-colors">
              + E-Dergi Sayısı Yükle
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold transition-colors">
              ⚙ Site Ayarlarını Düzenle
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Sistem Durumu</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <span className="opacity-80">Supabase Bağlantısı</span>
              <span className="text-yellow-500 font-bold px-2 py-1 bg-yellow-500/10 rounded pixel-borders text-xs">Mock Mod</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="opacity-80">Radyo Sunucusu</span>
              <span className="text-green-500 font-bold px-2 py-1 bg-green-500/10 rounded pixel-borders text-xs">Aktif</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="opacity-80">Ziyaretçi Takibi</span>
              <span className="text-green-500 font-bold px-2 py-1 bg-green-500/10 rounded pixel-borders text-xs">Aktif</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
