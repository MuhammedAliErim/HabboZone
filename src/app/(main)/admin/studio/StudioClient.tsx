'use client';

import { useState } from 'react';
import { 
  Wand2, Image as ImageIcon, Type, User, Award, Copy, Check, 
  Sparkles, Layers, Sliders, Eye, Download, Share2, RefreshCw,
  Palette, Maximize2, Move, Layout
} from 'lucide-react';
import Image from 'next/image';

const TEMPLATES = [
  { id: 'reception', name: 'Habbo Resepsiyon', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_4.png', color: '#1e3a8a' },
  { id: 'vip', name: 'VIP Lounge & Kulüp', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_general.png', color: '#312e81' },
  { id: 'cyberpunk', name: 'Siberpunk & Neon', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_hc20_1.png', color: '#0f172a' },
  { id: 'theatre', name: 'Klasik Tiyatro Sahnesi', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_gen15_2.png', color: '#451a03' },
  { id: 'party', name: 'Gece Kulübü Partisi', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_party16.png', color: '#4a044e' },
  { id: 'jungle', name: 'Zümrüt Doğa & Orman', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_jungle15.png', color: '#064e3b' },
  { id: 'winter', name: 'Koyu Lüks HabboZone', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_winter.png', color: '#090d16' },
];

const CANVAS_SIZES = [
  { id: 'news', name: 'Haber Manşeti (1200x630)', width: 1200, height: 630, aspect: 'aspect-[1200/630]' },
  { id: 'guide', name: 'Rehber Bannerı (800x450)', width: 800, height: 450, aspect: 'aspect-[800/450]' },
  { id: 'card', name: 'Etkinlik Kartı (600x400)', width: 600, height: 400, aspect: 'aspect-[600/400]' },
  { id: 'badge', name: 'Rozet & İkon (300x300)', width: 300, height: 300, aspect: 'aspect-square' },
];

const TEXT_COLORS = [
  { label: 'Beyaz', value: '#ffffff', class: 'text-white' },
  { label: 'Habbo Sarısı', value: '#facc15', class: 'text-yellow-400' },
  { label: 'Neon Mavisi', value: '#38bdf8', class: 'text-sky-400' },
  { label: 'Ateş Kırmızısı', value: '#ef4444', class: 'text-red-500' },
  { label: 'Zümrüt Yeşili', value: '#34d399', class: 'text-emerald-400' },
  { label: 'Mor Glow', value: '#c084fc', class: 'text-purple-400' },
  { label: 'Altın Turuncu', value: '#fb923c', class: 'text-orange-400' },
];

const STICKERS = [
  { id: 'hc', name: 'Habbo Kulüp (HC)', icon: 'https://images.habbo.com/c_images/album1584/HC1.gif' },
  { id: 'vip_badge', name: 'VIP Rozeti', icon: 'https://images.habbo.com/c_images/album1584/VIP.gif' },
  { id: 'credit', name: 'Kredi İkonu', icon: '/images/credits.png' },
  { id: 'diamond', name: 'Elmas İkonu', icon: '/images/diamonds.png' },
  { id: 'duck', name: 'Ördek (Duck)', icon: 'https://images.habbo.com/c_images/catalogue/icon_98.png' },
  { id: 'trophy', name: 'Altın Kupa', icon: 'https://images.habbo.com/c_images/catalogue/icon_201.png' },
];

const BORDER_STYLES = [
  { id: 'pink', name: 'Canva Pink Glow', border: '2px solid #ec4899', shadow: '0 0 25px rgba(236,72,153,0.5)', class: 'border-2 border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.4)]' },
  { id: 'gold', name: 'Habbo Altın Kutu', border: '3px solid #facc15', shadow: '0 0 20px rgba(250,204,21,0.4)', class: 'border-[3px] border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' },
  { id: 'cyan', name: 'Siber Lüks Neon', border: '2px solid #38bdf8', shadow: '0 0 20px rgba(56,189,248,0.5)', class: 'border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]' },
  { id: 'classic', name: 'Klasik Koyu Çerçeve', border: '2px solid rgba(255,255,255,0.15)', shadow: '0 20px 25px -5px rgba(0,0,0,0.8)', class: 'border-2 border-white/15 shadow-2xl' },
];

const FONT_FAMILIES = [
  { id: 'sans', name: 'Modern Sans (Standart)', style: 'sans-serif', class: 'font-sans' },
  { id: 'mono', name: 'Siberpunk Mono (Kod)', style: 'monospace', class: 'font-mono tracking-tighter' },
  { id: 'serif', name: 'Lüks Serif (Dergi)', style: 'serif', class: 'font-serif tracking-wide' },
  { id: 'italic', name: 'İtalik Aksiyon (Hızlı)', style: 'sans-serif', class: 'font-sans italic tracking-wide font-black' },
];

export default function StudioClient() {
  // Canvas Settings
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedSize, setSelectedSize] = useState(CANVAS_SIZES[0]);
  
  // Text Layer
  const [titleText, setTitleText] = useState('HABBOZONE ÖZEL MANŞETİ!');
  const [subText, setSubText] = useState('Topluluğun en yeni nadire ve etkinlik haberleri burada!');
  const [titleColor, setTitleColor] = useState(TEXT_COLORS[1]);
  const [showSubtext, setShowSubtext] = useState(true);
  const [textGlow, setTextGlow] = useState(true);
  const [textPosition, setTextPosition] = useState<'left' | 'center' | 'right'>('left');
  
  // Avatar Layer
  const [avatarUser, setAvatarUser] = useState('MuhammedAliErim');
  const [avatarDirection, setAvatarDirection] = useState(3);
  const [avatarAction, setAvatarAction] = useState('wav');
  const [avatarSize, setAvatarSize] = useState<'m' | 'l'>('l');
  const [avatarPosition, setAvatarPosition] = useState<'right' | 'left' | 'center'>('right');
  const [showAvatar, setShowAvatar] = useState(true);
  
  // Sticker Layer
  const [selectedSticker, setSelectedSticker] = useState<{ id: string; name: string; icon: string } | null>(STICKERS[0]);
  const [customBadgeInput, setCustomBadgeInput] = useState('');
  
  // PRO FX & Styling Layer
  const [bgOpacity, setBgOpacity] = useState(0.75);
  const [borderStyle, setBorderStyle] = useState(BORDER_STYLES[0]);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  
  // UI States
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'bg' | 'text' | 'avatar' | 'sticker' | 'fx'>('bg');

  // Generate Avatar URL
  const getAvatarUrl = () => {
    return `https://www.habbo.com/habbo-imaging/avatarimage?user=${avatarUser || 'Habbo'}&direction=${avatarDirection}&head_direction=${avatarDirection}&action=${avatarAction}&size=${avatarSize}`;
  };

  // Generate Embed HTML
  const generateEmbedHtml = () => {
    const alignStyle = textPosition === 'center' ? 'text-align: center; margin: 0 auto;' : textPosition === 'right' ? 'text-align: right; margin-left: auto;' : 'text-align: left;';
    const fontStyle = fontFamily.style;
    return `<div style="position: relative; overflow: hidden; border-radius: 16px; border: ${borderStyle.border}; box-shadow: ${borderStyle.shadow}; background-color: #0a1224; padding: 28px; min-height: ${selectedSize.id === 'badge' ? '280px' : '220px'}; display: flex; align-items: center; justify-content: space-between; background-image: url('${selectedTemplate.url}'); background-size: cover; background-position: center;">
  <div style="position: absolute; inset: 0; background: linear-gradient(to right, rgba(2,6,16,${bgOpacity}), rgba(2,6,16,${Math.max(0.2, bgOpacity - 0.35)}), transparent); z-index: 1;"></div>
  <div style="position: relative; z-index: 2; max-width: 65%; ${alignStyle}">
    ${selectedSticker ? `<img src="${selectedSticker.icon}" alt="badge" style="margin-bottom: 12px; height: 38px; display: inline-block;" />` : ''}
    <h2 style="color: ${titleColor.value}; font-size: 28px; font-weight: 900; margin: 0 0 8px 0; text-transform: uppercase; text-shadow: ${textGlow ? '0 0 15px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,1)' : '2px 2px 4px rgba(0,0,0,0.9)'}; font-family: ${fontStyle};">${titleText}</h2>
    ${showSubtext ? `<p style="color: #cbd5e1; font-size: 15px; margin: 0; font-weight: 600; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); font-family: ${fontStyle};">${subText}</p>` : ''}
  </div>
  ${showAvatar ? `<div style="position: relative; z-index: 2;"><img src="${getAvatarUrl()}" alt="${avatarUser}" style="max-height: 160px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.6));" /></div>` : ''}
</div>`;
  };

  const copyToClipboard = (type: 'code' | 'url') => {
    if (type === 'code') {
      navigator.clipboard.writeText(generateEmbedHtml());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      navigator.clipboard.writeText(selectedTemplate.url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* SOL KONTROL STÜDYOSU (7 SÜTUN) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Sekme Menüsü */}
        <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-2 rounded-xl flex items-center justify-between gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bg')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'bg' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon size={16} /> Arka Plan & Boyut
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'text' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Type size={16} /> Yazı Katmanı
          </button>
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'avatar' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={16} /> Karakter (Avatar)
          </button>
          <button
            onClick={() => setActiveTab('sticker')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'sticker' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award size={16} /> Rozet & Dekor
          </button>
          <button
            onClick={() => setActiveTab('fx')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'fx' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders size={16} /> Filtre & Efekt
          </button>
        </div>

        {/* TAB 1: ARKA PLAN & BOYUT */}
        {activeTab === 'bg' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 mb-3 flex items-center gap-1.5">
                <Layout size={14} /> Tuval Boyutu & Şablon Formatı
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CANVAS_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSize.id === size.id
                        ? 'bg-pink-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/10 font-bold'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/20 hover:text-white font-medium'
                    }`}
                  >
                    <div className="text-xs">{size.name.split(' (')[0]}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{size.width}x{size.height}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                <ImageIcon size={14} /> Resmi Habbo Arka Plan Temaları
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`group relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedTemplate.id === tpl.id
                        ? 'border-pink-500 shadow-xl shadow-pink-500/20 scale-[1.02]'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${tpl.url}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-2.5">
                      <span className="text-white text-xs font-bold truncate">{tpl.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: YAZI KATMANI */}
        {activeTab === 'text' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                Ana Başlık Metni
              </label>
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="Örn: HAFTANIN ETKİNLİĞİ!"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Alt Açıklama Metni
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSubtext}
                    onChange={(e) => setShowSubtext(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#050a14] border-white/20 text-pink-500 focus:ring-0"
                  />
                  <span className="text-xs text-gray-400">Açıklamayı Göster</span>
                </label>
              </div>
              {showSubtext && (
                <input
                  type="text"
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                  className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-3 text-gray-300 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Örn: Cumartesi 20:00'da buluşuyoruz..."
                />
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3 flex items-center gap-1.5">
                <Palette size={14} /> Ana Başlık Rengi
              </label>
              <div className="flex flex-wrap gap-2.5">
                {TEXT_COLORS.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setTitleColor(col)}
                    className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                      titleColor.value === col.value
                        ? 'bg-white/15 border-white text-white shadow-lg scale-105'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/50 shadow-sm" style={{ backgroundColor: col.value }} />
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-white">Neon Glow (Parlak Gölge) Efekti</span>
                <span className="text-xs text-gray-400">Yazının arkasına yüksek kontrastlı 3D neon parlama ekler.</span>
              </div>
              <button
                type="button"
                onClick={() => setTextGlow(!textGlow)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${textGlow ? 'bg-pink-600' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${textGlow ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: KARAKTER (AVATAR) KATMANI */}
        {activeTab === 'avatar' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="block text-sm font-bold text-white">Canlı Habbo Karakterini Tuvale Ekle</span>
                <span className="text-xs text-gray-400">Habbo API üzerinden anlık avatarları manşete yerleştirir.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatar(!showAvatar)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${showAvatar ? 'bg-pink-600' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showAvatar ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {showAvatar && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                    Habbo Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    value={avatarUser}
                    onChange={(e) => setAvatarUser(e.target.value)}
                    className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Örn: MuhammedAliErim"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                      Karakter Yönü
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[0, 2, 3, 4, 6].map((dir) => (
                        <button
                          key={dir}
                          onClick={() => setAvatarDirection(dir)}
                          className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                            avatarDirection === dir
                              ? 'bg-cyan-500/20 border-cyan-500 text-white'
                              : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30'
                          }`}
                        >
                          Yön {dir}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                      Hareket & Duruş
                    </label>
                    <select
                      value={avatarAction}
                      onChange={(e) => setAvatarAction(e.target.value)}
                      className="w-full bg-[#050a14] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-yellow-500"
                    >
                      <option value="std">Normal Ayakta (Stand)</option>
                      <option value="wav">El Sallama (Wave)</option>
                      <option value="wlk">Yürüme (Walk)</option>
                      <option value="sit">Oturma (Sit)</option>
                      <option value="drk=1">İçecek İçme (Drink)</option>
                      <option value="crr=1">Esya Taşıma (Carry)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Avatar Boyutu:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAvatarSize('m')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        avatarSize === 'm' ? 'bg-white text-black font-black' : 'bg-[#050a14] border-white/10 text-gray-400'
                      }`}
                    >
                      Normal (Medium)
                    </button>
                    <button
                      onClick={() => setAvatarSize('l')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        avatarSize === 'l' ? 'bg-white text-black font-black' : 'bg-[#050a14] border-white/10 text-gray-400'
                      }`}
                    >
                      Büyük (Large)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: ROZET & DEKOR */}
        {activeTab === 'sticker' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 mb-3 flex items-center gap-1.5">
                <Award size={14} /> Manşet Rozet İkonu Seç
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedSticker(null)}
                  className={`p-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    selectedSticker === null
                      ? 'bg-pink-500/20 border-pink-500 text-white'
                      : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <span className="text-red-400">×</span> İkon Yok
                </button>

                {STICKERS.map((stk) => (
                  <button
                    key={stk.id}
                    onClick={() => setSelectedSticker(stk)}
                    className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-bold transition-all ${
                      selectedSticker?.id === stk.id
                        ? 'bg-pink-500/20 border-pink-500 text-white shadow-lg'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 bg-black/40 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                      <Image src={stk.icon} alt={stk.name} width={24} height={24} className="object-contain" unoptimized />
                    </div>
                    <span className="truncate">{stk.name}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                  ✨ Özel Habbo Rozet Kodu Ekle
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customBadgeInput}
                    onChange={(e) => setCustomBadgeInput(e.target.value.toUpperCase())}
                    placeholder="Örn: ADM, DEV, VIP, HC1..."
                    className="flex-1 bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customBadgeInput.trim()) {
                        setSelectedSticker({
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

        {/* TAB 5: FİLTRE & EFEKTLER (PRO FX) */}
        {activeTab === 'fx' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Sliders size={14} /> Arka Plan Karartma (Contrasting)
                </label>
                <span className="text-xs font-mono text-yellow-400">%{Math.round(bgOpacity * 100)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={bgOpacity}
                onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                className="w-full accent-pink-500 bg-[#050a14] rounded-lg h-2 cursor-pointer"
              />
            </div>

            <div className="border-t border-white/10 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                Tuval Çerçeve (Border Glow) Stili
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BORDER_STYLES.map((bst) => (
                  <button
                    key={bst.id}
                    onClick={() => setBorderStyle(bst)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      borderStyle.id === bst.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/10'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white font-medium'
                    }`}
                  >
                    <div className="text-xs">{bst.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">
                Yazı Tipi & Tipografi Ailesi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FONT_FAMILIES.map((fnt) => (
                  <button
                    key={fnt.id}
                    onClick={() => setFontFamily(fnt)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      fontFamily.id === fnt.id
                        ? 'bg-yellow-500/20 border-yellow-400 text-white font-bold shadow-lg shadow-yellow-500/10'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white font-medium'
                    }`}
                  >
                    <div className={`text-xs ${fnt.class}`}>{fnt.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                Metin Hizalama (Alignment)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['left', 'center', 'right'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setTextPosition(pos)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all uppercase ${
                      textPosition === pos
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {pos === 'left' ? 'Sol' : pos === 'center' ? 'Orta' : 'Sağ'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SAĞ CANLI TUVAL ÖNİZLEME & DIŞA AKTARIM (5 SÜTUN) */}
      <div className="lg:col-span-5 space-y-6 sticky top-24">
        
        {/* Canlı Tuval Kartı */}
        <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-4 shadow-2xl shadow-pink-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
              <Eye size={14} className="animate-pulse" /> Canlı Stüdyo Önizlemesi
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-300">
              {selectedSize.width} x {selectedSize.height} PX
            </span>
          </div>

          {/* CANVAS PREVIEW RENDERER */}
          <div 
            className={`relative w-full rounded-xl overflow-hidden ${borderStyle.class} flex items-center justify-between p-6 sm:p-8 transition-all duration-500 ${selectedSize.aspect}`}
            style={{ 
              backgroundImage: `url('${selectedTemplate.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: selectedSize.id === 'badge' ? '280px' : '220px'
            }}
          >
            {/* Karartma Gradyanı */}
            <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to right, rgba(2,6,16,${bgOpacity}), rgba(2,6,16,${Math.max(0.2, bgOpacity - 0.35)}), transparent)` }} />

            {/* Metin & Rozet Katmanı */}
            <div className={`relative z-20 max-w-[65%] space-y-2 ${textPosition === 'center' ? 'mx-auto text-center' : textPosition === 'right' ? 'ml-auto text-right' : 'text-left'} ${fontFamily.class}`}>
              {selectedSticker && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 shadow-lg mb-1 animate-bounce">
                  <Image src={selectedSticker.icon} alt="Sticker" width={20} height={20} className="object-contain" unoptimized />
                  <span className="text-[11px] font-black uppercase tracking-wider text-yellow-300">{selectedSticker.name}</span>
                </div>
              )}

              <h2 
                className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase ${titleColor.class}`}
                style={{
                  textShadow: textGlow ? '0 0 20px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,1)' : '2px 2px 4px rgba(0,0,0,0.9)'
                }}
              >
                {titleText || 'BAŞLIK YAZIN...'}
              </h2>

              {showSubtext && subText && (
                <p className="text-xs sm:text-sm font-semibold text-slate-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2">
                  {subText}
                </p>
              )}
            </div>

            {/* Avatar Katmanı */}
            {showAvatar && (
              <div className="relative z-20 shrink-0 flex items-center justify-center">
                <div className="absolute -inset-4 bg-yellow-400/10 rounded-full blur-xl pointer-events-none" />
                <img 
                  src={getAvatarUrl()} 
                  alt={avatarUser}
                  className="max-h-[160px] sm:max-h-[190px] object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-110"
                />
              </div>
            )}
          </div>

          {/* Dışa Aktarım Butonları */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={() => copyToClipboard('code')}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.02]"
            >
              {copiedCode ? <Check size={18} className="text-emerald-300" /> : <Copy size={18} />}
              {copiedCode ? 'HTML KODU KOPYALANDI!' : 'HABER & REHBER İÇİN HTML KODU KOPYALA'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => copyToClipboard('url')}
                className="bg-[#050a14] hover:bg-white/10 text-gray-300 hover:text-white font-bold py-2.5 px-3 rounded-xl border border-white/15 flex items-center justify-center gap-2 text-xs transition-colors"
              >
                {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                {copiedUrl ? 'LİNK KOPYALANDI' : 'Şablon Linkini Al'}
              </button>

              <button
                onClick={() => {
                  setTitleText('YENİ SEZON BAŞLADI!');
                  setSubText('HabboZone kulübünde harika hediyeler sizleri bekliyor.');
                  setAvatarUser('MuhammedAliErim');
                }}
                className="bg-[#050a14] hover:bg-white/10 text-gray-300 hover:text-white font-bold py-2.5 px-3 rounded-xl border border-white/15 flex items-center justify-center gap-2 text-xs transition-colors"
              >
                <RefreshCw size={14} /> Tasarımı Sıfırla
              </button>
            </div>
          </div>

          <div className="bg-[#050a14] border border-white/10 rounded-xl p-3 text-[11px] text-gray-400 font-medium">
            <span className="text-pink-400 font-bold">💡 TipTap İpucu:</span> Kopyaladığınız HTML kodunu, Haberler veya Rehberler sayfasındaki editörün kaynak kod (<code className="text-yellow-300">&lt;/&gt;</code>) bölümüne doğrudan yapıştırabilirsiniz.
          </div>
        </div>

      </div>

    </div>
  );
}
