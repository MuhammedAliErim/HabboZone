'use client';

import React, { useRef, useState } from 'react';
import {
  LayoutTemplate, Type, User, Award, Shapes, Upload, Palette, Plus, Grid3x3, BadgeCheck, Music4,
} from 'lucide-react';
import {
  useStudioStore,
  TEMPLATES,
  STICKERS,
  SHAPES,
  FONT_FAMILIES,
  TEXT_COLORS,
  SOLID_COLORS,
  GRADIENTS,
  createTextLayer,
  createAvatarLayer,
  createStickerLayer,
  createShapeLayer,
  createImageLayer,
  type TextLayer,
  type ShapeKind,
} from './useStudioStore';

type TabId = 'templates' | 'text' | 'avatar' | 'sticker' | 'shape' | 'upload';

const TABS: { id: TabId; name: string; icon: React.ElementType }[] = [
  { id: 'templates', name: 'Şablonlar', icon: LayoutTemplate },
  { id: 'text', name: 'Yazı', icon: Type },
  { id: 'avatar', name: 'Karakter', icon: User },
  { id: 'sticker', name: 'Rozetler', icon: Award },
  { id: 'shape', name: 'Şekiller', icon: Shapes },
  { id: 'upload', name: 'Yükle', icon: Upload },
];

