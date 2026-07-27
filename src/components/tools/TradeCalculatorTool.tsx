'use client';

import React, { useState } from 'react';
import { Gem, Coins, Plus, Trash2, ArrowRightLeft, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Copy, Check } from 'lucide-react';

interface TradeItem {
  id: string;
  name: string;
  credits: number;
  diamonds: number;
  icon: string;
}

const POPULAR_RARES: TradeItem[] = [
  { id: '1', name: 'Altın Lüks Taç', credits: 150, diamonds: 150, icon: '👑' },
  { id: '2', name: 'Safir Ejderha Lambası', credits: 450, diamonds: 250, icon: '🐉' },
  { id: '3', name: 'Dumanlı Ejderha', credits: 850, diamonds: 500, icon: '🐲' },
  { id: '4', name: 'Lazer Kapı (Kırmızı)', credits: 35, diamonds: 10, icon: '🚪' },
  { id: '5', name: 'Buz Makinesi (Turkuaz)', credits: 65, diamonds: 25, icon: '🧊' },
  { id: '6', name: 'Lüks Kral Tahtı', credits: 120, diamonds: 50, icon: '🪑' },
  { id: '7', name: 'Gül Demeti (Romantik)', credits: 25, diamonds: 5, icon: '🌹' },
  { id: '8', name: 'Siber Koyu Gözlük', credits: 45, diamonds: 15, icon: '👓' },
  { id: '9', name: 'Gökkuşağı Şemsiyesi', credits: 80, diamonds: 30, icon: '☂️' },
  { id: '10', name: 'Sihirli Ayak İzi Efekti', credits: 200, diamonds: 100, icon: '✨' }
];

