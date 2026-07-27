'use client';

import Link from 'next/link';
import { TrendingUp, Activity, ArrowRight } from 'lucide-react';

const MOCK_MARKET_DATA = [
  { id: 1, name: 'Altın Ejderha', price: 850, trend: 'up', icon: 'https://images.habbo.com/c_images/catalogue/icon_256.png' },
  { id: 2, name: 'Mor Şemsiye', price: 1200, trend: 'down', icon: 'https://images.habbo.com/c_images/catalogue/icon_215.png' },
  { id: 3, name: 'Taht', price: 4500, trend: 'stable', icon: 'https://images.habbo.com/c_images/catalogue/icon_246.png' },
  { id: 4, name: 'Safir Dondurma', price: 320, trend: 'up', icon: 'https://images.habbo.com/c_images/catalogue/icon_199.png' },
];

export default function MarketWidget() {
  return (
    <div className="habbo-box bg-[#0a1325] border border-[#1e293b] overflow-hidden">
      {/* Header */}
      <div className="bg-[#050a14] border-b border-[#1e293b] text-[#facc15] font-black text-xs uppercase tracking-wider px-4 py-2.5 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Activity size={16} className="text-[#3b82f6]" /> PAZAR YERİ ENDEKSİ
        </span>
        <span className="text-[9px] font-black text-[#22c55e] bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b] uppercase">Canlı</span>
      </div>

      {/* List */}
      <div className="p-3 bg-[#0a1325] space-y-2">
        {MOCK_MARKET_DATA.map((item) => (
          <Link key={item.id} href="/values" className="flex items-center justify-between bg-[#050a14] p-2.5 rounded-[2px] border border-[#1e293b] hover:border-[#3b82f6] transition-colors group">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#0a1325] border border-[#1e293b] rounded-[2px] flex items-center justify-center p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt={item.name} className="w-full h-full object-contain drop-shadow group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-xs text-white group-hover:text-[#facc15] transition-colors">{item.name}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="font-black text-[#f59e0b] text-xs flex items-center gap-1">
                {item.price} 
                <span className="text-[10px] uppercase font-black">c</span>
              </div>
              <div className="text-[10px] font-bold flex items-center gap-0.5">
                {item.trend === 'up' && <span className="text-[#22c55e]">▲ +%5</span>}
                {item.trend === 'down' && <span className="text-red-400">▼ -%2</span>}
                {item.trend === 'stable' && <span className="text-gray-400">▬ %0</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-3 bg-[#050a14] border-t border-[#1e293b] text-center">
        <Link href="/values" className="inline-flex items-center justify-center gap-1 w-full py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black rounded-[2px] uppercase tracking-wider transition-colors">
          Tüm Piyasayı Gör <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
