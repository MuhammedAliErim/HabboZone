'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { 
  Sparkles, 
  Shirt, 
  User, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  Palette, 
  Tag, 
  Award, 
  Layers, 
  RefreshCw, 
  Wand2 
} from 'lucide-react';

interface OutfitItem {
  id: string;
  name: string;
  category: string; // Şapka, Üst, Alt, Ayakkabı, Aksesuar, Nadire vb.
  priceNote: string; // Örn: "25k + 25c" veya "Nadire" veya "Mağaza"
}

interface FashionTheme {
  id: string;
  name: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  podiumColor: string;
  glowColor: string;
}

const THEMES: FashionTheme[] = [
  {
    id: 'gold',
    name: '👑 Altın VIP & Kırmızı Halı',
    bgGradient: 'from-[#1e1305] via-[#2a1b08] to-[#120a02]',
    borderColor: 'border-yellow-500/50',
    badgeBg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    badgeText: 'text-white font-black',
    podiumColor: 'border-yellow-400/60 shadow-[0_0_30px_rgba(250,204,21,0.3)]',
    glowColor: 'bg-yellow-500/10'
  },
  {
    id: 'sakura',
    name: '🌸 Sakura Pembe & Bahar',
    bgGradient: 'from-[#230f1c] via-[#311527] to-[#160811]',
    borderColor: 'border-pink-500/50',
    badgeBg: 'bg-gradient-to-r from-pink-500 to-rose-600',
    badgeText: 'text-white font-black',
    podiumColor: 'border-pink-400/60 shadow-[0_0_30px_rgba(244,114,182,0.3)]',
    glowColor: 'bg-pink-500/10'
  },
  {
    id: 'cyber',
    name: '🌌 Siber Koyu & Neon Sokak',
    bgGradient: 'from-[#071328] via-[#0d2146] to-[#040914]',
    borderColor: 'border-cyan-500/50',
    badgeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    badgeText: 'text-white font-black',
    podiumColor: 'border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.3)]',
    glowColor: 'bg-cyan-500/10'
  },
  {
    id: 'winter',
    name: '❄️ Kış Masalı & Buz Sarayı',
    bgGradient: 'from-[#0f1d2a] via-[#1a3349] to-[#081018]',
    borderColor: 'border-blue-400/50',
    badgeBg: 'bg-gradient-to-r from-blue-400 to-indigo-600',
    badgeText: 'text-white font-black',
    podiumColor: 'border-blue-300/60 shadow-[0_0_30px_rgba(147,197,253,0.3)]',
    glowColor: 'bg-blue-500/10'
  },
  {
    id: 'gothic',
    name: '🧛 Gotik Gece & Gizem',
    bgGradient: 'from-[#180a1f] via-[#240f2f] to-[#0d0511]',
    borderColor: 'border-purple-500/50',
    badgeBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-700',
    badgeText: 'text-white font-black',
    podiumColor: 'border-purple-400/60 shadow-[0_0_30px_rgba(192,132,252,0.3)]',
    glowColor: 'bg-purple-500/10'
  }
];

