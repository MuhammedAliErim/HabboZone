'use client';

import { create } from 'zustand';

export type LayerType = 'text' | 'avatar' | 'sticker' | 'shape' | 'image';
export type ShapeKind = 'rectangle' | 'circle' | 'line' | 'triangle' | 'star' | 'heart';
export type TextAlign = 'left' | 'center' | 'right';

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  color: string;
  letterSpacing: number;
  lineHeight: number;
  align: TextAlign;
  uppercase: boolean;
  glow: boolean;
}

export interface AvatarLayer extends BaseLayer {
  type: 'avatar';
  username: string;
  direction: number;
  action: string;
  avatarSize: 'm' | 'l';
}

export interface StickerLayer extends BaseLayer {
  type: 'sticker';
  icon: string;
  label: string;
  badgeCode?: string;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shape: ShapeKind;
  fill: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius: number;
  shadow: boolean;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  name: string;
  borderRadius: number;
}

export type Layer = TextLayer | AvatarLayer | StickerLayer | ShapeLayer | ImageLayer;

export interface CanvasBackground {
  kind: 'image' | 'color' | 'gradient';
  imageUrl: string | null;
  color: string;
  gradient: string;
  overlayOpacity: number;
  templateName?: string;
}

export interface CanvasSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface StudioSnapshot {
  layers: Layer[];
  background: CanvasBackground;
  canvasSize: CanvasSize;
}

interface StudioState extends StudioSnapshot {
  selectedId: string | null;
  zoom: number;
  past: StudioSnapshot[];
  future: StudioSnapshot[];
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, patch: Partial<Layer>) => void;
  updateLayerLive: (id: string, patch: Partial<Layer>) => void;
  beginGesture: () => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  select: (id: string | null) => void;
  reorder: (id: string, dir: 'front' | 'back' | 'forward' | 'backward') => void;
  setBackground: (patch: Partial<CanvasBackground>) => void;
  setCanvasSize: (size: CanvasSize) => void;
  setZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
  load: (snapshot: StudioSnapshot) => void;
  reset: (snapshot: StudioSnapshot) => void;
}

export const CANVAS_SIZES: CanvasSize[] = [
  { id: 'news', name: 'Haber Manşeti', width: 1200, height: 630 },
  { id: 'guide', name: 'Rehber Bannerı', width: 800, height: 450 },
  { id: 'card', name: 'Etkinlik Kartı', width: 600, height: 400 },
  { id: 'square', name: 'Kare Paylaşım', width: 1080, height: 1080 },
  { id: 'story', name: 'Hikaye (Story)', width: 1080, height: 1920 },
  { id: 'badge', name: 'Rozet & İkon', width: 300, height: 300 },
];

