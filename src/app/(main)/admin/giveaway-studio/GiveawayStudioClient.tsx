'use client';

import React, { useState } from 'react';
import { Trophy, Gift, Users, Award, Sparkles, Copy, Check, RefreshCw, ChevronRight, Swords, Flame, Crown, Share2 } from 'lucide-react';
import Image from 'next/image';

interface Match {
  id: string;
  round: 'quarter' | 'semi' | 'final';
  player1: string;
  player2: string;
  winner?: string;
}

export default function GiveawayStudioClient() {
  const [activeTab, setActiveTab] = useState<'giveaway' | 'bracket'>('giveaway');

  // --- ÇEKİLİŞ & KURA STATE ---
  const [giveawayTitle, setGiveawayTitle] = useState('Büyük Kış Masalı Nadire Çekilişi');
  const [prizeDesc, setPrizeDesc] = useState('Safir Ejderha Lambası + 250 Kredi + 3 Aylık VIP Üyelik');
  const [participantsText, setParticipantsText] = useState('MuhammedAliErim\nHabboYildizi\nMimarBey\nSiberKedi\nKralice99\nLuksLord\nPikselKral\nGeceMavisi\nNeonAvci\nRozetMaster');
  const [winnerCount, setWinnerCount] = useState(2);
  const [backupCount, setBackupCount] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [mainWinners, setMainWinners] = useState<string[]>([]);
  const [backupWinners, setBackupWinners] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // --- TURNUVA BRACKET STATE (8 KİŞİLİK) ---
  const [tournamentTitle, setTournamentTitle] = useState('HabboZone 1v1 Sandalye Kapmaca Şampiyonası');
  const [matches, setMatches] = useState<Match[]>([
    // Çeyrek Finaller (4 Maç)
    { id: 'q1', round: 'quarter', player1: 'MuhammedAliErim', player2: 'SiberKedi' },
    { id: 'q2', round: 'quarter', player1: 'MimarBey', player2: 'LuksLord' },
    { id: 'q3', round: 'quarter', player1: 'HabboYildizi', player2: 'RozetMaster' },
    { id: 'q4', round: 'quarter', player1: 'Kralice99', player2: 'PikselKral' },
    // Yarı Finaller (2 Maç)
    { id: 's1', round: 'semi', player1: '?', player2: '?' },
    { id: 's2', round: 'semi', player1: '?', player2: '?' },
    // Büyük Final (1 Maç)
    { id: 'f1', round: 'final', player1: '?', player2: '?' }
  ]);
  const [champion, setChampion] = useState<string | null>(null);

  // --- ÇEKİLİŞ FONKSİYONLARI (React 19 Pure Handler) ---
  const handleDrawWinners = () => {
    const list = participantsText.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    if (list.length < winnerCount + backupCount) {
      alert('Katılımcı sayısı, toplam kazanan (asil + yedek) sayısından az olamaz!');
      return;
    }

    setDrawing(true);
    setMainWinners([]);
    setBackupWinners([]);

    setTimeout(() => {
      // Deterministic shuffling algorithm inside handler
      const shuffled = [...list].sort(() => Math.random() - 0.5);
      const asil = shuffled.slice(0, winnerCount);
      const yedek = shuffled.slice(winnerCount, winnerCount + backupCount);

      setMainWinners(asil);
      setBackupWinners(yedek);
      setDrawing(false);
    }, 1800);
  };

  // --- TURNUVA MAÇ KAZANAN SEÇME FONKSİYONU ---
  const handleSelectWinner = (matchId: string, winnerName: string) => {
    if (winnerName === '?' || !winnerName) return;

    const updated = matches.map(m => m.id === matchId ? { ...m, winner: winnerName } : m);

    // Çeyrek finalden yarı finale aktar
    if (matchId === 'q1') {
      const s1 = updated.find(m => m.id === 's1');
      if (s1) s1.player1 = winnerName;
    } else if (matchId === 'q2') {
      const s1 = updated.find(m => m.id === 's1');
      if (s1) s1.player2 = winnerName;
    } else if (matchId === 'q3') {
      const s2 = updated.find(m => m.id === 's2');
      if (s2) s2.player1 = winnerName;
    } else if (matchId === 'q4') {
      const s2 = updated.find(m => m.id === 's2');
      if (s2) s2.player2 = winnerName;
    }
    // Yarı finalden finale aktar
    else if (matchId === 's1') {
      const f1 = updated.find(m => m.id === 'f1');
      if (f1) f1.player1 = winnerName;
    } else if (matchId === 's2') {
      const f1 = updated.find(m => m.id === 'f1');
      if (f1) f1.player2 = winnerName;
    }
    // Final maçı ise Şampiyonu belirle
    else if (matchId === 'f1') {
      setChampion(winnerName);
    }

    setMatches(updated);
  };

  const handleResetBracket = () => {
    setMatches([
      { id: 'q1', round: 'quarter', player1: 'MuhammedAliErim', player2: 'SiberKedi' },
      { id: 'q2', round: 'quarter', player1: 'MimarBey', player2: 'LuksLord' },
      { id: 'q3', round: 'quarter', player1: 'HabboYildizi', player2: 'RozetMaster' },
      { id: 'q4', round: 'quarter', player1: 'Kralice99', player2: 'PikselKral' },
      { id: 's1', round: 'semi', player1: '?', player2: '?' },
      { id: 's2', round: 'semi', player1: '?', player2: '?' },
      { id: 'f1', round: 'final', player1: '?', player2: '?' }
    ]);
    setChampion(null);
  };

  // --- HTML EMBED KOD GABLO GENERATOR ---
  const generateEmbedCode = () => {
    if (activeTab === 'giveaway') {
      const html = `<div style="background:#0a1224;border:2px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;color:#fff;font-family:sans-serif;max-width:550px;margin:20px auto;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
  <div style="display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:12px;margin-bottom:16px;">
    <span style="font-size:28px;">🎁</span>
    <div>
      <h3 style="margin:0;font-size:16px;color:#facc15;font-weight:900;">${giveawayTitle}</h3>
      <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Ödül: <strong>${prizeDesc}</strong></p>
    </div>
  </div>
  <div style="margin-bottom:16px;">
    <span style="font-size:11px;color:#38bdf8;font-weight:bold;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:8px;">🏆 ASİL KAZANANLAR</span>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${mainWinners.map(w => `<div style="background:#0f172a;border:1px solid #0ea5e9;padding:6px 12px;border-radius:6px;font-weight:bold;font-size:13px;color:#fff;">👑 ${w}</div>`).join('')}
    </div>
  </div>
  ${backupWinners.length > 0 ? `<div>
    <span style="font-size:11px;color:#f43f5e;font-weight:bold;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:8px;">⏳ YEDEK TALİHLİLER</span>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${backupWinners.map(w => `<div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);padding:6px 12px;border-radius:6px;font-size:12px;color:#cbd5e1;">⭐ ${w}</div>`).join('')}
    </div>
  </div>` : ''}
  <div style="margin-top:16px;padding-top:12px;border-top:1px dashed rgba(255,255,255,0.1);font-size:10px;color:#64748b;text-align:right;">
    🔒 HabboZone Çekiliş Motoru v2.0 ile doğrulandı.
  </div>
</div>`;
      navigator.clipboard.writeText(html);
    } else {
      const html = `<div style="background:#0a1224;border:2px solid #f59e0b;border-radius:12px;padding:20px;color:#fff;font-family:sans-serif;max-width:550px;margin:20px auto;text-align:center;">
  <span style="font-size:32px;display:block;margin-bottom:8px;">🏆</span>
  <h3 style="margin:0;font-size:18px;color:#f59e0b;font-weight:900;">${tournamentTitle}</h3>
  <p style="margin:4px 0 16px;font-size:12px;color:#94a3b8;">Resmi Turnuva Sonuçları</p>
  ${champion ? `<div style="background:linear-gradient(135deg,#b45309,#d97706);padding:12px;border-radius:8px;font-weight:900;font-size:16px;color:#fff;box-shadow:0 4px 15px rgba(245,158,11,0.4);">
    👑 ŞAMPİYON: ${champion} 👑
  </div>` : '<div style="color:#cbd5e1;font-size:13px;">Turnuva devam ediyor...</div>'}
  <div style="margin-top:16px;font-size:10px;color:#64748b;">⚔️ HabboZone Turnuva Stüdyosu ile oluşturuldu.</div>
</div>`;
      navigator.clipboard.writeText(html);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-white">
      
      {/* Üst Header */}
      <div className="bg-gradient-to-r from-[#0a1224] via-[#111c35] to-[#0a1224] border-2 border-amber-500/30 rounded-[3px] p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-[3px] bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300">
            <Trophy className="w-8 h-8 text-black animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                Yönetim Stüdyosu v2.0
              </span>
              <span className="text-xs text-gray-400 font-medium">CANLI KURA & TURNUVA</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              Turnuva & Çekiliş Komuta Merkezi
            </h1>
            <p className="text-xs text-gray-300">
              Oda etkinlikleri, rozet kuraları ve 1v1 turnuva eşleşme şemalarını saniyeler içinde yönetip habere gömün.
            </p>
          </div>
        </div>

        {/* Sekme Değiştirici Butonlar */}
        <div className="flex bg-[#050a14] p-1.5 rounded-[3px] border border-[#1e293b] shrink-0 relative z-10">
          <button
            onClick={() => setActiveTab('giveaway')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[2px] font-black text-xs transition-all ${
              activeTab === 'giveaway'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" /> ÇEKİLİŞ & KURA MOTORU
          </button>
          <button
            onClick={() => setActiveTab('bracket')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[2px] font-black text-xs transition-all ${
              activeTab === 'bracket'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" /> TURNUVA AĞACI (BRACKET)
          </button>
        </div>
      </div>

      {/* SEKME 1: ÇEKİLİŞ MOTORU */}
      {activeTab === 'giveaway' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sol Panel: Ayarlar */}
          <div className="lg:col-span-5 bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <Gift className="w-4 h-4" /> 1. Çekiliş Ayarları & Katılımcılar
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Çekiliş Başlığı</label>
              <input
                type="text"
                value={giveawayTitle}
                onChange={(e) => setGiveawayTitle(e.target.value)}
                className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Ödül Tanımı</label>
              <input
                type="text"
                value={prizeDesc}
                onChange={(e) => setPrizeDesc(e.target.value)}
                className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-3 py-2 text-xs text-yellow-300 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Asil Kazanan Sayısı</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={winnerCount}
                  onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-3 py-2 text-xs text-white font-black text-center focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Yedek Talihli Sayısı</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={backupCount}
                  onChange={(e) => setBackupCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-3 py-2 text-xs text-white font-black text-center focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Katılımcı Listesi <span className="text-gray-500 font-normal">(Her satıra bir Habbo adı)</span>
              </label>
              <textarea
                rows={6}
                value={participantsText}
                onChange={(e) => setParticipantsText(e.target.value)}
                className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-amber-500"
              />
              <div className="text-[11px] text-gray-400 mt-1 flex justify-between">
                <span>Toplam Katılımcı: <strong className="text-amber-400">{participantsText.split('\n').filter(p => p.trim().length > 0).length}</strong> kişi</span>
              </div>
            </div>

            <button
              onClick={handleDrawWinners}
              disabled={drawing}
              className={`w-full py-3.5 rounded-[3px] font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                drawing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:scale-[1.02] text-black shadow-amber-500/25'
              }`}
            >
              {drawing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {drawing ? 'KURA ÇEKİLİYOR... (TALİHLİLER BELİRLENİYOR)' : '🎁 KURAYI ÇEK & KAZANANLARI BELİRLE'}
            </button>
          </div>

          {/* Sağ Panel: Canlı Sertifika & Sonuç Önizleme */}
          <div className="lg:col-span-7 bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 flex flex-col justify-between shadow-xl min-h-[460px]">
            <div>
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-6">
                <span className="text-sm font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" /> 2. Resmi Sonuç Sertifikası & Önizleme
                </span>
                <button
                  onClick={generateEmbedCode}
                  disabled={mainWinners.length === 0}
                  className="habbo-button secondary text-white font-bold px-3 py-1.5 rounded-[2px] text-xs flex items-center gap-1.5 transition-all"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                  {copiedCode ? 'HTML KOPYALANDI!' : 'HABER EMBED KODUNU AL'}
                </button>
              </div>

              {/* Sonuç Kartı Alanı */}
              {drawing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                  <span className="text-sm font-black text-amber-400 uppercase tracking-widest animate-pulse">Habbo rastgelelik algoritmaları çalışıyor...</span>
                </div>
              ) : mainWinners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#1e293b] rounded-[3px] bg-[#050a14]/50">
                  <Gift className="w-12 h-12 text-gray-600 mb-3" />
                  <h4 className="text-base font-bold text-gray-400">Henüz Kura Çekilmedi</h4>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">Sol paneli kullanarak katılımcılarınızı ayarlayın ve "Kurayı Çek" butonuna basarak sertifikanızı oluşturun.</p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#070e1d] via-[#0a1428] to-[#070e1d] border-2 border-amber-500/50 rounded-[3px] p-6 shadow-2xl relative overflow-hidden space-y-6">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
                  
                  {/* Başlık */}
                  <div className="flex items-center gap-4 border-b border-[#1e293b] pb-4">
                    <div className="w-12 h-12 rounded-[3px] bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                      🎉
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{giveawayTitle}</h3>
                      <p className="text-xs text-amber-300 font-bold mt-0.5">Ödül: {prizeDesc}</p>
                    </div>
                  </div>

                  {/* Asil Kazananlar */}
                  <div className="space-y-3">
                    <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-yellow-400" /> ASİL KAZANAN TALİHLİLER
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mainWinners.map((w, i) => (
                        <div key={i} className="bg-[#050a14] border border-cyan-500/40 rounded-[3px] p-3 flex items-center gap-3 shadow-lg">
                          <div className="w-10 h-10 rounded-[2px] bg-[#0a1325] border border-[#1e293b] overflow-hidden relative shrink-0">
                            <Image
                              src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${w}&action=std&direction=2&head_direction=2&gesture=sml&size=m`}
                              alt={w}
                              fill
                              className="object-contain object-top pt-1"
                              unoptimized
                            />
                          </div>
                          <div className="truncate">
                            <span className="text-[10px] text-cyan-400 font-black block">#{i+1} ASİL KAZANAN</span>
                            <span className="text-sm font-black text-white truncate block">{w}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Yedek Kazananlar */}
                  {backupWinners.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-black uppercase text-rose-400 tracking-wider block">
                        ⏳ YEDEK TALİHLİLER
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {backupWinners.map((w, i) => (
                          <div key={i} className="bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-1.5 text-xs font-bold text-gray-300 flex items-center gap-1.5">
                            <span className="text-rose-400 font-black">Y{i+1}:</span> {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mühür */}
                  <div className="pt-3 border-t border-dashed border-[#1e293b] flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">🔒 HabboZone Kura Algoritması ile mühürlendi.</span>
                    <span className="text-amber-400 font-bold">RESMİ SONUÇ</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1e293b] text-xs text-gray-400 flex items-center justify-between">
              <span>İpucu: Sonuç kartını habere eklemek için yukarıdaki "HTML EMBED KODUNU AL" butonunu kullanın.</span>
            </div>
          </div>
        </div>
      )}

      {/* SEKME 2: TURNUVA BRACKET AĞACI */}
      {activeTab === 'bracket' && (
        <div className="bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-pink-400" /> 8 Kişilik 1v1 Eşleşme ve Turnuva Şeması
              </h3>
              <p className="text-xs text-gray-400">Maç kartlarında kazanan oyuncunun üzerine tıklayarak onu bir üst tura (Yarı Final / Final) taşıyın.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetBracket}
                className="bg-[#050a14] hover:bg-red-500/20 hover:text-red-300 border border-[#1e293b] text-gray-300 font-bold px-3 py-1.5 rounded-[2px] text-xs transition-all"
              >
                Şemayı Sıfırla
              </button>
              <button
                onClick={generateEmbedCode}
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white font-bold px-4 py-1.5 rounded-[2px] text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/20"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copiedCode ? 'KOPYALANDI!' : 'TURNUVA ŞEMASINI PAYLAŞ'}
              </button>
            </div>
          </div>

          {/* Tournament Grid (3 Sütun: Çeyrek -> Yarı -> Final -> Şampiyon) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center py-4">
            
            {/* SÜTUN 1: Çeyrek Finaller (4 Maç) */}
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 block text-center bg-[#050a14] py-1.5 rounded-[2px] border border-[#1e293b]">
                Çeyrek Finaller
              </span>
              {matches.filter(m => m.round === 'quarter').map(match => (
                <div key={match.id} className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-2.5 space-y-1.5 shadow">
                  <div 
                    onClick={() => handleSelectWinner(match.id, match.player1)}
                    className={`p-2 rounded-[2px] flex items-center justify-between cursor-pointer transition-all text-xs font-bold ${
                      match.winner === match.player1 
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-black' 
                        : 'bg-[#0a1325] hover:bg-[#111f3d] text-gray-300'
                    }`}
                  >
                    <span className="truncate">{match.player1}</span>
                    {match.winner === match.player1 && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-center font-black text-gray-600 uppercase">VS</div>
                  <div 
                    onClick={() => handleSelectWinner(match.id, match.player2)}
                    className={`p-2 rounded-[2px] flex items-center justify-between cursor-pointer transition-all text-xs font-bold ${
                      match.winner === match.player2 
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-black' 
                        : 'bg-[#0a1325] hover:bg-[#111f3d] text-gray-300'
                    }`}
                  >
                    <span className="truncate">{match.player2}</span>
                    {match.winner === match.player2 && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>

            {/* SÜTUN 2: Yarı Finaller (2 Maç) */}
            <div className="space-y-12">
              <span className="text-xs font-black uppercase tracking-wider text-pink-400 block text-center bg-pink-500/10 py-1.5 rounded-[2px] border border-pink-500/20">
                Yarı Finaller
              </span>
              {matches.filter(m => m.round === 'semi').map(match => (
                <div key={match.id} className="bg-[#050a14] border-2 border-pink-500/30 rounded-[3px] p-3 space-y-2 shadow-lg">
                  <div 
                    onClick={() => handleSelectWinner(match.id, match.player1)}
                    className={`p-2 rounded-[2px] flex items-center justify-between cursor-pointer transition-all text-xs font-bold ${
                      match.winner === match.player1 && match.player1 !== '?'
                        ? 'bg-pink-500/20 border border-pink-500/50 text-pink-300 font-black' 
                        : 'bg-[#0a1325] hover:bg-[#111f3d] text-gray-300'
                    }`}
                  >
                    <span className="truncate">{match.player1}</span>
                    {match.winner === match.player1 && match.player1 !== '?' && <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-center font-black text-pink-500/50 uppercase">YARI FİNAL</div>
                  <div 
                    onClick={() => handleSelectWinner(match.id, match.player2)}
                    className={`p-2 rounded-[2px] flex items-center justify-between cursor-pointer transition-all text-xs font-bold ${
                      match.winner === match.player2 && match.player2 !== '?'
                        ? 'bg-pink-500/20 border border-pink-500/50 text-pink-300 font-black' 
                        : 'bg-[#0a1325] hover:bg-[#111f3d] text-gray-300'
                    }`}
                  >
                    <span className="truncate">{match.player2}</span>
                    {match.winner === match.player2 && match.player2 !== '?' && <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>

            {/* SÜTUN 3: Büyük Final (1 Maç) */}
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block text-center bg-amber-500/10 py-1.5 rounded-[2px] border border-amber-500/20 animate-pulse">
                🔥 BÜYÜK FİNAL
              </span>
              {matches.filter(m => m.round === 'final').map(match => (
                <div key={match.id} className="bg-gradient-to-b from-[#0a1325] to-[#070e1d] border-2 border-amber-500/60 rounded-[3px] p-4 space-y-3 shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                  
                  <div 
                    onClick={() => handleSelectWinner(match.id, match.player1)}
                    className={`p-3 rounded-[3px] flex items-center justify-between cursor-pointer transition-all text-sm font-extrabold ${
                      match.winner === match.player1 && match.player1 !== '?'
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' 
                        : 'bg-[#050a14] hover:bg-[#0f1b36] text-gray-200 border border-[#1e293b]'
                    }`}
                  >
                    <span className="truncate">{match.player1}</span>
                    {match.winner === match.player1 && match.player1 !== '?' && <Crown className="w-4 h-4 text-black shrink-0" />}
                  </div>

                  <div className="text-xs text-center font-black text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500 animate-bounce" /> ŞAMPİYONLUK MAÇI <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                  </div>

                  <div 
                    onClick={() => handleSelectWinner(match.id, match.player2)}
                    className={`p-3 rounded-[3px] flex items-center justify-between cursor-pointer transition-all text-sm font-extrabold ${
                      match.winner === match.player2 && match.player2 !== '?'
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' 
                        : 'bg-[#050a14] hover:bg-[#0f1b36] text-gray-200 border border-[#1e293b]'
                    }`}
                  >
                    <span className="truncate">{match.player2}</span>
                    {match.winner === match.player2 && match.player2 !== '?' && <Crown className="w-4 h-4 text-black shrink-0" />}
                  </div>
                </div>
              ))}
            </div>

            {/* SÜTUN 4: Şampiyon Podyumu */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-t from-amber-950/40 via-[#0a1428] to-[#0a1224] border-2 border-amber-400 rounded-[3px] text-center shadow-[0_0_30px_rgba(245,158,11,0.2)] min-h-[260px] relative">
              <Crown className="w-12 h-12 text-yellow-400 animate-bounce mb-2 drop-shadow-[0_2px_10px_rgba(250,204,21,0.6)]" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">TURNUVA ŞAMPİYONU</span>
              
              {champion && champion !== '?' ? (
                <div className="mt-4 space-y-2 animate-in zoom-in-50 duration-300">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 mx-auto overflow-hidden relative shadow-lg">
                    <Image
                      src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${champion}&action=std&direction=2&head_direction=2&gesture=sml&size=l`}
                      alt={champion}
                      fill
                      className="object-contain object-top pt-2"
                      unoptimized
                    />
                  </div>
                  <h4 className="text-lg font-black text-white underline decoration-amber-400 decoration-2">{champion}</h4>
                  <span className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[10px] px-3 py-1 rounded-[2px] uppercase tracking-wider shadow">
                    👑 1. LİK ÖDÜLÜ SAHİBİ
                  </span>
                </div>
              ) : (
                <div className="mt-6 text-xs text-gray-500 font-medium max-w-[140px]">
                  Büyük final maçının kazananını seçtiğinizde şampiyon burada taçlanacak!
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