export default function StudioLeftPanel() {

  const [tab, setTab] = useState<TabId>('templates');
  const addLayer = useStudioStore((s) => s.addLayer);
  const setBackground = useStudioStore((s) => s.setBackground);
  const updateLayer = useStudioStore((s) => s.updateLayer);
  const selectedId = useStudioStore((s) => s.selectedId);
  const layers = useStudioStore((s) => s.layers);
  const background = useStudioStore((s) => s.background);
  const [badgeCode, setBadgeCode] = useState('');
  const [showAllText, setShowAllText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLayer = layers.find((l) => l.id === selectedId);
  const isTextSelected = selectedLayer?.type === 'text';

  const addAvatar = (user = 'MuhammedAliErim') => {
    addLayer(createAvatarLayer({ username: user }));
  };

  const addCustomBadge = () => {
    const code = badgeCode.trim().toUpperCase();
    if (!code) return;
    addLayer(createStickerLayer(
      `https://images.habbo.com/c_images/album1584/${code}.gif`,
      `Rozet (${code})`,
      { badgeCode: code }
    ));
    setBadgeCode('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addLayer(createImageLayer(reader.result, file.name));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const fontsToShow = showAllText ? FONT_FAMILIES : FONT_FAMILIES.slice(0, 3);

  return (
    <div className="w-64 shrink-0 bg-[#0a1325] border-r border-[#1e293b] flex flex-col overflow-hidden">
      {/* Sekme Menüsü */}
      <div className="grid grid-cols-6 border-b border-[#1e293b] bg-[#050a14]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 text-[9px] font-black uppercase tracking-wide transition-all cursor-pointer ${
              tab === t.id
                ? 'text-[#facc15] bg-[#0a1325] border-t-2 border-[#facc15]'
                : 'text-gray-400 hover:text-white'
            }`}
            title={t.name}
          >
            <t.icon className="w-4 h-4" />
            {t.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ŞABLONLAR */}
        {tab === 'templates' && (
          <>
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-pink-400 mb-2">
                <Grid3x3 className="w-3.5 h-3.5" /> Habbo Arka Planları
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setBackground({ kind: 'image', imageUrl: tpl.url, templateName: tpl.name })}
                    className={`group relative h-16 rounded-[3px] overflow-hidden border-2 transition-all cursor-pointer ${
                      background.kind === 'image' && background.imageUrl === tpl.url
                        ? 'border-[#facc15] shadow-lg shadow-yellow-500/10'
                        : 'border-[#1e293b] hover:border-[#facc15]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url('${tpl.url}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                      <span className="text-[9px] font-bold text-white truncate">{tpl.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-2">
                <Palette className="w-3.5 h-3.5" /> Düz Renkler
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {SOLID_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setBackground({ kind: 'color', color: c.value })}
                    title={c.label}
                    className={`h-9 rounded-[3px] border-2 transition-all cursor-pointer ${
                      background.kind === 'color' && background.color === c.value
                        ? 'border-[#facc15] scale-110'
                        : 'border-[#1e293b] hover:border-white'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-400 mb-2">
                <Music4 className="w-3.5 h-3.5" /> Degradeler
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g.label}
                    onClick={() => setBackground({ kind: 'gradient', gradient: g.value })}
                    className={`h-12 rounded-[3px] border-2 transition-all cursor-pointer ${
                      background.kind === 'gradient' && background.gradient === g.value
                        ? 'border-[#facc15]'
                        : 'border-[#1e293b] hover:border-white'
                    }`}
                    style={{ backgroundImage: g.value }}
                    title={g.label}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* YAZI */}
        {tab === 'text' && (
          <>
            <button
              onClick={() => addLayer(createTextLayer({ content: 'BAŞLIĞINIZI YAZIN', fontSize: 44, height: 80, width: 500 }))}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[3px] bg-[#facc15] text-black font-black text-xs uppercase hover:bg-yellow-300 transition-all cursor-pointer shadow-lg shadow-yellow-500/10"
            >
              <Plus className="w-4 h-4" /> Başlık Ekle
            </button>
            <button
              onClick={() => addLayer(createTextLayer({ content: 'Alt açıklama metni', fontSize: 22, color: '#cbd5e1', fontWeight: 600, width: 400, height: 40 }))}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[3px] bg-[#1e293b] text-white font-black text-xs uppercase hover:bg-[#334155] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Alt Başlık Ekle
            </button>
            <button
              onClick={() => addLayer(createTextLayer({ content: 'Gövde metni için buraya yazın...', fontSize: 16, color: '#e2e8f0', fontWeight: 500, width: 360, height: 90, lineHeight: 1.5 }))}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[3px] bg-[#1e293b] text-white font-black text-xs uppercase hover:bg-[#334155] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Gövde Metni Ekle
            </button>

            <div className="border-t border-[#1e293b] pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-pink-400">
                  Font Aileleri
                </label>
                <button
                  onClick={() => setShowAllText(!showAllText)}
                  className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {showAllText ? 'Daha Az' : 'Tümü'}
                </button>
              </div>
              <div className="space-y-1.5">
                {fontsToShow.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => isTextSelected && updateLayer(selectedId!, { fontFamily: f.family })}
                    disabled={!isTextSelected}
                    className="w-full p-2.5 rounded-[3px] bg-[#050a14] border border-[#1e293b] text-left hover:border-[#facc15] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="text-sm text-white" style={{ fontFamily: f.family }}>HabboZone</span>
                  </button>
                ))}
              </div>
              {!isTextSelected && (
                <p className="text-[10px] text-gray-500 mt-2">Font uygulamak için önce bir yazı katmanı seçin.</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-yellow-400 mb-2 block">
                Yazı Renkleri
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => isTextSelected && updateLayer(selectedId!, { color: c.value })}
                    disabled={!isTextSelected}
                    title={c.label}
                    className={`w-8 h-8 rounded-[3px] border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                      (selectedLayer as TextLayer | undefined)?.color === c.value
                        ? 'border-[#facc15] scale-110'
                        : 'border-[#1e293b] hover:border-white'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* KARAKTER */}
        {tab === 'avatar' && (
          <>
            <button
              onClick={() => addAvatar()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[3px] bg-[#facc15] text-black font-black text-xs uppercase hover:bg-yellow-300 transition-all cursor-pointer shadow-lg shadow-yellow-500/10"
            >
              <Plus className="w-4 h-4" /> Karakter Ekle
            </button>
            <button
              onClick={() => addAvatar('Habbo')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[3px] bg-[#1e293b] text-white font-black text-xs uppercase hover:bg-[#334155] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Örnek: Habbo
            </button>
            <div className="border-t border-[#1e293b] pt-4">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Karakterler Habbo API üzerinden canlı yüklenir. Ekleme sonrası sağ panelden adı, yönü ve duruşu düzenleyin.
              </label>
              <div className="mt-3 h-24 rounded-[3px] bg-[#050a14] border border-[#1e293b] flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </>
        )}

        {/* ROZETLER */}
        {tab === 'sticker' && (
          <>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5" /> Habbo Rozetleri
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STICKERS.map((stk) => (
                  <button
                    key={stk.id}
                    onClick={() => addLayer(createStickerLayer(stk.icon, stk.name))}
                    className="aspect-square rounded-[3px] bg-[#050a14] border border-[#1e293b] hover:border-[#facc15] flex items-center justify-center p-2 transition-all cursor-pointer"
                    title={stk.name}
                  >
                    <img src={stk.icon} alt={stk.name} className="max-w-full max-h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-yellow-400 mb-2 block">
                Özel Rozet Kodu
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={badgeCode}
                  onChange={(e) => setBadgeCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomBadge()}
                  placeholder="ADM, DEV, VIP..."
                  className="flex-1 min-w-0 bg-[#050a14] border border-[#1e293b] rounded-[3px] px-2.5 py-2 text-[11px] text-white font-mono uppercase focus:outline-none focus:border-yellow-500"
                />
                <button
                  onClick={addCustomBadge}
                  className="px-3 py-2 rounded-[3px] bg-[#facc15] text-black font-black text-[11px] hover:bg-yellow-300 transition-all cursor-pointer"
                >
                  EKLE
                </button>
              </div>
              <p className="text-[9px] text-gray-500 mt-1.5">Geçerli bir Habbo rozet kodu girerseniz tuvale yüklenir.</p>
            </div>
          </>
        )}

        {/* ŞEKİLLER */}
        {tab === 'shape' && (
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <Shapes className="w-3.5 h-3.5" /> Şekiller
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SHAPES.map((sh) => (
                <button
                  key={sh.kind}
                  onClick={() => addLayer(createShapeLayer(sh.kind as ShapeKind))}
                  className="aspect-square rounded-[3px] bg-[#050a14] border border-[#1e293b] hover:border-[#facc15] flex items-center justify-center p-3 transition-all cursor-pointer"
                  title={sh.name}
                >
                  <div className="w-full h-full text-[#facc15]">
                    <ShapePreview kind={sh.kind as ShapeKind} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* YÜKLE */}
        {tab === 'upload' && (
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-[3px] border-2 border-dashed border-[#334155] hover:border-[#facc15] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <Upload className="w-6 h-6" />
              <span className="text-[11px] font-bold">Görsel Yükle</span>
              <span className="text-[9px] text-gray-500">PNG, JPG, GIF, SVG</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <div className="text-[10px] text-gray-500 leading-relaxed">
              Yüklenen görsel tuvale katman olarak eklenir. Habbo görsellerini doğrudan URL ile kullanmak için görsel katmanına tıklayıp sağ panelden URL girin.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShapePreview({ kind }: { kind: ShapeKind }) {
  const w = '100%';
  const h = '100%';
  const style = { width: w, height: h, display: 'block' } as const;
  switch (kind) {
    case 'circle':
      return <svg style={style}><circle cx="50%" cy="50%" r="48%" fill="currentColor" /></svg>;
    case 'triangle':
      return <svg style={style}><polygon points="50,2 98,98 2,98" fill="currentColor" /></svg>;
    case 'star':
      return <svg style={style} viewBox="0 0 100 100"><polygon points="50,3 61,38 98,38 68,60 79,95 50,73 21,95 32,60 2,38 39,38" fill="currentColor" /></svg>;
    case 'heart':
      return <svg style={style} viewBox="0 0 100 100"><path d="M50 88 C 15 62, 4 38, 14 24 C 22 12, 42 14, 50 28 C 58 14, 78 12, 86 24 C 96 38, 85 62, 50 88 Z" fill="currentColor" /></svg>;
    case 'line':
      return <svg style={style}><line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg>;
    default:
      return <svg style={style}><rect width="100%" height="100%" rx="12" fill="currentColor" /></svg>;
  }
}
