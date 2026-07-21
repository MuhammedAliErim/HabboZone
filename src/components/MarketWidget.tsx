'use client';

// Mock data representing marketplace API data
const MOCK_MARKET_DATA = [
  { id: 1, name: 'Altın Ejderha', price: 850, trend: 'up', icon: 'https://images.habbo.com/c_images/catalogue/icon_256.png' },
  { id: 2, name: 'Mor Şemsiye', price: 1200, trend: 'down', icon: 'https://images.habbo.com/c_images/catalogue/icon_215.png' },
  { id: 3, name: 'Taht', price: 4500, trend: 'stable', icon: 'https://images.habbo.com/c_images/catalogue/icon_246.png' },
  { id: 4, name: 'Safir Dondurma', price: 320, trend: 'up', icon: 'https://images.habbo.com/c_images/catalogue/icon_199.png' },
];

export default function MarketWidget() {
  return (
    <div className="bg-white/10 dark:bg-black/20 p-6 rounded-2xl border-4 border-white/20 shadow-lg relative overflow-hidden">
      {/* Header */}
      <h3 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center justify-between relative z-10">
        <span className="flex items-center gap-2">
          <span className="text-2xl">📈</span> Pazar Yeri
        </span>
        <span className="text-xs bg-primary/20 text-primary border border-primary/50 px-2 py-1 rounded pixel-borders">Canlı</span>
      </h3>

      {/* List */}
      <div className="space-y-4 relative z-10">
        {MOCK_MARKET_DATA.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-black/10 p-3 rounded-xl border border-white/10 hover:bg-black/20 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt={item.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-sm">{item.name}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="font-black text-amber-500 drop-shadow-sm flex items-center gap-1">
                {item.price} 
                <span className="text-xs">c</span>
              </div>
              <div className="text-xs font-bold flex items-center gap-1">
                {item.trend === 'up' && <span className="text-green-500">▲ +%5</span>}
                {item.trend === 'down' && <span className="text-red-500">▼ -%2</span>}
                {item.trend === 'stable' && <span className="text-gray-400 opacity-80">▬ %0</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-black/10 dark:border-white/10 text-center">
        <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
          Tüm Piyasayı Gör →
        </button>
      </div>
    </div>
  );
}
