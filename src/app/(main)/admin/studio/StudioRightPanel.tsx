'use client';

import React from 'react';
import {
  Trash2, Copy, Lock, Unlock, Eye, EyeOff, ChevronsUp, ChevronsDown,
  ArrowUp, ArrowDown, Type, User, Award, Shapes, Image as ImageIcon,
} from 'lucide-react';
import {
  useStudioStore,
  FONT_FAMILIES,
  TEXT_COLORS,
  SOLID_COLORS,
  SHAPES,
  type Layer,
  type TextLayer,
  type AvatarLayer,
  type StickerLayer,
  type ShapeLayer,
  type ImageLayer,
  type ShapeKind,
} from './useStudioStore';

const AVATAR_ACTIONS = [
  { id: 'std', name: 'Ayakta' },
  { id: 'wav', name: 'El Sallama' },
  { id: 'wlk', name: 'Yürüme' },
  { id: 'sit', name: 'Oturma' },
  { id: 'drk=1', name: 'İçecek' },
  { id: 'crr=1', name: 'Taşıma' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#1e293b] pb-4 pt-4 first:pt-0 last:border-b-0">
      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2.5">{title}</label>
      {children}
    </div>
  );
}

function NumberField({ label, value, min, max, onChange }: {
  label: string; value: number; min?: number; max?: number; onChange: (n: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 flex-1 min-w-0">
      <span className="text-[9px] font-bold uppercase text-gray-500">{label}</span>
      <input
        type="number"
        value={Math.round(value * 10) / 10}
        min={min}
        max={max}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function SliderField({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold uppercase text-gray-500">{label}</span>
        <span className="text-[10px] font-mono text-yellow-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-500 h-1.5 cursor-pointer"
      />
    </div>
  );
}

function ColorRow({ title, value, onSelect }: {
  title: string; value: string; onSelect: (v: string) => void;
}) {
  return (
    <div>
      <span className="text-[9px] font-bold uppercase text-gray-500 block mb-1.5">{title}</span>
      <div className="flex flex-wrap gap-1.5">
        {TEXT_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onSelect(c.value)}
            title={c.label}
            className={`w-7 h-7 rounded-[3px] border-2 transition-all cursor-pointer ${
              value.toLowerCase() === c.value.toLowerCase() ? 'border-[#facc15] scale-110' : 'border-[#1e293b] hover:border-white'
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          className="w-7 h-7 rounded-[3px] bg-[#050a14] border border-[#1e293b] cursor-pointer p-0"
          title="Özel renk"
        />
      </div>
    </div>
  );
}

function TextSettings({ layer }: { layer: TextLayer }) {
  const updateLayer = useStudioStore((s) => s.updateLayer);
  const set = (patch: Partial<TextLayer>) => updateLayer(layer.id, patch);
  return (
    <>
      <Section title="Metin">
        <textarea
          value={layer.content}
          onChange={(e) => set({ content: e.target.value })}
          rows={3}
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-cyan-500 resize-none"
          placeholder="Metin girin..."
        />
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {(['left', 'center', 'right'] as const).map((al) => (
            <button
              key={al}
              onClick={() => set({ align: al })}
              className={`px-2.5 py-1 rounded-[2px] text-[9px] font-black uppercase border transition-all cursor-pointer ${
                layer.align === al ? 'bg-[#facc15] text-black border-[#facc15]' : 'bg-[#050a14] border-[#1e293b] text-gray-400 hover:text-white'
              }`}
            >
              {al === 'left' ? 'Sol' : al === 'center' ? 'Orta' : 'Sağ'}
            </button>
          ))}
          <button
            onClick={() => set({ uppercase: !layer.uppercase })}
            className={`px-2.5 py-1 rounded-[2px] text-[9px] font-black uppercase border transition-all cursor-pointer ${
              layer.uppercase ? 'bg-[#facc15] text-black border-[#facc15]' : 'bg-[#050a14] border-[#1e293b] text-gray-400 hover:text-white'
            }`}
          >
            AA
          </button>
          <button
            onClick={() => set({ glow: !layer.glow })}
            className={`px-2.5 py-1 rounded-[2px] text-[9px] font-black uppercase border transition-all cursor-pointer ${
              layer.glow ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-[#050a14] border-[#1e293b] text-gray-400 hover:text-white'
            }`}
          >
            ✨ Glow
          </button>
          <button
            onClick={() => set({ fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`px-2.5 py-1 rounded-[2px] text-[9px] font-black uppercase border transition-all cursor-pointer italic ${
              layer.fontStyle === 'italic' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-[#050a14] border-[#1e293b] text-gray-400 hover:text-white'
            }`}
          >
            I
          </button>
        </div>
      </Section>

      <Section title="Tipografi">
        <select
          value={layer.fontFamily}
          onChange={(e) => set({ fontFamily: e.target.value })}
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-cyan-500 mb-2.5"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.id} value={f.family}>{f.name}</option>
          ))}
        </select>
        <SliderField label="Boyut (px)" value={layer.fontSize} min={8} max={200} step={1} onChange={(n) => set({ fontSize: n })} />
        <div className="mt-2.5">
          <SliderField label="Kalınlık" value={layer.fontWeight} min={400} max={900} step={100} onChange={(n) => set({ fontWeight: n })} />
        </div>
        <div className="mt-2.5">
          <SliderField label="Harf Aralığı" value={layer.letterSpacing} min={-5} max={20} step={0.5} onChange={(n) => set({ letterSpacing: n })} />
        </div>
        <div className="mt-2.5">
          <SliderField label="Satır Yüksekliği" value={layer.lineHeight} min={0.8} max={3} step={0.05} onChange={(n) => set({ lineHeight: n })} />
        </div>
      </Section>

      <Section title="Renk">
        <ColorRow title="Metin Rengi" value={layer.color} onSelect={(v) => set({ color: v })} />
      </Section>
    </>
  );
}

function AvatarSettings({ layer }: { layer: AvatarLayer }) {
  const updateLayer = useStudioStore((s) => s.updateLayer);
  const set = (patch: Partial<AvatarLayer>) => updateLayer(layer.id, patch);
  return (
    <>
      <Section title="Karakter">
        <input
          type="text"
          value={layer.username}
          onChange={(e) => set({ username: e.target.value })}
          placeholder="Habbo kullanıcı adı"
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-cyan-500"
        />
        <div className="mt-2.5">
          <SliderField label="Yön" value={layer.direction} min={0} max={7} step={1} onChange={(n) => set({ direction: n })} />
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {AVATAR_ACTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => set({ action: a.id })}
              className={`px-1 py-1.5 rounded-[2px] text-[9px] font-bold border transition-all cursor-pointer ${
                layer.action === a.id ? 'bg-[#facc15] text-black border-[#facc15]' : 'bg-[#050a14] border-[#1e293b] text-gray-400 hover:text-white'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {(['m', 'l'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => set({ avatarSize: sz })}
              className={`flex-1 py-1.5 rounded-[2px] text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                layer.avatarSize === sz ? 'bg-white text-black border-white' : 'bg-[#050a14] border-[#1e293b] text-gray-400 hover:text-white'
              }`}
            >
              {sz === 'm' ? 'Normal' : 'Büyük'}
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}

function StickerSettings({ layer }: { layer: StickerLayer }) {
  return (
    <>
      <Section title="Rozet">
        <div className="text-[11px] text-gray-300 font-bold">{layer.label}</div>
        <div className="mt-2 flex items-center gap-2">
          <img src={layer.icon} alt={layer.label} className="w-10 h-10 object-contain bg-[#050a14] border border-[#1e293b] rounded-[3px] p-1" />
          <span className="text-[9px] text-gray-500">Boyut ve konumu tuvalden sürükleyerek değiştirin.</span>
        </div>
      </Section>
    </>
  );
}

function ShapeSettings({ layer }: { layer: ShapeLayer }) {
  const updateLayer = useStudioStore((s) => s.updateLayer);
  const set = (patch: Partial<ShapeLayer>) => updateLayer(layer.id, patch);
  return (
    <>
      <Section title="Şekil">
        <div className="grid grid-cols-6 gap-1.5">
          {SHAPES.map((sh) => (
            <button
              key={sh.kind}
              onClick={() => set({ shape: sh.kind as ShapeKind })}
              className={`aspect-square rounded-[3px] border flex items-center justify-center p-1.5 transition-all cursor-pointer ${
                layer.shape === sh.kind ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-[#050a14] border-[#1e293b] text-gray-500 hover:text-white'
              }`}
              title={sh.name}
            >
              <ShapeGlyph kind={sh.kind as ShapeKind} />
            </button>
          ))}
        </div>
      </Section>
      <Section title="Dolgu & Kenarlık">
        <ColorRow title="Dolgu Rengi" value={layer.fill} onSelect={(v) => set({ fill: v })} />
        <div className="mt-2.5">
          <SliderField label="Köşe Yuvarlaklığı" value={layer.borderRadius} min={0} max={100} step={1} onChange={(n) => set({ borderRadius: n })} />
        </div>
        <div className="mt-2.5">
          <SliderField label="Kenarlık Kalınlığı" value={layer.strokeWidth} min={0} max={20} step={1} onChange={(n) => set({ strokeWidth: n })} />
        </div>
        <div className="mt-2.5">
          <ColorRow title="Kenarlık Rengi" value={layer.strokeColor} onSelect={(v) => set({ strokeColor: v })} />
        </div>
        <div className="mt-2.5">
          <button
            onClick={() => set({ shadow: !layer.shadow })}
            className={`w-full py-2 rounded-[3px] text-[10px] font-black uppercase border transition-all cursor-pointer ${
              layer.shadow ? 'bg-[#facc15] text-black border-[#facc15]' : 'bg-[#050a14] border-[#1e293b] text-gray-400 hover:text-white'
            }`}
          >
            Gölge: {layer.shadow ? 'Açık' : 'Kapalı'}
          </button>
        </div>
      </Section>
    </>
  );
}

function ImageSettings({ layer }: { layer: ImageLayer }) {
  const updateLayer = useStudioStore((s) => s.updateLayer);
  return (
    <>
      <Section title="Görsel">
        <input
          type="text"
          value={layer.src.startsWith('data:') ? '(Yüklenen görsel)' : layer.src}
          onChange={(e) => updateLayer(layer.id, { src: e.target.value, name: 'URL görseli' })}
          placeholder="Görsel URL'si..."
          className="w-full bg-[#050a14] border border-[#1e293b] rounded-[3px] px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-cyan-500"
        />
        <div className="mt-2.5">
          <SliderField
            label="Köşe Yuvarlaklığı"
            value={layer.borderRadius}
            min={0}
            max={100}
            step={1}
            onChange={(n) => updateLayer(layer.id, { borderRadius: n })}
          />
        </div>
      </Section>
    </>
  );
}

function ShapeGlyph({ kind }: { kind: ShapeKind }) {
  const style = { width: '100%', height: '100%', display: 'block' } as const;
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
      return <svg style={style}><line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="8" strokeLinecap="round" /></svg>;
    default:
      return <svg style={style}><rect width="100%" height="100%" rx="8" fill="currentColor" /></svg>;
  }
}

const TYPE_ICONS: Record<Layer['type'], React.ElementType> = {
  text: Type,
  avatar: User,
  sticker: Award,
  shape: Shapes,
  image: ImageIcon,
};

export default function StudioRightPanel() {
  const layers = useStudioStore((s) => s.layers);
  const selectedId = useStudioStore((s) => s.selectedId);
  const select = useStudioStore((s) => s.select);
  const updateLayer = useStudioStore((s) => s.updateLayer);
  const removeLayer = useStudioStore((s) => s.removeLayer);
  const duplicateLayer = useStudioStore((s) => s.duplicateLayer);
  const reorder = useStudioStore((s) => s.reorder);
  const background = useStudioStore((s) => s.background);
  const setBackground = useStudioStore((s) => s.setBackground);

  const selected = layers.find((l) => l.id === selectedId);
  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="w-72 shrink-0 bg-[#0a1325] border-l border-[#1e293b] flex flex-col overflow-hidden">
      <div className="p-3 border-b border-[#1e293b]">
        <label className="text-[10px] font-black uppercase tracking-wider text-pink-400">Katmanlar</label>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Katman Listesi */}
        <div className="p-3 space-y-1">
          {sorted.length === 0 && (
            <div className="text-[10px] text-gray-500 text-center py-4">Tuvale öğe eklemek için soldaki paneli kullanın.</div>
          )}
          {[...sorted].reverse().map((layer) => {
            const Icon = TYPE_ICONS[layer.type];
            return (
              <div
                key={layer.id}
                onClick={() => select(layer.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-[3px] border transition-all cursor-pointer ${
                  selectedId === layer.id
                    ? 'bg-[#0e3a5c] border-cyan-400/60'
                    : 'bg-[#050a14] border-[#1e293b] hover:border-[#334155]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="flex-1 truncate text-[11px] font-bold text-gray-300">{layer.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                  className="text-gray-500 hover:text-white cursor-pointer"
                  title={layer.visible ? 'Gizle' : 'Göster'}
                >
                  {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-yellow-500" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                  className="text-gray-500 hover:text-white cursor-pointer"
                  title={layer.locked ? 'Kilidi aç' : 'Kilitle'}
                >
                  {layer.locked ? <Lock className="w-3.5 h-3.5 text-yellow-500" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Seçili Katman Ayarları */}
        <div className="border-t border-[#1e293b] p-3">
          {selected ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  {(() => {
                    const Icon = TYPE_ICONS[selected.type];
                    return <Icon className="w-4 h-4 text-cyan-400 shrink-0" />;
                  })()}
                  <span className="text-[11px] font-black text-white uppercase truncate">{selected.name}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => duplicateLayer(selected.id)} title="Çoğalt" className="p-1.5 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeLayer(selected.id)} title="Sil" className="p-1.5 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {([
                  { label: 'En Öne', icon: ChevronsUp, act: () => reorder(selected.id, 'front') },
                  { label: 'İleri', icon: ArrowUp, act: () => reorder(selected.id, 'forward') },
                  { label: 'Geri', icon: ArrowDown, act: () => reorder(selected.id, 'backward') },
                  { label: 'En Arkaya', icon: ChevronsDown, act: () => reorder(selected.id, 'back') },
                ] as { label: string; icon: React.ElementType; act: () => void }[]).map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.act}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-[2px] bg-[#050a14] border border-[#1e293b] text-gray-400 hover:text-white hover:border-cyan-500/50 text-[9px] font-black uppercase transition-all cursor-pointer"
                  >
                    <btn.icon className="w-3 h-3" /> {btn.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-3">
                <NumberField label="X" value={selected.x} onChange={(n) => updateLayer(selected.id, { x: n })} />
                <NumberField label="Y" value={selected.y} onChange={(n) => updateLayer(selected.id, { y: n })} />
                <NumberField label="G" value={selected.width} min={1} onChange={(n) => updateLayer(selected.id, { width: n })} />
                <NumberField label="YÜK" value={selected.height} min={1} onChange={(n) => updateLayer(selected.id, { height: n })} />
              </div>

              <div className="space-y-2.5">
                <SliderField
                  label="Döndürme"
                  value={selected.rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(n) => updateLayer(selected.id, { rotation: n })}
                />
                <SliderField
                  label="Opaklık"
                  value={Math.round(selected.opacity * 100)}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(n) => updateLayer(selected.id, { opacity: n / 100 })}
                />
              </div>

              <div className="mt-4">
                {selected.type === 'text' && <TextSettings layer={selected as TextLayer} />}
                {selected.type === 'avatar' && <AvatarSettings layer={selected as AvatarLayer} />}
                {selected.type === 'sticker' && <StickerSettings layer={selected as StickerLayer} />}
                {selected.type === 'shape' && <ShapeSettings layer={selected as ShapeLayer} />}
                {selected.type === 'image' && <ImageSettings layer={selected as ImageLayer} />}
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2.5">Arka Plan Ayarları</div>
              {background.kind === 'image' && (
                <>
                  <div className="text-[11px] text-gray-300 font-bold mb-1.5">{background.templateName || 'Özel görsel'}</div>
                  <SliderField
                    label="Karartma"
                    value={Math.round(background.overlayOpacity * 100)}
                    min={0}
                    max={95}
                    step={5}
                    onChange={(n) => setBackground({ overlayOpacity: n / 100 })}
                  />
                </>
              )}
              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-[9px] font-bold uppercase text-gray-500 block mb-1.5">Arka Plan Rengi</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SOLID_COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setBackground({ kind: 'color', color: c.value })}
                        title={c.label}
                        className={`w-7 h-7 rounded-[3px] border-2 transition-all cursor-pointer ${
                          background.kind === 'color' && background.color === c.value ? 'border-[#facc15] scale-110' : 'border-[#1e293b] hover:border-white'
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[9px] text-gray-500">Bir katman seçtiğinizde ayarları burada görünür.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
