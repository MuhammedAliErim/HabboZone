'use client';

import { useState } from 'react';
import { 
  CreditCard, User, Award, Copy, Check, Sparkles, Layers, Sliders, 
  Eye, RefreshCw, Palette, Layout, QrCode, Shield, Zap, Share2
} from 'lucide-react';
import Image from 'next/image';

const CARD_FORMATS = [
  { id: 'id_card', name: '👔 Resmi Yetkili Yaka Kartı (Staff ID)', width: 440, height: 260, aspect: 'max-w-[440px] aspect-[440/260]', desc: 'Yöneticiler, editörler ve birim sorumluları için kurumsal yaka kartı.' },
  { id: 'signature', name: '✍️ Forum İmza Kartı (Signature Bar)', width: 520, height: 160, aspect: 'max-w-[520px] aspect-[520/160]', desc: 'Forum mesajlarının altında veya profil sayfalarında kullanılan yatay imza barı.' },
  { id: 'vip_pass', name: '🎟️ VIP & Etkinlik Bilet Kartı (Event Pass)', width: 460, height: 220, aspect: 'max-w-[460px] aspect-[460/220]', desc: 'Özel oda partileri, turnuvalar ve çekilişler için VIP geçiş bileti.' },
];

const CARD_THEMES = [
  { id: 'gold', name: 'Habbo Altın Elite (VIP Gold)', bg: 'from-[#1c1303] via-[#332408] to-[#120c02]', border: 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]', badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50', accent: '#facc15' },
  { id: 'cyber', name: 'Siber Koyu Mavi (Cyber Dark)', bg: 'from-[#020e24] via-[#081e47] to-[#010817]', border: 'border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.3)]', badgeColor: 'bg-sky-400/20 text-sky-300 border-sky-400/50', accent: '#38bdf8' },
  { id: 'pink', name: 'Sakura Pembe (Staff Pink)', bg: 'from-[#240316] via-[#470a2c] to-[#14010b]', border: 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]', badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/50', accent: '#ec4899' },
  { id: 'purple', name: 'Lüks Mor (Royal Purple)', bg: 'from-[#170326] via-[#300a4e] to-[#0c0114]', border: 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/50', accent: '#a855f7' },
  { id: 'emerald', name: 'Zümrüt Yeşili (Matrix Green)', bg: 'from-[#021f14] via-[#063d28] to-[#01120b]', border: 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]', badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50', accent: '#34d399' },
];

const PRESET_BADGES = [
  { id: 'adm', name: 'Sistem Yöneticisi (ADM)', icon: 'https://images.habbo.com/c_images/album1584/ADM.gif' },
  { id: 'dev', name: 'Geliştirici (DEV)', icon: 'https://images.habbo.com/c_images/album1584/DEV.gif' },
  { id: 'vip', name: 'VIP Üye Rozeti', icon: 'https://images.habbo.com/c_images/album1584/VIP.gif' },
  { id: 'hc', name: 'Habbo Kulüp (HC)', icon: 'https://images.habbo.com/c_images/album1584/HC1.gif' },
  { id: 'staff', name: 'Habbo Staff (STAFF)', icon: 'https://images.habbo.com/c_images/album1584/STAFF.gif' },
  { id: 'trophy', name: 'Altın Başarı Kupası', icon: 'https://images.habbo.com/c_images/catalogue/icon_201.png' },
];

