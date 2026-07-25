'use client';

import { useState } from 'react';
import { 
  Compass, Plus, Trash2, Edit2, Copy, Check, Sparkles, Layers, Sliders, 
  Eye, RefreshCw, Palette, Layout, QrCode, Shield, Zap, Share2, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownLeft, HelpCircle,
  Move, CheckCircle2, Award, Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';

const PRESET_ROOMS = [
  { id: 'maze_1', name: '🏰 Klasik Rozet Labirent Odası', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_4.png', desc: 'Gizli kollar ve zamanlayıcılı karolar içeren standart labirent odası.' },
  { id: 'arena_1', name: '🎮 Wired Oyun & Yarışma Alanı', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_general.png', desc: 'Kırmızı vs Mavi takım yarışmaları ve Wired tetikleyicili arena.' },
  { id: 'jungle_1', name: '🌲 Orman & Doğa Macerası', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_jungle15.png', desc: 'Doğa temalı rozet görevleri ve gizli geçit haritaları için ideal.' },
  { id: 'party_1', name: '🎉 VIP Kulüp & Parti Odası', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_party16.png', desc: 'Konser, parti ve ödüllü çekiliş etkinlikleri için salon arkası.' },
  { id: 'winter_1', name: '❄️ Kış & Siber Lüks Mekan', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_winter.png', desc: 'Kış oyunları ve buz pateni turnuvaları için özel oda.' },
];

const WIRED_ICONS = [
  { id: 'wired_trig', name: '⚡ Wired Tetikleyici (Trigger)', icon: 'https://images.habbo.com/c_images/catalogue/icon_98.png', color: '#fb923c' },
  { id: 'wired_eff', name: '⚙️ Wired Etki (Effect)', icon: 'https://images.habbo.com/c_images/catalogue/icon_201.png', color: '#a855f7' },
  { id: 'switch', name: '🕹️ Kırmızı Kol (Switch)', icon: '/images/credits.png', color: '#ef4444' },
  { id: 'tile', name: '🟩 Renkli Karo (Tile)', icon: '/images/diamonds.png', color: '#10b981' },
  { id: 'teleport', name: '🚪 Işınlayıcı (Teleport)', icon: 'https://images.habbo.com/c_images/album1584/VIP.gif', color: '#38bdf8' },
  { id: 'badge_win', name: '🏆 Başarı Rozeti / Kupa', icon: 'https://images.habbo.com/c_images/album1584/HC1.gif', color: '#facc15' },
];

const ARROW_DIRECTIONS = [
  { id: 'right', label: 'Sağ ➡️', icon: ArrowRight, css: 'rotate-0' },
  { id: 'left', label: 'Sol ⬅️', icon: ArrowLeft, css: 'rotate-0' },
  { id: 'up', label: 'Yukarı ⬆️', icon: ArrowUp, css: 'rotate-0' },
  { id: 'down', label: 'Aşağı ⬇️', icon: ArrowDown, css: 'rotate-0' },
  { id: 'up_right', label: 'Çapraz ↗️', icon: ArrowUpRight, css: 'rotate-0' },
  { id: 'down_left', label: 'Çapraz ↙️', icon: ArrowDownLeft, css: 'rotate-0' },
];

const MARKER_COLORS = [
  { id: 'red', name: 'Acil Kırmızı', bg: 'bg-red-600 border-red-400 text-white shadow-red-500/50', hex: '#dc2626' },
  { id: 'yellow', name: 'Habbo Altın', bg: 'bg-yellow-500 border-yellow-300 text-black shadow-yellow-500/50', hex: '#eab308' },
  { id: 'emerald', name: 'Zümrüt Yeşil', bg: 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/50', hex: '#059669' },
  { id: 'blue', name: 'Neon Mavi', bg: 'bg-blue-600 border-blue-400 text-white shadow-blue-500/50', hex: '#2563eb' },
  { id: 'purple', name: 'Lüks Mor', bg: 'bg-purple-600 border-purple-400 text-white shadow-purple-500/50', hex: '#9333ea' },
];

interface StepItem {
  id: string;
  number: number;
  title: string;
  desc: string;
  color: string;
  hex: string;
  type: 'step' | 'arrow' | 'wired';
  arrowDir?: string;
  iconUrl?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export default function RoomStudioClient() {
  // Room background state
  const [selectedRoom, setSelectedRoom] = useState(PRESET_ROOMS[0]);
  const [customRoomUrl, setCustomRoomUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  // Steps / Markers state
  const [steps, setSteps] = useState<StepItem[]>([
    {
      id: 'step_1',
      number: 1,
      title: 'Kırmızı Kolu Çek',
      desc: 'Gizli kapıyı açmak için süresi dolmadan kolu çekin.',
      color: MARKER_COLORS[0].bg,
      hex: MARKER_COLORS[0].hex,
      type: 'step',
      x: 25,
      y: 40,
    },
    {
      id: 'step_2',
      number: 2,
      title: 'Yeşil Karoya Bas',
      desc: 'Açılan köprüden geçip yeşil karonun üzerinde durun.',
      color: MARKER_COLORS[2].bg,
      hex: MARKER_COLORS[2].hex,
      type: 'step',
      x: 55,
      y: 50,
    },
    {
      id: 'step_3',
      number: 3,
      title: 'Işınlayıcıya Gir & Rozeti Al!',
      desc: 'İmparator ışınlayıcısına girerek ödül odasına ulaşın.',
      color: MARKER_COLORS[1].bg,
      hex: MARKER_COLORS[1].hex,
      type: 'step',
      x: 80,
      y: 35,
    },
  ]);

  // New item creation state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState(MARKER_COLORS[0]);
  const [selectedType, setSelectedType] = useState<'step' | 'arrow' | 'wired'>('step');
  const [selectedArrow, setSelectedArrow] = useState(ARROW_DIRECTIONS[0]);
  const [selectedWired, setSelectedWired] = useState(WIRED_ICONS[0]);

  // Selected step to edit
  const [activeStepId, setActiveStepId] = useState<string | null>('step_1');

  // UI State
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'room' | 'steps' | 'legend'>('steps');

  const currentRoomUrl = useCustomUrl && customRoomUrl.trim() ? customRoomUrl.trim() : selectedRoom.url;

  const handleAddStep = () => {
    const nextNum = steps.filter((s) => s.type === 'step').length + 1;
    const newItem: StepItem = {
      id: 'item_' + Date.now(),
      number: nextNum,
      title: newTitle.trim() || (selectedType === 'step' ? `Adım ${nextNum}` : selectedType === 'arrow' ? `${selectedArrow.label} Yönü` : selectedWired.name),
      desc: newDesc.trim() || 'Buradaki talimatı yerine getirin ve ilerleyin.',
      color: selectedColor.bg,
      hex: selectedColor.hex,
      type: selectedType,
      arrowDir: selectedType === 'arrow' ? selectedArrow.id : undefined,
      iconUrl: selectedType === 'wired' ? selectedWired.icon : undefined,
      x: 50,
      y: 50,
    };
    setSteps([...steps, newItem]);
    setActiveStepId(newItem.id);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
    if (activeStepId === id) setActiveStepId(null);
  };

  const updatePosition = (id: string, x: number, y: number) => {
    setSteps(
      steps.map((s) => {
        if (s.id === id) {
          return { ...s, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
        }
        return s;
      })
    );
  };

  const generateEmbedHtml = () => {
    const stepsHtml = steps
      .map(
        (s, idx) => `
      <div style="display: flex; align-items: flex-start; gap: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 14px; border-radius: 12px; margin-bottom: 10px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${s.hex}; color: #ffffff; font-weight: 900; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 10px ${s.hex}66;">
          ${s.type === 'step' ? s.number : s.type === 'arrow' ? '➜' : '⚡'}
        </div>
        <div style="flex: 1;">
          <h4 style="margin: 0 0 4px 0; color: #ffffff; font-size: 15px; font-weight: 800; text-transform: uppercase;">${s.title}</h4>
          <p style="margin: 0; color: #cbd5e1; font-size: 13px; line-height: 1.5;">${s.desc}</p>
        </div>
      </div>`
      )
      .join('');

    return `<div style="background: #070c18; border: 2px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; font-family: sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.8); my-6;">
  <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;">
    <span style="color: #ffffff; font-weight: 900; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">🗺️ HABBO ODA & LABİRENT ÇÖZÜM REHBERİ</span>
    <span style="background: rgba(0,0,0,0.3); color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">TOPLAM ${steps.length} ADIM</span>
  </div>

  <div style="position: relative; width: 100%; background: #050a14; overflow: hidden; text-align: center; border-bottom: 2px solid rgba(255,255,255,0.1);">
    <img src="${currentRoomUrl}" alt="Room Guide Map" style="width: 100%; max-height: 500px; object-fit: cover; display: block;" />
  </div>

  <div style="padding: 24px;">
    <h3 style="color: #facc15; font-size: 16px; font-weight: 900; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
      📋 Adım Adım Labirent Geçiş Talimatları
    </h3>
    <div style="margin-top: 12px;">
      ${stepsHtml}
    </div>
    <div style="margin-top: 16px; padding: 12px; background: rgba(250,204,21,0.1); border: 1px solid rgba(250,204,21,0.3); border-radius: 10px; color: #fef08a; font-size: 12px; font-weight: 600; text-align: center;">
      💡 İpucu: Karolarda veya kollarda zamanlayıcı süresine (Wired Timer) dikkat ederek yukarıdaki sırayı takip ediniz!
    </div>
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
      
      {/* SOL KONTROL VE DÜZENLEME PANELİ (6 SÜTUN) */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Sekme Menüsü */}
        <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-2 rounded-xl flex items-center justify-between gap-1 overflow-x-auto shadow-xl">
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'steps' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass size={16} /> Adım Ekle & Düzenle
          </button>
          <button
            onClick={() => setActiveTab('room')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'room' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon size={16} /> Oda Arka Planı
          </button>
          <button
            onClick={() => setActiveTab('legend')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'legend' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={16} /> Adım Listesi ({steps.length})
          </button>
        </div>

        {/* TAB 1: ADIM EKLE & DÜZENLE */}
        {activeTab === 'steps' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            
            {/* İşaretçi Tipi Seçimi */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Plus size={14} /> Ekleyeceğiniz İşaretçi Tipi
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'step', label: '1️⃣ Adım Numarası', desc: 'Sıralı adım rozeti' },
                  { id: 'arrow', label: '➡️ Yön Oku', desc: 'Hareket ve yön' },
                  { id: 'wired', label: '⚡ Wired & Eşya', desc: 'Okyanus / Kol' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as 'step' | 'arrow' | 'wired')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedType === type.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="font-black text-xs text-white mb-0.5">{type.label}</div>
                    <div className="text-[10px] text-gray-400">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ok Yönü Seçimi (Sadece ok seçildiyse) */}
            {selectedType === 'arrow' && (
              <div className="border-t border-white/10 pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                  Ok Bakış Yönü
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {ARROW_DIRECTIONS.map((arr) => {
                    const IconComp = arr.icon;
                    return (
                      <button
                        key={arr.id}
                        onClick={() => setSelectedArrow(arr)}
                        className={`py-2 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all ${
                          selectedArrow.id === arr.id
                            ? 'bg-yellow-500/20 border-yellow-400 text-white shadow-md'
                            : 'bg-[#050a14] border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        <IconComp size={18} />
                        <span>{arr.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Wired İkon Seçimi (Sadece wired seçildiyse) */}
            {selectedType === 'wired' && (
              <div className="border-t border-white/10 pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                  Wired veya Eşya İkonu
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {WIRED_ICONS.map((wrd) => (
                    <button
                      key={wrd.id}
                      onClick={() => setSelectedWired(wrd)}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                        selectedWired.id === wrd.id
                          ? 'bg-purple-500/20 border-purple-400 text-white shadow-md'
                          : 'bg-[#050a14] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-base shrink-0">{wrd.name.split(' ')[0]}</span>
                      <span className="truncate text-[11px]">{wrd.name.split(' ').slice(1).join(' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Renk Seçimi */}
            <div className="border-t border-white/10 pt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2.5">
                İşaretçi Rengi & Parlaklık Glow
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MARKER_COLORS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedColor(col)}
                    className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all truncate ${col.bg} ${
                      selectedColor.id === col.id ? 'ring-2 ring-white scale-105 shadow-xl' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {col.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Başlık ve Açıklama Inputları */}
            <div className="border-t border-white/10 pt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">
                  Adım Başlığı / Talimat Adı
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={selectedType === 'step' ? 'Örn: Gizli Kolu Çek' : selectedType === 'arrow' ? 'Örn: Bu Yöne İlerle' : 'Örn: Wired Tetikleyici'}
                  className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Adım Açıklaması / Detaylı Rehber İpucu
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  placeholder="Örn: 10 saniye süre dolmadan karoya basın ve kapıdan geçin..."
                  className="w-full bg-[#050a14] border border-white/15 rounded-xl px-4 py-2 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddStep}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black py-3 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-xs uppercase transition-all hover:scale-[1.01]"
              >
                <Plus size={18} /> Haritaya Yeni Adım / İşaretçi Ekle
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ODA ARKA PLANI */}
        {activeTab === 'room' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                🏰 Hazır Popüler Oda Şablonları
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_ROOMS.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => {
                      setSelectedRoom(rm);
                      setUseCustomUrl(false);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      !useCustomUrl && selectedRoom.id === rm.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                        : 'bg-[#050a14] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="font-black text-xs text-white mb-1">{rm.name}</div>
                    <div className="text-[10px] text-gray-400 leading-tight">{rm.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                🌐 Veya Kendi Oda Ekran Görüntüsü URL'nizi Yapıştırın
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customRoomUrl}
                  onChange={(e) => {
                    setCustomRoomUrl(e.target.value);
                    if (e.target.value.trim()) setUseCustomUrl(true);
                  }}
                  placeholder="https://images.habbo.com/..."
                  className="flex-1 bg-[#050a14] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-yellow-500"
                />
                <button
                  type="button"
                  onClick={() => setUseCustomUrl(!!customRoomUrl.trim())}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  UYGULA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADIM LİSTESİ */}
        {activeTab === 'legend' && (
          <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-wider text-white">Haritadaki Adım ve İşaretçiler</span>
              <span className="text-xs font-bold text-emerald-400">{steps.length} Kayıtlı Öğeler</span>
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {steps.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setActiveStepId(st.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    activeStepId === st.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                      : 'bg-[#050a14] border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${st.color}`}>
                      {st.type === 'step' ? st.number : st.type === 'arrow' ? '➜' : '⚡'}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">{st.title}</div>
                      <div className="text-[10px] text-gray-400 truncate">Konum: %{Math.round(st.x)}, %{Math.round(st.y)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(st.id);
                      }}
                      className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                      title="Sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {steps.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-xs font-bold">
                  Haritaya henüz hiç adım rozeti eklenmedi.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SAĞ CANLI HARİTA TUVALİ & DIŞA AKTARIM (6 SÜTUN) */}
      <div className="lg:col-span-6 space-y-6 sticky top-24">
        
        {/* Canlı Harita Kartı */}
        <div className="habbo-box bg-[#0a1224] border-2 border-white/10 p-6 rounded-xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
              <Eye size={14} className="animate-pulse" /> Canlı İnteraktif Tuval
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-300 font-bold">
              100% RESPONSIVE MAP
            </span>
          </div>

          {/* CANVAS PREVIEW RENDERER */}
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-[#050a14] group">
            
            {/* Oda Görseli Arka Plan */}
            <div className="relative w-full aspect-[16/10] max-h-[420px] overflow-hidden">
              <img 
                src={currentRoomUrl} 
                alt="Room Backdrop" 
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* HARİTA ÜZERİNDEKİ İNTERAKTİF ADIM MARKERLARI */}
            <div className="absolute inset-0 overflow-hidden">
              {steps.map((st) => {
                const isSelected = activeStepId === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setActiveStepId(st.id)}
                    style={{ left: `${st.x}%`, top: `${st.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-move transition-transform duration-200 z-20 flex flex-col items-center group/marker ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    {/* Marker İkon / Rozet */}
                    <div className={`px-2.5 py-1.5 rounded-full border-2 font-black text-xs flex items-center gap-1.5 shadow-2xl transition-all ${st.color} ${
                      isSelected ? 'ring-4 ring-white animate-pulse' : ''
                    }`}>
                      {st.type === 'step' && <span>{st.number}</span>}
                      {st.type === 'arrow' && <span className="text-base">➜</span>}
                      {st.type === 'wired' && <span>⚡</span>}
                      <span className="truncate max-w-[100px] text-[11px]">{st.title.split(' ')[0]}</span>
                    </div>

                    {/* Konum Kaydırma Butonları (Aktif Öğeye Özel) */}
                    {isSelected && (
                      <div className="mt-1 flex items-center gap-1 bg-black/90 border border-white/20 p-1 rounded-lg shadow-2xl">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePosition(st.id, st.x - 5, st.y);
                          }}
                          className="px-1.5 py-0.5 hover:bg-white/20 rounded text-[10px] text-white font-bold"
                          title="Sola Kaydır"
                        >
                          ⬅️
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePosition(st.id, st.x + 5, st.y);
                          }}
                          className="px-1.5 py-0.5 hover:bg-white/20 rounded text-[10px] text-white font-bold"
                          title="Sağa Kaydır"
                        >
                          ➡️
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePosition(st.id, st.x, st.y - 5);
                          }}
                          className="px-1.5 py-0.5 hover:bg-white/20 rounded text-[10px] text-white font-bold"
                          title="Yukarı Kaydır"
                        >
                          ⬆️
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePosition(st.id, st.x, st.y + 5);
                          }}
                          className="px-1.5 py-0.5 hover:bg-white/20 rounded text-[10px] text-white font-bold"
                          title="Aşağı Kaydır"
                        >
                          ⬇️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Alt Kılavuz Özeti Barı */}
            <div className="p-4 bg-[#050a14] border-t border-white/10">
              <div className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} /> Harita Çözüm Kılavuzu ({steps.length} Adım)
              </div>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {steps.map((st) => (
                  <div key={st.id} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="font-bold text-emerald-400 shrink-0">
                      {st.type === 'step' ? `Adım ${st.number}:` : '•'}
                    </span>
                    <span className="font-bold text-white shrink-0">{st.title}</span>
                    <span className="text-gray-400 truncate">— {st.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
            <Sparkles size={16} className="shrink-0 text-yellow-400" />
            <span>Haritadaki öğelerin üzerine tıklayıp yön oklarıyla konumlarını tuvalde hassas ayarlayabilirsiniz!</span>
          </div>

          {/* Dışa Aktarma Butonları */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={copyCode}
              className={`py-3.5 px-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
                copiedCode 
                  ? 'bg-yellow-400 text-black shadow-yellow-400/30 scale-95' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
              }`}
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              {copiedCode ? 'EMBED KODU KOPYALANDI!' : 'REHBER KODUNU KOPYALA'}
            </button>

            <button
              onClick={() => {
                setSteps([]);
                setActiveStepId(null);
              }}
              className="py-3.5 px-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            >
              <Trash2 size={16} /> Haritayı Sıfırla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