export default function TradeCalculatorTool() {
  const [myOffer, setMyOffer] = useState<{ item: TradeItem; qty: number }[]>([
    { item: POPULAR_RARES[0], qty: 1 }, // Altın Taç
    { item: POPULAR_RARES[3], qty: 2 }  // 2x Lazer Kapı
  ]);

  const [theirOffer, setTheirOffer] = useState<{ item: TradeItem; qty: number }[]>([
    { item: POPULAR_RARES[1], qty: 1 }  // Safir Ejderha
  ]);

  const [selectedMyItemId, setSelectedMyItemId] = useState('2');
  const [selectedTheirItemId, setSelectedTheirItemId] = useState('3');
  const [copied, setCopied] = useState(false);

  // Toplam Değer Hesaplamaları
  const calculateTotal = (offer: { item: TradeItem; qty: number }[]) => {
    return offer.reduce((acc, curr) => {
      const c = acc.credits + curr.item.credits * curr.qty;
      const d = acc.diamonds + curr.item.diamonds * curr.qty;
      // 1 Elmas yaklaşık 1.5 Kredi eşdeğeri olarak toplam pazar endeksi
      const index = c + Math.round(d * 1.5);
      return { credits: c, diamonds: d, index };
    }, { credits: 0, diamonds: 0, index: 0 });
  };

  const myTotal = calculateTotal(myOffer);
  const theirTotal = calculateTotal(theirOffer);

  const diffIndex = theirTotal.index - myTotal.index;
  const diffPercent = myTotal.index > 0 ? Math.round((diffIndex / myTotal.index) * 100) : 0;

  const addToMyOffer = () => {
    const item = POPULAR_RARES.find(i => i.id === selectedMyItemId);
    if (!item) return;
    const existingIndex = myOffer.findIndex(x => x.item.id === item.id);
    if (existingIndex > -1) {
      const updated = [...myOffer];
      updated[existingIndex].qty += 1;
      setMyOffer(updated);
    } else {
      setMyOffer([...myOffer, { item, qty: 1 }]);
    }
  };

  const addToTheirOffer = () => {
    const item = POPULAR_RARES.find(i => i.id === selectedTheirItemId);
    if (!item) return;
    const existingIndex = theirOffer.findIndex(x => x.item.id === item.id);
    if (existingIndex > -1) {
      const updated = [...theirOffer];
      updated[existingIndex].qty += 1;
      setTheirOffer(updated);
    } else {
      setTheirOffer([...theirOffer, { item, qty: 1 }]);
    }
  };

  const removeFromOffer = (side: 'my' | 'their', index: number) => {
    if (side === 'my') {
      const updated = [...myOffer];
      updated.splice(index, 1);
      setMyOffer(updated);
    } else {
      const updated = [...theirOffer];
      updated.splice(index, 1);
      setTheirOffer(updated);
    }
  };

  const handleCopyAnalysis = () => {
    const text = `⚖️ HABBOZONE TAKAS ANALİZİ ⚖️\n\n📌 BENİM TEKLİFİM (${myTotal.credits}c + ${myTotal.diamonds} Elmas):\n` +
      myOffer.map(o => `• ${o.qty}x ${o.item.name} (${o.item.credits * o.qty}c)`).join('\n') +
      `\n\n📌 KARŞI TEKLİF (${theirTotal.credits}c + ${theirTotal.diamonds} Elmas):\n` +
      theirOffer.map(o => `• ${o.qty}x ${o.item.name} (${o.item.credits * o.qty}c)`).join('\n') +
      `\n\n📊 SONUÇ: ${diffIndex > 0 ? '🟢 KAZANÇLI TAKAS (+' + diffPercent + '%)' : diffIndex < 0 ? '🔴 ZARARLI TAKAS (' + diffPercent + '%)' : '🟡 ADİL DEĞER TAKASI'}\n🔗 HabboZone Takas Hesaplayıcı ile oluşturuldu.`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Üst Bilgi */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-[#facc15] shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">CANLI NADİRE TAKAS DEĞER HESAPLAYICISI</h3>
            <p className="text-xs text-gray-300 font-medium mt-0.5">Teklifleri sepetinize ekleyin; Kredi ve Elmas endeksine göre kâr/zarar durumunu görün.</p>
          </div>
        </div>
        <button
          onClick={handleCopyAnalysis}
          className="bg-[#050a14] hover:bg-[#1e293b] border border-[#1e293b] hover:border-[#facc15] text-white font-black px-4 py-2 rounded-[2px] text-xs flex items-center gap-1.5 transition-colors shrink-0 uppercase tracking-tight shadow"
        >
          {copied ? <Check className="w-4 h-4 text-[#22c55e]" /> : <Copy className="w-4 h-4 text-[#3b82f6]" />}
          {copied ? 'ANALİZ KOPYALANDI!' : 'SONUCU KOPYALA / PAYLAŞ'}
        </button>
      </div>

      {/* 2 Kolonlu Sepet (Benim Teklifim vs Karşı Teklif) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* SOL: BENİM TEKLİFİM */}
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 space-y-4 shadow">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#22c55e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> SENİN VERDİKLERİN
            </span>
            <div className="text-right">
              <span className="text-xs font-black text-[#facc15]">{myTotal.credits} Kredi</span>
              <span className="text-[11px] text-[#3b82f6] ml-2 font-black">+ {myTotal.diamonds} Elmas</span>
            </div>
          </div>

          {/* Ekleme Kontrolü */}
          <div className="flex gap-2">
            <select
              value={selectedMyItemId}
              onChange={(e) => setSelectedMyItemId(e.target.value)}
              className="flex-1 bg-[#050a14] border border-[#1e293b] rounded-[2px] px-2.5 py-2 text-xs text-white font-black focus:outline-none focus:border-[#22c55e]"
            >
              {POPULAR_RARES.map(r => (
                <option key={r.id} value={r.id}>{r.icon} {r.name} ({r.credits}c + {r.diamonds}e)</option>
              ))}
            </select>
            <button
              onClick={addToMyOffer}
              className="bg-[#22c55e] hover:bg-[#16a34a] border border-[#16a34a] text-black font-black px-4 py-2 rounded-[2px] text-xs flex items-center gap-1 transition-colors shrink-0 shadow uppercase"
            >
              <Plus className="w-3.5 h-3.5" /> EKLE
            </button>
          </div>

          {/* Liste */}
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {myOffer.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs font-bold bg-[#050a14] rounded-[2px] border border-[#1e293b]">Sepet boş. Yukarıdan nadire ekleyin.</div>
            ) : (
              myOffer.map((o, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#050a14] border border-[#1e293b] px-3 py-2 rounded-[2px] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{o.item.icon}</span>
                    <span className="font-black text-white uppercase tracking-tight">{o.item.name}</span>
                    <span className="text-[10px] font-black text-[#22c55e] bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b]">x{o.qty}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#facc15] font-black">{o.item.credits * o.qty}c</span>
                    <button onClick={() => removeFromOffer('my', idx)} className="text-gray-500 hover:text-red-400 p-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAĞ: KARŞI TEKLİF */}
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 space-y-4 shadow">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#3b82f6] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> KARŞIDAN ALACAKLARIN
            </span>
            <div className="text-right">
              <span className="text-xs font-black text-[#facc15]">{theirTotal.credits} Kredi</span>
              <span className="text-[11px] text-[#3b82f6] ml-2 font-black">+ {theirTotal.diamonds} Elmas</span>
            </div>
          </div>

          {/* Ekleme Kontrolü */}
          <div className="flex gap-2">
            <select
              value={selectedTheirItemId}
              onChange={(e) => setSelectedTheirItemId(e.target.value)}
              className="flex-1 bg-[#050a14] border border-[#1e293b] rounded-[2px] px-2.5 py-2 text-xs text-white font-black focus:outline-none focus:border-[#3b82f6]"
            >
              {POPULAR_RARES.map(r => (
                <option key={r.id} value={r.id}>{r.icon} {r.name} ({r.credits}c + {r.diamonds}e)</option>
              ))}
            </select>
            <button
              onClick={addToTheirOffer}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] border border-[#3b82f6] text-white font-black px-4 py-2 rounded-[2px] text-xs flex items-center gap-1 transition-colors shrink-0 shadow uppercase"
            >
              <Plus className="w-3.5 h-3.5" /> EKLE
            </button>
          </div>

          {/* Liste */}
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {theirOffer.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs font-bold bg-[#050a14] rounded-[2px] border border-[#1e293b]">Sepet boş. Karşı tarafın eşyalarını ekleyin.</div>
            ) : (
              theirOffer.map((o, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#050a14] border border-[#1e293b] px-3 py-2 rounded-[2px] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{o.item.icon}</span>
                    <span className="font-black text-white uppercase tracking-tight">{o.item.name}</span>
                    <span className="text-[10px] font-black text-[#3b82f6] bg-[#0a1325] px-1.5 py-0.5 rounded-[2px] border border-[#1e293b]">x{o.qty}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#facc15] font-black">{o.item.credits * o.qty}c</span>
                    <button onClick={() => removeFromOffer('their', idx)} className="text-gray-500 hover:text-red-400 p-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ALT: TAKAS ANALİZİ BANNERI */}
      <div className={`habbo-box p-4 rounded-[3px] border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 shadow ${
        diffIndex > 30 
          ? 'bg-[#0a1325] border-[#22c55e] text-emerald-200'
          : diffIndex < -30
          ? 'bg-[#0a1325] border-[#ef4444] text-red-200'
          : 'bg-[#0a1325] border-[#facc15] text-yellow-200'
      }`}>
        <div className="flex items-center gap-3">
          {diffIndex > 30 ? (
            <CheckCircle2 className="w-8 h-8 text-[#22c55e] shrink-0" />
          ) : diffIndex < -30 ? (
            <AlertTriangle className="w-8 h-8 text-[#ef4444] shrink-0" />
          ) : (
            <Coins className="w-8 h-8 text-[#facc15] shrink-0" />
          )}
          <div>
            <div className="text-xs font-black uppercase tracking-wider">
              {diffIndex > 30 
                ? '🟢 KAZANÇLI & HARİKA TAKAS TEKLİFİ!' 
                : diffIndex < -30 
                ? '🔴 DİKKAT! ZARARLI TEKLİF (FAZLA ÖDEME)' 
                : '🟡 ADİL & DENGELİ TAKAS TEKLİFİ'}
            </div>
            <div className="text-xs text-gray-300 font-medium mt-1">
              {diffIndex > 30 
                ? `Bu takastan yaklaşık ~${diffIndex} Kredi değerinde (+%${diffPercent}) kârlı çıkıyorsunuz.` 
                : diffIndex < -30 
                ? `Karşı tarafın teklifi yaklaşık ~${Math.abs(diffIndex)} Kredi (${diffPercent}%) daha düşük!` 
                : 'Her iki tarafın teklifi de pazar endeksine göre neredeyse eşit değerde.'}
            </div>
          </div>
        </div>

        <div className="text-center sm:text-right shrink-0 bg-[#050a14] px-4 py-2 rounded-[2px] border border-[#1e293b]">
          <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block">FARK DEĞERİ</span>
          <span className={`text-sm font-black ${diffIndex > 0 ? 'text-[#22c55e]' : diffIndex < 0 ? 'text-[#ef4444]' : 'text-[#facc15]'}`}>
            {diffIndex > 0 ? `+${diffIndex} Kredi` : `${diffIndex} Kredi`}
          </span>
        </div>
      </div>

    </div>
  );
}
