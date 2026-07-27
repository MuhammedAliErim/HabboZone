'use client';

import React, { useState } from 'react';
import { Trophy, Users, Plus, Trash2, Sparkles, RefreshCw, Volume2, Award } from 'lucide-react';

export default function WheelOfFortuneTool() {
  const [participants, setParticipants] = useState<string[]>([
    'MuhammedAliErim',
    'HabboYildizi',
    'MimarBey',
    'SiberKedi',
    'Kralice99',
    'LuksLord'
  ]);
  const [newName, setNewName] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleAddName = () => {
    if (!newName.trim() || participants.includes(newName.trim())) return;
    setParticipants([...participants, newName.trim()]);
    setNewName('');
  };

  const handleRemoveName = (name: string) => {
    setParticipants(participants.filter(p => p !== name));
  };

  const handleClearAll = () => {
    setParticipants([]);
    setWinner(null);
  };

  const spinWheel = () => {
    if (spinning || participants.length < 2) return;
    setSpinning(true);
    setWinner(null);

    // Pick a winner deterministically based on random click event
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];

    // Calculate rotation: 5 full spins (1800 deg) + exact angle of winner
    const sliceAngle = 360 / participants.length;
    const targetAngle = 360 - (randomIndex * sliceAngle + sliceAngle / 2);
    const newRotation = rotation + 1800 + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWinner(selectedWinner);
    }, 4000); // 4s spin animation
  };

  // Pre-calculated colors for slices
  const SLICE_COLORS = ['#e11d48', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Üst Bilgi */}
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 flex items-center justify-between gap-4 shadow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-[#facc15] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">HABBO ÇEKİLİŞ & ŞANS ÇARKI</h3>
            <p className="text-xs text-gray-300 font-medium mt-0.5">Oda turnuvaları, sandalye kapmaca ve rozet çekilişlerinde kazananları adil bir şekilde belirleyin!</p>
          </div>
        </div>
        <div className="text-right shrink-0 bg-[#050a14] px-4 py-2 rounded-[2px] border border-[#1e293b]">
          <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block">KATILIMCI SAYISI</span>
          <span className="text-sm font-black text-[#facc15]">{participants.length} Kişi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* SOL: ÇARK ALANI (7 Kolon) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center py-6 habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] relative overflow-hidden min-h-[340px] shadow">
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent pointer-events-none"></div>

          {/* Wheel Pointer */}
          <div className="absolute top-4 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-400 drop-shadow-[0_2px_8px_rgba(250,204,21,0.8)]"></div>

          {/* The Spinning Wheel */}
          <div 
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-yellow-400/80 shadow-[0_0_40px_rgba(244,114,182,0.3)] relative flex items-center justify-center overflow-hidden transition-transform cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transitionDuration: spinning ? '4000ms' : '0ms'
            }}
          >
            {participants.length === 0 ? (
              <div className="text-center p-6 text-gray-400 text-xs font-black uppercase tracking-wider">Katılımcı eklenmedi</div>
            ) : (
              participants.map((name, i) => {
                const angle = (360 / participants.length) * i;
                const color = SLICE_COLORS[i % SLICE_COLORS.length];
                return (
                  <div
                    key={i}
                    className="absolute w-1/2 h-8 top-1/2 left-1/2 -translate-y-1/2 origin-left flex items-center pl-4 font-black text-xs text-white uppercase tracking-wider drop-shadow-md truncate pr-2"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      backgroundColor: participants.length <= 8 ? color : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.15)'
                    }}
                  >
                    <span className="truncate max-w-[90px]">{name}</span>
                  </div>
                );
              })
            )}
            
            {/* Center Cap */}
            <div className="w-14 h-14 rounded-full bg-[#0a1325] border-2 border-yellow-400 flex items-center justify-center z-10 shadow-lg">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-spin-slow" />
            </div>
          </div>

          {/* Winner Banner */}
          {winner && (
            <div className="mt-6 px-6 py-3 bg-[#facc15] rounded-[2px] border border-[#1e293b] text-black font-black text-center shadow-xl animate-in zoom-in-50 duration-300 flex items-center gap-2 uppercase tracking-tight text-xs">
              <Award className="w-4 h-4 text-black" />
              <span>KAZANAN: <strong className="underline text-black drop-shadow">{winner}</strong></span>
              <Award className="w-4 h-4 text-black" />
            </div>
          )}

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={spinning || participants.length < 2}
            className={`mt-6 px-8 py-3 rounded-[2px] font-black text-xs uppercase tracking-wider shadow flex items-center gap-2 transition-all ${
              spinning || participants.length < 2
                ? 'bg-[#050a14] border border-[#1e293b] text-gray-500 cursor-not-allowed'
                : 'bg-[#ec4899] hover:bg-[#db2777] border border-[#db2777] text-white'
            }`}
          >
            {spinning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4 text-white" />}
            {spinning ? 'ÇARK DÖNÜYOR...' : 'ÇARKI ÇEVİR & KAZANANI SEÇ'}
          </button>
        </div>

        {/* SAĞ: KATILIMCI LİSTESİ (5 Kolon) */}
        <div className="md:col-span-5 habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 space-y-4 max-h-[420px] flex flex-col shadow">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#ec4899] flex items-center gap-1.5">
              <Users className="w-4 h-4" /> KATILIMCILAR ({participants.length})
            </span>
            <button
              onClick={handleClearAll}
              className="text-[11px] text-gray-400 hover:text-red-400 font-black uppercase tracking-tight transition-colors"
            >
              TEMİZLE
            </button>
          </div>

          {/* Ekleme Girdisi */}
          <div className="flex gap-1.5 shrink-0">
            <input
              type="text"
              placeholder="Habbo Adı (Örn: MimarBey)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddName()}
              className="flex-1 bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs text-white font-black focus:outline-none focus:border-[#ec4899]"
            />
            <button
              onClick={handleAddName}
              className="bg-[#ec4899] hover:bg-[#db2777] border border-[#db2777] text-white font-black px-4 py-2 rounded-[2px] text-xs flex items-center gap-1 transition-colors shadow uppercase"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Liste */}
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {participants.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs font-bold bg-[#050a14] rounded-[2px] border border-[#1e293b]">Listede isim yok. Yukarıdan ekleyin.</div>
            ) : (
              participants.map((name, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#050a14] border border-[#1e293b] px-3 py-2 rounded-[2px] text-xs hover:border-[#ec4899]/50 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-[2px] bg-[#0a1325] border border-[#1e293b] flex items-center justify-center text-[10px] font-black text-gray-300 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-black text-white truncate uppercase tracking-tight">{name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveName(name)}
                    className="text-gray-500 hover:text-red-400 p-1 shrink-0 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