export default function OutfitStudioClient() {
  // Character State
  const [username, setUsername] = useState('MuhammedAliErim');
  const [outfitTitle, setOutfitTitle] = useState('Lüks Kış Kombini & Altın Taç');
  const [authorName, setAuthorName] = useState('Moda Editörü');
  const [direction, setDirection] = useState('2');
  const [headDirection, setHeadDirection] = useState('2');
  const [gesture, setGesture] = useState('sml');
  const [action, setAction] = useState('std');
  const [size, setSize] = useState('l');

  // Theme State
  const [selectedThemeId, setSelectedThemeId] = useState('gold');
  const activeTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  // Outfit Items
  const [items, setItems] = useState<OutfitItem[]>([
    { id: '1', name: 'Altın Lüks Taç', category: '👑 Aksesuar / Nadire', priceNote: '150k + 150c' },
    { id: '2', name: 'Örgü Kış Kazağı', category: '👕 Üst Giyim', priceNote: 'Mağaza' },
    { id: '3', name: 'Siyah Yırtık Kot', category: '👖 Alt Giyim', priceNote: '5k + 10c' },
    { id: '4', name: 'Siber Koyu Gözlük', category: '👓 Gözlük', priceNote: '25c' }
  ]);

  // New Item Input
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('👕 Üst Giyim');
  const [newItemPrice, setNewItemPrice] = useState('Mağaza');

  // Embed State
  const [copied, setCopied] = useState(false);

  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${username}&action=${action}&direction=${direction}&head_direction=${headDirection}&gesture=${gesture}&size=${size}`;

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: OutfitItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      priceNote: newItemPrice.trim() || 'Mağaza'
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  // Generate Embed HTML
  const generateEmbedHTML = () => {
    const itemsHTML = items.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 12px; margin-bottom: 6px;">
        <div>
          <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; display: block; font-weight: bold;">${item.category}</span>
          <span style="font-size: 13px; color: #ffffff; font-weight: 800;">${item.name}</span>
        </div>
        <span style="background: rgba(250,204,21,0.15); color: #facc15; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(250,204,21,0.3);">${item.priceNote}</span>
      </div>
    `).join('');

    return `<div style="max-width: 650px; margin: 20px auto; background: #0a1224; border: 2px solid rgba(255,255,255,0.15); border-radius: 16px; overflow: hidden; font-family: 'Inter', sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <!-- Header Banner -->
  <div style="background: linear-gradient(90deg, #1e293b, #0f172a); padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
    <div>
      <span style="background: #e11d48; color: #ffffff; font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">HABBO MODA & KOMBİN</span>
      <h3 style="margin: 6px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 900;">${outfitTitle}</h3>
    </div>
    <div style="text-align: right;">
      <span style="font-size: 11px; color: #94a3b8; display: block;">Modem Mimar</span>
      <strong style="color: #facc15; font-size: 13px;">@${username}</strong>
    </div>
  </div>

  <!-- Body -->
  <div style="display: flex; flex-wrap: wrap; padding: 20px; gap: 20px; background: #070c18;">
    <!-- Avatar Podium -->
    <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 2px dashed rgba(255,255,255,0.15); border-radius: 12px; padding: 20px; text-align: center; position: relative;">
      <img src="${avatarUrl}" alt="${username}" style="max-height: 180px; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));" />
      <div style="margin-top: 12px; font-size: 12px; font-weight: bold; color: #cbd5e1; background: rgba(0,0,0,0.4); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
        ✨ Tarz Sahibi: ${username}
      </div>
    </div>

    <!-- Items List -->
    <div style="flex: 1.5; min-width: 240px;">
      <h4 style="margin: 0 0 12px 0; color: #f8fafc; font-size: 14px; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
        👔 KOMBİNDE KULLANILAN PARÇALAR (${items.length})
      </h4>
      ${itemsHTML}
    </div>
  </div>

  <!-- Footer -->
  <div style="background: #050811; padding: 12px 20px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 12px; color: #64748b; font-weight: 600;">
    Hazırlayan: <span style="color: #38bdf8;">${authorName}</span> • HabboZone Lookbook Stüdyosu v2.0
  </div>
</div>`;
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(generateEmbedHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner */}
      <div className="habbo-box bg-gradient-to-r from-[#070c18] via-[#120a1c] to-[#070c18] border-2 border-white/10 p-6 rounded-2xl relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-black uppercase flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5" /> CANVA MODA v2.0
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold">
              KOMBİN & LOOKBOOK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Habbo<span className="text-pink-400">Zone</span> Kombin & Moda Stüdyosu
          </h1>
          <p className="text-sm text-gray-300">
            Avatarlarınızı tasarlayın, giyilen kıyafetleri etiketleyin ve haberler veya dergiler için şık moda kartları export edin.
          </p>
        </div>
        
        <button
          onClick={handleCopyEmbed}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-pink-500/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0 uppercase tracking-wider"
        >
          {copied ? <Check className="w-5 h-5 text-yellow-300" /> : <Copy className="w-5 h-5" />}
          {copied ? 'MODA KODU KOPYALANDI!' : 'KOMBİN KODUNU KOPYALA'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Editor Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Tema & Genel Bilgiler */}
          <div className="habbo-box bg-[#070c18] border-2 border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Palette className="w-4 h-4 text-pink-400" /> 1. Tema & Kombin Başlığı
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Kombin Başlığı / Sloganı</label>
                <input 
                  type="text" 
                  value={outfitTitle}
                  onChange={(e) => setOutfitTitle(e.target.value)}
                  className="w-full bg-[#0a1325] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Editör / Tasarımcı Adı</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#0a1325] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">Podyum Renk Teması Seçin:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThemeId(t.id)}
                    className={`px-3 py-2.5 rounded-lg border text-left text-xs font-black transition-all flex items-center justify-between ${
                      selectedThemeId === t.id
                        ? 'bg-pink-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/10'
                        : 'bg-[#0a1325] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{t.name}</span>
                    {selectedThemeId === t.id && <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Karakter (Avatar) Kontrolleri */}
          <div className="habbo-box bg-[#070c18] border-2 border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <User className="w-4 h-4 text-yellow-400" /> 2. Karakter (Avatar) Ayarları
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Habbo Kullanıcı Adı (Avatar)</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a1325] border border-white/10 rounded-lg px-3 py-2 text-sm text-yellow-300 focus:outline-none focus:border-yellow-400 font-black"
                  placeholder="Örn: MuhammedAliErim"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Eylem / Durum</label>
                <select 
                  value={action} 
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full bg-[#0a1325] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 font-bold"
                >
                  <option value="std">Ayakta Duruyor (Normal)</option>
                  <option value="wav">El Sallıyor (Selamlama)</option>
                  <option value="drk">İçecek İçiyor (Kokteyl)</option>
                  <option value="sit">Oturuyor / Dinleniyor</option>
                  <option value="wlk">Podyumda Yürüyor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Bakış Yönü</label>
                <select 
                  value={direction} 
                  onChange={(e) => { setDirection(e.target.value); setHeadDirection(e.target.value); }}
                  className="w-full bg-[#0a1325] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                >
                  <option value="2">Güney Doğu (➡️)</option>
                  <option value="3">Güney (⬇️)</option>
                  <option value="4">Güney Batı (⬅️)</option>
                  <option value="1">Doğu (👉)</option>
                  <option value="5">Batı (👈)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Yüz İfadesi</label>
                <select 
                  value={gesture} 
                  onChange={(e) => setGesture(e.target.value)}
                  className="w-full bg-[#0a1325] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                >
                  <option value="sml">😊 Gülümsüyor</option>
                  <option value="std">😐 Ciddi / Havalı</option>
                  <option value="sur">😲 Şaşırmış</option>
                  <option value="ang">😠 Öfkeli / İsyankar</option>
                  <option value="sad">😢 Üzgün / Melankolik</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Çözünürlük</label>
                <select 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-[#0a1325] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                >
                  <option value="l">Büyük (L - Yüksek Kalite)</option>
                  <option value="m">Orta (M - Standart)</option>
                  <option value="s">Küçük (S - Minimal)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Kombinde Kullanılan Kıyafet & Nadireler */}
          <div className="habbo-box bg-[#070c18] border-2 border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-black text-white flex items-center justify-between border-b border-white/10 pb-3">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" /> 3. Kombinde Kullanılan Parçalar ({items.length})
              </span>
              <span className="text-xs font-normal text-gray-400">Kıyafetleri etiketleyin</span>
            </h2>

            {/* Add New Item Inputs */}
            <div className="bg-[#0a1325] p-3 rounded-xl border border-white/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-1">
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-[#070c18] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="👑 Aksesuar / Nadire">👑 Aksesuar / Nadire</option>
                    <option value="🎩 Şapka / Saç">🎩 Şapka / Saç</option>
                    <option value="👕 Üst Giyim">👕 Üst Giyim</option>
                    <option value="👖 Alt Giyim">👖 Alt Giyim</option>
                    <option value="👟 Ayakkabı / Ayak">👟 Ayakkabı / Ayak</option>
                    <option value="✨ Efekt / Aura">✨ Efekt / Aura</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    placeholder="Eşya Adı (Örn: Örgü Kazak)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-[#070c18] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-1 flex gap-1">
                  <input
                    type="text"
                    placeholder="Fiyat (25k / Mağaza)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full bg-[#070c18] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-yellow-300 font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAddItem}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-2 rounded-lg transition-all flex items-center justify-center shrink-0 shadow"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="text-center py-6 bg-white/5 rounded-lg border border-dashed border-white/10 text-gray-400 text-xs font-bold">
                  Henüz kombine kıyafet veya nadire parçası eklenmedi.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-[#0a1325] border border-white/10 px-3 py-2 rounded-lg hover:border-white/20 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] font-black uppercase text-gray-400 px-2 py-0.5 rounded bg-white/5 border border-white/5 shrink-0">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-white truncate">{item.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-extrabold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                        {item.priceNote}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Canva Lookbook Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="habbo-box bg-[#070c18] border-2 border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-black text-white flex items-center justify-between border-b border-white/10 pb-3">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-yellow-400" /> Canlı Moda Kartı Önizlemesi
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                CANVA PRO
              </span>
            </h2>

            {/* THE CARD */}
            <div className={`rounded-2xl border-2 ${activeTheme.borderColor} bg-gradient-to-b ${activeTheme.bgGradient} p-5 space-y-5 shadow-2xl relative overflow-hidden transition-all duration-300`}>
              
              {/* Top Bar */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${activeTheme.badgeBg} ${activeTheme.badgeText} shadow mb-1`}>
                    GÜNÜN KOMBİNİ
                  </span>
                  <h3 className="text-base font-black text-white leading-tight">{outfitTitle}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 block font-medium">Tarz Sahibi</span>
                  <span className="text-xs font-black text-yellow-400">@{username}</span>
                </div>
              </div>

              {/* Podium & Avatar */}
              <div className={`rounded-xl bg-black/40 border-2 dashed ${activeTheme.podiumColor} p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]`}>
                <div className={`absolute inset-0 ${activeTheme.glowColor} blur-2xl pointer-events-none`}></div>
                
                <Image 
                  src={avatarUrl} 
                  alt={username}
                  width={120}
                  height={190}
                  className="max-h-[190px] object-contain transition-transform hover:scale-110 duration-300 relative z-10"
                  unoptimized
                  style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.7))' }}
                />

                <div className="mt-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-extrabold text-white shadow-lg relative z-10 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                  <span>Habbo Tarzı: {username}</span>
                </div>
              </div>

              {/* Items List Inside Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/10 pb-1.5 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-pink-400" /> Kullanılan Parçalar ({items.length})
                </h4>

                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">{item.category}</span>
                        <span className="font-extrabold text-white truncate block">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-yellow-300 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 shrink-0">
                        {item.priceNote}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px] font-bold text-gray-400">
                <span>Editör: <strong className="text-white">{authorName}</strong></span>
                <span className="text-pink-400 font-extrabold flex items-center gap-1">
                  HabboZone Lookbook <Award className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Quick Export Button */}
            <button
              onClick={handleCopyEmbed}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black py-3.5 rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] uppercase tracking-wider text-sm"
            >
              {copied ? <Check className="w-5 h-5 text-yellow-300" /> : <Copy className="w-5 h-5" />}
              {copied ? 'EMBED KODU KOPYALANDI!' : 'TEK TIKLA HABER VEYA DERGİ İÇİN KOPYALA'}
            </button>
            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              💡 Kopyalanan bu moda kartını <strong>Yeni Haber Ekle</strong> veya <strong>Rehber/Dergi</strong> editöründe HTML kısmına yapıştırarak saniyeler içinde yayınlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