export const TEMPLATES = [
  { id: 'reception', name: 'Habbo Resepsiyon', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_4.png', color: '#1e3a8a' },
  { id: 'vip', name: 'VIP Lounge & Kulüp', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_general.png', color: '#312e81' },
  { id: 'cyberpunk', name: 'Siberpunk & Neon', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_hc20_1.png', color: '#0f172a' },
  { id: 'theatre', name: 'Klasik Tiyatro Sahnesi', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_gen15_2.png', color: '#451a03' },
  { id: 'party', name: 'Gece Kulübü Partisi', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_party16.png', color: '#4a044e' },
  { id: 'jungle', name: 'Zümrüt Doğa & Orman', url: 'https://images.habbo.com/web_images/habbo-web-articles/lpromo_jungle15.png', color: '#064e3b' },
  { id: 'winter', name: 'Koyu Lüks HabboZone', url: 'https://images.habbo.com/c_images/reception/reception_backdrop_winter.png', color: '#090d16' },
];

export const STICKERS = [
  { id: 'hc', name: 'Habbo Kulüp (HC)', icon: 'https://images.habbo.com/c_images/album1584/HC1.gif' },
  { id: 'vip_badge', name: 'VIP Rozeti', icon: 'https://images.habbo.com/c_images/album1584/VIP.gif' },
  { id: 'credit', name: 'Kredi İkonu', icon: '/images/credits.png' },
  { id: 'diamond', name: 'Elmas İkonu', icon: '/images/diamonds.png' },
  { id: 'duck', name: 'Ördek (Duck)', icon: 'https://images.habbo.com/c_images/catalogue/icon_98.png' },
  { id: 'trophy', name: 'Altın Kupa', icon: 'https://images.habbo.com/c_images/catalogue/icon_201.png' },
];

export const SHAPES: { kind: ShapeKind; name: string }[] = [
  { kind: 'rectangle', name: 'Kare' },
  { kind: 'circle', name: 'Daire' },
  { kind: 'line', name: 'Çizgi' },
  { kind: 'triangle', name: 'Üçgen' },
  { kind: 'star', name: 'Yıldız' },
  { kind: 'heart', name: 'Kalp' },
];

export const FONT_FAMILIES = [
  { id: 'sans', name: 'Modern Sans', family: 'Ubuntu, Arial, sans-serif' },
  { id: 'serif', name: 'Lüks Serif', family: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', name: 'Siberpunk Mono', family: '"Courier New", monospace' },
  { id: 'cursive', name: 'Eğlenceli El Yazısı', family: '"Comic Sans MS", "Segoe UI", cursive' },
];

export const TEXT_COLORS = [
  { label: 'Beyaz', value: '#ffffff' },
  { label: 'Habbo Sarısı', value: '#facc15' },
  { label: 'Neon Mavisi', value: '#38bdf8' },
  { label: 'Ateş Kırmızısı', value: '#ef4444' },
  { label: 'Zümrüt Yeşili', value: '#34d399' },
  { label: 'Mor Glow', value: '#c084fc' },
  { label: 'Altın Turuncu', value: '#fb923c' },
  { label: 'Siyah', value: '#000000' },
];

export const SOLID_COLORS = [
  { label: 'Lacivert', value: '#0a1224' },
  { label: 'Mor', value: '#312e81' },
  { label: 'Kırmızı', value: '#7f1d1d' },
  { label: 'Zümrüt', value: '#064e3b' },
  { label: 'Pembe', value: '#701a75' },
  { label: 'Beyaz', value: '#f8fafc' },
];

export const GRADIENTS = [
  { label: 'Gece', value: 'linear-gradient(135deg, #0f172a, #312e81)' },
  { label: 'Ateş', value: 'linear-gradient(135deg, #7f1d1d, #f59e0b)' },
  { label: 'Neon', value: 'linear-gradient(135deg, #164e63, #c026d3)' },
  { label: 'Canva', value: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  { label: 'Altın', value: 'linear-gradient(135deg, #451a03, #facc15)' },
];

export const DEFAULT_CANVAS_SIZE = CANVAS_SIZES[0];

export const DEFAULT_BACKGROUND: CanvasBackground = {
  kind: 'image',
  imageUrl: TEMPLATES[0].url,
  color: '#0a1224',
  gradient: GRADIENTS[0].value,
  overlayOpacity: 0.7,
  templateName: TEMPLATES[0].name,
};

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createTextLayer(overrides?: Partial<TextLayer>): TextLayer {
  return {
    id: makeId('text'),
    type: 'text',
    name: 'Metin Katmanı',
    x: 60,
    y: 60,
    width: 500,
    height: 80,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    visible: true,
    locked: false,
    content: 'BAŞLIĞINIZI YAZIN',
    fontSize: 44,
    fontFamily: FONT_FAMILIES[0].family,
    fontWeight: 900,
    fontStyle: 'normal',
    color: '#ffffff',
    letterSpacing: 0,
    lineHeight: 1.15,
    align: 'left',
    uppercase: true,
    glow: true,
    ...overrides,
  };
}

export function createAvatarLayer(overrides?: Partial<AvatarLayer>): AvatarLayer {
  return {
    id: makeId('avatar'),
    type: 'avatar',
    name: 'Habbo Karakteri',
    x: 880,
    y: 120,
    width: 260,
    height: 380,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    visible: true,
    locked: false,
    username: 'MuhammedAliErim',
    direction: 3,
    action: 'wav',
    avatarSize: 'l',
    ...overrides,
  };
}

export function createStickerLayer(icon: string, label: string, overrides?: Partial<StickerLayer>): StickerLayer {
  return {
    id: makeId('sticker'),
    type: 'sticker',
    name: label,
    x: 80,
    y: 200,
    width: 90,
    height: 90,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    visible: true,
    locked: false,
    icon,
    label,
    ...overrides,
  };
}

export function createShapeLayer(kind: ShapeKind, overrides?: Partial<ShapeLayer>): ShapeLayer {
  return {
    id: makeId('shape'),
    type: 'shape',
    name: kind === 'line' ? 'Çizgi' : 'Şekil',
    x: 60,
    y: 60,
    width: kind === 'line' ? 240 : 160,
    height: kind === 'line' ? 6 : 160,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    visible: true,
    locked: false,
    shape: kind,
    fill: '#facc15',
    strokeColor: '#ffffff',
    strokeWidth: 0,
    borderRadius: 12,
    shadow: false,
    ...overrides,
  };
}

export function createImageLayer(src: string, name: string, overrides?: Partial<ImageLayer>): ImageLayer {
  return {
    id: makeId('image'),
    type: 'image',
    name,
    x: 60,
    y: 60,
    width: 300,
    height: 200,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    visible: true,
    locked: false,
    src,
    borderRadius: 8,
    ...overrides,
  };
}

const HISTORY_LIMIT = 60;

function pushHistory(past: StudioSnapshot[], current: StudioSnapshot): StudioSnapshot[] {
  const next = [...past, current];
  if (next.length > HISTORY_LIMIT) next.shift();
  return next;
}

export const useStudioStore = create<StudioState>((set) => ({
  layers: [],
  background: DEFAULT_BACKGROUND,
  canvasSize: DEFAULT_CANVAS_SIZE,
  selectedId: null,
  zoom: 0.5,
  past: [],
  future: [],

  addLayer: (layer) => set((state) => ({
    layers: [...state.layers, layer],
    selectedId: layer.id,
    past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
    future: [],
  })),

  updateLayer: (id, patch) => set((state) => {
    const target = state.layers.find((l) => l.id === id);
    if (!target) return state;
    return {
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...patch } as Layer : l)),
      past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
      future: [],
    };
  }),

  updateLayerLive: (id, patch) => set((state) => {
    const target = state.layers.find((l) => l.id === id);
    if (!target) return state;
    return {
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...patch } as Layer : l)),
    };
  }),

  beginGesture: () => set((state) => ({
    past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
    future: [],
  })),

  removeLayer: (id) => set((state) => {
    const next = state.layers.filter((l) => l.id !== id);
    return {
      layers: next,
      selectedId: state.selectedId === id ? null : state.selectedId,
      past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
      future: [],
    };
  }),

  duplicateLayer: (id) => set((state) => {
    const src = state.layers.find((l) => l.id === id);
    if (!src) return state;
    const copy: Layer = {
      ...src,
      id: makeId(src.type),
      name: `${src.name} kopyası`,
      x: src.x + 24,
      y: src.y + 24,
      zIndex: src.zIndex + 1,
    } as Layer;
    return {
      layers: [...state.layers, copy],
      selectedId: copy.id,
      past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
      future: [],
    };
  }),

  select: (selectedId) => set({ selectedId }),

  reorder: (id, dir) => set((state) => {
    const target = state.layers.find((l) => l.id === id);
    if (!target) return state;
    const sorted = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((l) => l.id === id);
    if (idx === -1) return state;
    if (dir === 'front') sorted[idx].zIndex = (sorted[sorted.length - 1]?.zIndex ?? 0) + 1;
    else if (dir === 'back') sorted[idx].zIndex = (sorted[0]?.zIndex ?? 0) - 1;
    else if (dir === 'forward' && idx < sorted.length - 1) {
      const swap = sorted[idx + 1];
      const tmp = sorted[idx].zIndex;
      sorted[idx].zIndex = swap.zIndex;
      swap.zIndex = tmp;
    } else if (dir === 'backward' && idx > 0) {
      const swap = sorted[idx - 1];
      const tmp = sorted[idx].zIndex;
      sorted[idx].zIndex = swap.zIndex;
      swap.zIndex = tmp;
    }
    return {
      layers: [...sorted],
      past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
      future: [],
    };
  }),

  setBackground: (patch) => set((state) => ({
    background: { ...state.background, ...patch },
    past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
    future: [],
  })),

  setCanvasSize: (canvasSize) => set((state) => ({
    canvasSize,
    past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
    future: [],
  })),

  setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.1, zoom)) }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    return {
      ...previous,
      past: newPast,
      future: [{ layers: state.layers, background: state.background, canvasSize: state.canvasSize }, ...state.future].slice(0, HISTORY_LIMIT),
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    return {
      ...next,
      past: pushHistory(state.past, { layers: state.layers, background: state.background, canvasSize: state.canvasSize }),
      future: state.future.slice(1),
    };
  }),

  load: (snapshot) => set({ ...snapshot, past: [], future: [] }),

  reset: (snapshot) => set({ ...snapshot, selectedId: null, zoom: 0.5, past: [], future: [] }),
}));