export default function IdStudioClient() {
  // Format & Theme States
  const [selectedFormat, setSelectedFormat] = useState(CARD_FORMATS[0]);
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);
  const [hologramOpacity, setHologramOpacity] = useState(0.4);

  // Text & Role States
  const [username, setUsername] = useState('MuhammedAliErim');
  const [roleTitle, setRoleTitle] = useState('SİSTEM KURUCUSU & GELİŞTİRİCİ');
  const [motto, setMotto] = useState('HabboZone En Gelişmiş Topluluk!');
  const [idNumber, setIdNumber] = useState('HZ-2026-001');
  const [department, setDepartment] = useState('Yazılım & Yönetim Birimi');

  // Avatar States
  const [avatarDirection, setAvatarDirection] = useState(3);
  const [avatarAction, setAvatarAction] = useState('wav');
  const [avatarSize, setAvatarSize] = useState<'m' | 'l'>('l');

  // Badge States
  const [selectedBadge, setSelectedBadge] = useState<{ id: string; name: string; icon: string } | null>(PRESET_BADGES[0]);
  const [customBadgeInput, setCustomBadgeInput] = useState('');

  // UI States
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'format' | 'avatar' | 'text' | 'badge'>('format');

  const getAvatarUrl = () => {
    return `https://www.habbo.com/habbo-imaging/avatarimage?user=${username || 'Habbo'}&direction=${avatarDirection}&head_direction=${avatarDirection}&action=${avatarAction}&size=${avatarSize}`;
  };

  // Generate Embed HTML
  const generateEmbedHtml = () => {
    const isId = selectedFormat.id === 'id_card';
    const isSig = selectedFormat.id === 'signature';
    
    return `<div style="position: relative; overflow: hidden; border-radius: 16px; border: 2px solid ${selectedTheme.accent}; box-shadow: 0 0 25px rgba(0,0,0,0.8); background: linear-gradient(135deg, #070c18 0%, #151e33 50%, #0a1020 100%); padding: 24px; max-width: ${selectedFormat.width}px; min-height: ${selectedFormat.height}px; display: flex; align-items: center; justify-content: space-between; font-family: sans-serif;">
  <div style="position: absolute; top: 0; right: 0; width: 200px; height: 200px; background: radial-gradient(circle, ${selectedTheme.accent}33 0%, transparent 70%); pointer-events: none;"></div>
  
  <div style="position: relative; z-index: 2; flex: 1; padding-right: 16px;">
    <div style="display: flex; items-center; gap: 8px; margin-bottom: 12px;">
      <span style="background: ${selectedTheme.accent}22; color: ${selectedTheme.accent}; border: 1px solid ${selectedTheme.accent}66; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; text-transform: uppercase;">${roleTitle}</span>
      <span style="color: #94a3b8; font-size: 11px; font-family: monospace;">#${idNumber}</span>
    </div>
    
    <h3 style="color: #ffffff; font-size: 26px; font-weight: 900; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${username}</h3>
    <p style="color: #cbd5e1; font-size: 13px; margin: 0 0 14px 0; font-style: italic; opacity: 0.9;">"${motto}"</p>
    
    <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
      ${selectedBadge ? `<img src="${selectedBadge.icon}" alt="Badge" style="height: 32px;" />` : ''}
      <div>
        <span style="display: block; font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">Birim & Organizasyon</span>
        <span style="font-size: 12px; color: #f8fafc; font-weight: 700;">${department}</span>
      </div>
    </div>
  </div>

  <div style="position: relative; z-index: 2; text-align: center; flex-shrink: 0;">
    <img src="${getAvatarUrl()}" alt="${username}" style="max-height: 150px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.7)); margin: -10px 0;" />
    <div style="font-size: 9px; color: ${selectedTheme.accent}; font-weight: 900; letter-spacing: 2px; margin-top: 4px;">HABBOZONE.COM</div>
  </div>
</div>`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateEmbedHtml());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* SOL KONTROL VE DÜZENLEME PANELİ (7 SÜTUN) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Sekme Menüsü */}
        <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-2 rounded-xl flex items-center justify-between gap-1 overflow-x-auto shadow-xl">
          <button
            onClick={() => setActiveTab('format')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'format' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layout size={16} /> Format & Tema
          </button>
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'avatar' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={16} /> Karakter (Avatar)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'text' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard size={16} /> Kart Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('badge')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'badge' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award size={16} /> Rozet & Sembol
          </button>
        </div>

        {/* TAB 1: FORMAT & TEMA */}
        {activeTab === 'format' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                <Layout size={14} /> Kart Boyutu & Kullanım Tipi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CARD_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedFormat.id === fmt.id
                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/10 scale-[1.02]'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="font-black text-xs text-white mb-1">{fmt.name}</div>
                    <div className="text-[10px] text-gray-400 leading-tight mb-2">{fmt.desc}</div>
                    <div className="text-[10px] font-mono font-bold text-yellow-400">{fmt.width}x{fmt.height} PX</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3 flex items-center gap-1.5">
                <Palette size={14} /> Kart Renk Teması & Glow Efekti
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CARD_THEMES.map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => setSelectedTheme(thm)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      selectedTheme.id === thm.id
                        ? 'bg-white/10 border-white text-white font-bold shadow-xl'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white font-medium'
                    }`}
                  >
                    <span className="text-xs">{thm.name}</span>
                    <span className="w-4 h-4 rounded-full border border-white/40 shadow-inner" style={{ backgroundColor: thm.accent }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sliders size={14} /> Hologram Parlaklık Yoğunluğu
                </label>
                <span className="text-xs font-mono text-yellow-400">%{Math.round(hologramOpacity * 100)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={hologramOpacity}
                onChange={(e) => setHologramOpacity(parseFloat(e.target.value))}
                className="w-full accent-purple-500 bg-[#050a14] rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: KARAKTER (AVATAR) */}
        {activeTab === 'avatar' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                Habbo Kullanıcı Adı (Avatar Çekimi İçin)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Örn: MuhammedAliErim"
                  className="flex-1 bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setUsername('MuhammedAliErim')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 rounded-xl transition-all"
                >
                  Sıfırla
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">
                Karakter Bakış Yönü
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setAvatarDirection(dir)}
                    className={`py-2.5 rounded-xl border text-xs font-black transition-all ${
                      avatarDirection === dir
                        ? 'bg-yellow-500/20 border-yellow-400 text-white shadow-md'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                  Karakter Eylemi (Animasyon)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'std', label: 'Duruş (Stand)' },
                    { id: 'wav', label: 'El Sallama 👋' },
                    { id: 'drk', label: 'İçecek İçme 🍹' },
                    { id: 'spk', label: 'Konuşma 💬' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      onClick={() => setAvatarAction(act.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all truncate ${
                        avatarAction === act.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                          : 'bg-[#050a14] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                  Karakter Çözünürlüğü
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'm', label: 'Normal (M)' },
                    { id: 'l', label: 'Büyük (L - HD)' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => setAvatarSize(sz.id as 'm' | 'l')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        avatarSize === sz.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                          : 'bg-[#050a14] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: METİN & KİMLİK BİLGİLERİ */}
        {activeTab === 'text' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-5 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                Yetki Unvanı & Görev Adı
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value.toUpperCase())}
                placeholder="Örn: BAŞ EDİTÖR & SİSTEM YÖNETİCİSİ"
                className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold uppercase focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                Kişisel Motto / Slogan
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="Örn: Habbo'nun Kalbi Burada Attı!"
                className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  Kart & Sicil No
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                  placeholder="Örn: HZ-2026-001"
                  className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Birim / Organizasyon
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Örn: Medya & Basın Birimi"
                  className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ROZET & SEMBOL */}
        {activeTab === 'badge' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                <Award size={14} /> Kart Üzerindeki Resmi Görev Rozeti
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-center ${
                    !selectedBadge
                      ? 'bg-red-500/20 border-red-500 text-white font-bold shadow-lg'
                      : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="text-xs">Rozet Yok</span>
                </button>

                {PRESET_BADGES.map((bdg) => (
                  <button
                    key={bdg.id}
                    onClick={() => setSelectedBadge(bdg)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all ${
                      selectedBadge?.id === bdg.id
                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="w-7 h-7 bg-black/40 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                      <Image src={bdg.icon} alt={bdg.name} width={22} height={22} className="object-contain" unoptimized />
                    </div>
                    <span className="truncate">{bdg.name}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-5 mt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                  ✨ Özel Habbo Rozet Kodu Ekle
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customBadgeInput}
                    onChange={(e) => setCustomBadgeInput(e.target.value.toUpperCase())}
                    placeholder="Örn: TR_X, ADM, VIP, HC1..."
                    className="flex-1 bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customBadgeInput.trim()) {
                        setSelectedBadge({
                          id: 'custom_' + customBadgeInput,
                          name: `Rozet (${customBadgeInput})`,
                          icon: `https://images.habbo.com/c_images/album1584/${customBadgeInput.trim()}.gif`
                        });
                      }
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-md"
                  >
                    EKLE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SAĞ CANLI TUVAL ÖNİZLEME & DIŞA AKTARIM (5 SÜTUN) */}
      <div className="lg:col-span-5 space-y-6 sticky top-24">
        
        {/* Canlı Kart Kartı */}
        <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-4 shadow-2xl shadow-purple-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
              <Eye size={14} className="animate-pulse" /> Canlı Kart Stüdyosu
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-300 font-bold">
              {selectedFormat.width} x {selectedFormat.height} PX
            </span>
          </div>

          {/* CANVAS PREVIEW RENDERER */}
          <div className="flex justify-center py-4 bg-[#050a14]/60 rounded-xl border border-white/5 overflow-hidden">
            <div 
              className={`relative w-full rounded-2xl overflow-hidden border-2 transition-all duration-500 p-6 shadow-2xl bg-gradient-to-br ${selectedTheme.bg} ${selectedTheme.border} ${selectedFormat.aspect}`}
            >
              {/* Hologram Parıltı Efekti */}
              <div 
                className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-2xl pointer-events-none transition-all duration-500"
                style={{ backgroundColor: selectedTheme.accent, opacity: hologramOpacity }}
              />
              <div 
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-2xl pointer-events-none transition-all duration-500"
                style={{ backgroundColor: selectedTheme.accent, opacity: hologramOpacity * 0.6 }}
              />

              {/* Kart İçerik İskeleti */}
              <div className="relative z-10 h-full flex items-center justify-between gap-4">
                
                {/* Sol Bilgiler */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${selectedTheme.badgeColor}`}>
                      {roleTitle || 'YETKİLİ UNVANI'}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #{idNumber || 'HZ-001'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase truncate drop-shadow-md">
                    {username || 'KULLANICI ADI'}
                  </h3>

                  <p className="text-xs text-slate-300 italic line-clamp-1 opacity-90 font-medium">
                    "{motto || 'HabboZone En Gelişmiş Topluluk!'}"
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center gap-2.5">
                    {selectedBadge && (
                      <div className="w-8 h-8 bg-black/40 rounded-lg p-1 border border-white/10 shrink-0 flex items-center justify-center shadow-md animate-bounce">
                        <Image src={selectedBadge.icon} alt="Badge" width={22} height={22} className="object-contain" unoptimized />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Birim / Organizasyon</span>
                      <span className="block text-xs font-black text-white truncate">{department || 'Yönetim Birimi'}</span>
                    </div>
                  </div>
                </div>

                {/* Sağ Avatar & Marka */}
                <div className="shrink-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full blur-md pointer-events-none" style={{ backgroundColor: `${selectedTheme.accent}33` }} />
                    <img 
                      src={getAvatarUrl()} 
                      alt={username} 
                      className="max-h-[140px] sm:max-h-[160px] object-contain relative z-10 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] -my-3 transition-transform hover:scale-105 duration-300" 
                    />
                  </div>
                  <div className="mt-2 text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: selectedTheme.accent }}>
                    HABBOZONE.COM
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-300 flex items-center gap-2">
            <Sparkles size={16} className="shrink-0 text-yellow-400" />
            <span>Kartlarınız haberlerde, rehberlerde ve forum imzalarında otomatik responsive çalışır!</span>
          </div>

          {/* Dışa Aktarma Butonları */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={copyCode}
              className={`py-3 px-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
                copiedCode 
                  ? 'bg-emerald-500 text-black shadow-emerald-500/30 scale-95' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'
              }`}
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              {copiedCode ? 'KOD KOPYALANDI!' : 'HTML KODUNU KOPYALA'}
            </button>

            <a
              href={getAvatarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            >
              <Eye size={16} /> Karakteri Aç
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
