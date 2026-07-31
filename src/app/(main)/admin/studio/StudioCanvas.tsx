'use client';

import React, { useCallback, useState } from 'react';
import { Rnd } from 'react-rnd';
import { RotateCw, Lock } from 'lucide-react';
import {
  useStudioStore,
  type Layer,
  type TextLayer,
  type AvatarLayer,
  type StickerLayer,
  type ShapeLayer,
  type ImageLayer,
  type ShapeKind,
} from './useStudioStore';
import { getAvatarUrl } from './exportUtils';

const ROTATE_SNAP = 8;

function ShapeSvg({ kind, fill, strokeColor, strokeWidth, borderRadius, className }: {
  kind: ShapeKind; fill: string; strokeColor: string; strokeWidth: number; borderRadius: number; className?: string;
}) {
  const common = {
    className,
    style: { width: '100%', height: '100%', display: 'block' } as const,
  };
  switch (kind) {
    case 'circle':
      return (
        <svg {...common}>
          <circle cx="50%" cy="50%" r="47%" fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'triangle':
      return (
        <svg {...common}>
          <polygon points="50,2 98,98 2,98" fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'star':
      return (
        <svg {...common} viewBox="0 0 100 100">
          <polygon
            points="50,3 61,38 98,38 68,60 79,95 50,73 21,95 32,60 2,38 39,38"
            fill={fill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common} viewBox="0 0 100 100">
          <path
            d="M50 88 C 15 62, 4 38, 14 24 C 22 12, 42 14, 50 28 C 58 14, 78 12, 86 24 C 96 38, 85 62, 50 88 Z"
            fill={fill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    case 'line':
      return (
        <svg {...common}>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke={strokeColor !== '#ffffff' || strokeWidth > 0 ? strokeColor : fill} strokeWidth={Math.max(strokeWidth, 4)} strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect width="100%" height="100%" rx={borderRadius} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
  }
}

function LayerContent({ layer, editingText, onTextChange, onCommitText }: {
  layer: Layer;
  editingText: boolean;
  onTextChange: (text: string) => void;
  onCommitText: () => void;
}) {
  switch (layer.type) {
    case 'text': {
      const t = layer as TextLayer;
      return (
        <div
          className="w-full h-full flex items-center"
          style={{
            fontFamily: t.fontFamily,
            fontSize: t.fontSize,
            fontWeight: t.fontWeight,
            fontStyle: t.fontStyle,
            color: t.color,
            letterSpacing: t.letterSpacing,
            lineHeight: t.lineHeight,
            textAlign: t.align,
            textTransform: t.uppercase ? 'uppercase' : 'none',
            textShadow: t.glow ? '0 0 20px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,1)' : '2px 2px 4px rgba(0,0,0,0.8)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            outline: 'none',
          }}
          contentEditable={editingText}
          suppressContentEditableWarning
          onInput={(e) => onTextChange((e.currentTarget as HTMLElement).innerText)}
          onBlur={onCommitText}
          onDoubleClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => {
            if (!editingText) return;
            e.stopPropagation();
          }}
        >
          {t.content || ' '}
        </div>
      );
    }
    case 'avatar': {
      const a = layer as AvatarLayer;
      const src = getAvatarUrl(a.username, a.direction, a.action, a.avatarSize);
      return (
        <div className="w-full h-full flex items-center justify-center select-none">
          <img
            src={src}
            alt={a.username}
            draggable={false}
            className="max-w-full max-h-full object-contain pointer-events-none"
            style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.7))' }}
          />
        </div>
      );
    }
    case 'sticker': {
      const s = layer as StickerLayer;
      return (
        <div className="w-full h-full flex items-center justify-center select-none">
          <img src={s.icon} alt={s.label} draggable={false} className="max-w-full max-h-full object-contain pointer-events-none" />
        </div>
      );
    }
    case 'shape': {
      const sh = layer as ShapeLayer;
      return (
        <div className="w-full h-full select-none" style={{ filter: sh.shadow ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' : 'none' }}>
          <ShapeSvg kind={sh.shape} fill={sh.fill} strokeColor={sh.strokeColor} strokeWidth={sh.strokeWidth} borderRadius={sh.borderRadius} />
        </div>
      );
    }
    case 'image': {
      const im = layer as ImageLayer;
      return (
        <div className="w-full h-full overflow-hidden select-none" style={{ borderRadius: im.borderRadius }}>
          <img src={im.src} alt={im.name} draggable={false} className="w-full h-full object-cover pointer-events-none" />
        </div>
      );
    }
    default:
      return null;
  }
}

interface LayerNodeProps {
  layer: Layer;
  selected: boolean;
  zoom: number;
}

function LayerNode({ layer, selected, zoom }: LayerNodeProps) {
  const select = useStudioStore((s) => s.select);
  const updateLayerLive = useStudioStore((s) => s.updateLayerLive);
  const beginGesture = useStudioStore((s) => s.beginGesture);
  const [editingText, setEditingText] = useState(false);

  const isSelected = selected && !editingText;

  const onRotateStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    beginGesture();
    const onMove = (ev: PointerEvent) => {
      const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI) + 90;
      const snapped = Math.round(angle / ROTATE_SNAP) * ROTATE_SNAP;
      updateLayerLive(layer.id, { rotation: (360 + snapped) % 360 });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [layer, beginGesture, updateLayerLive]);

  const handleDragStart = useCallback(() => beginGesture(), [beginGesture]);
  const handleDrag = useCallback((_: unknown, d: { x: number; y: number }) => {
    updateLayerLive(layer.id, { x: d.x, y: d.y });
  }, [layer.id, updateLayerLive]);

  const handleResize = useCallback((_: unknown, __: unknown, ref: HTMLElement, ___: unknown, position: { x: number; y: number }) => {
    updateLayerLive(layer.id, {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      x: position.x,
      y: position.y,
    });
  }, [layer.id, updateLayerLive]);

  const isText = layer.type === 'text';

  return (
    <Rnd
      size={{ width: layer.width, height: layer.height }}
      position={{ x: layer.x, y: layer.y }}
      scale={zoom}
      bounds="parent"
      disableDragging={layer.locked}
      enableResizing={!layer.locked}
      className={`absolute rounded-none ${isSelected ? 'z-50' : ''}`}
      style={{ zIndex: 40 }}
      onMouseDown={() => select(layer.id)}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onResizeStart={handleDragStart}
      onResize={handleResize}
      resizeHandleStyles={{
        bottomRight: { width: 12, height: 12, right: -6, bottom: -6, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'nwse-resize' },
        bottomLeft: { width: 12, height: 12, left: -6, bottom: -6, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'nesw-resize' },
        topRight: { width: 12, height: 12, right: -6, top: -6, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'nesw-resize' },
        topLeft: { width: 12, height: 12, left: -6, top: -6, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'nwse-resize' },
        top: { width: 16, height: 8, left: '50%', transform: 'translateX(-50%)', top: -4, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'ns-resize' },
        bottom: { width: 16, height: 8, left: '50%', transform: 'translateX(-50%)', bottom: -4, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'ns-resize' },
        left: { width: 8, height: 16, top: '50%', transform: 'translateY(-50%)', left: -4, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'ew-resize' },
        right: { width: 8, height: 16, top: '50%', transform: 'translateY(-50%)', right: -4, borderRadius: 2, background: '#38bdf8', border: '1px solid #0a1224', cursor: 'ew-resize' },
      }}
      lockAspectRatio={layer.type === 'avatar'}
      minWidth={isText ? 20 : 12}
      minHeight={isText ? 16 : 12}
    >
      <div
        className={`w-full h-full ${layer.type !== 'text' ? 'overflow-hidden' : ''}`}
        style={{ transform: `rotate(${layer.rotation}deg)`, opacity: layer.opacity }}
      >
        <LayerContent
          layer={layer}
          editingText={editingText}
          onTextChange={(text) => updateLayerLive(layer.id, { content: text })}
          onCommitText={() => setEditingText(false)}
        />
      </div>

      {isSelected && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ border: '2px solid #38bdf8', boxShadow: '0 0 0 1px rgba(10,18,36,0.8)' }}
          />
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#38bdf8] border-2 border-[#0a1224] flex items-center justify-center cursor-grab active:cursor-grabbing z-50"
            style={{ touchAction: 'none' }}
            onPointerDown={onRotateStart}
            title="Döndür"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#0a1224]" />
          </div>
          {layer.locked && (
            <div className="absolute -top-2 left-2 text-[#0a1224]">
              <Lock className="w-3 h-3" />
            </div>
          )}
        </>
      )}

      {isText && !editingText && (
        <div
          className="absolute inset-0 cursor-text"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditingText(true);
            select(layer.id);
            setTimeout(() => {
              const el = e.currentTarget.parentElement?.querySelector('[contenteditable="true"]');
              (el as HTMLElement | null)?.focus();
            }, 0);
          }}
        />
      )}
    </Rnd>
  );
}

export default function StudioCanvas({ canvasRef }: { canvasRef?: React.RefObject<HTMLDivElement | null> }) {
  const canvasSize = useStudioStore((s) => s.canvasSize);
  const layers = useStudioStore((s) => s.layers);
  const background = useStudioStore((s) => s.background);
  const selectedId = useStudioStore((s) => s.selectedId);
  const zoom = useStudioStore((s) => s.zoom);
  const select = useStudioStore((s) => s.select);
  const setZoom = useStudioStore((s) => s.setZoom);

  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  const visible = sorted.filter((l) => l.visible);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(useStudioStore.getState().zoom * factor);
    }
  }, [setZoom]);

  return (
    <div
      className="flex-1 relative overflow-hidden bg-[#05070f] flex items-center justify-center"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
      onClick={() => select(null)}
      onWheel={handleWheel}
    >
      <div
        className="relative shadow-2xl transition-transform duration-100"
        style={{
          width: canvasSize.width * zoom,
          height: canvasSize.height * zoom,
        }}
      >
        <div
          ref={canvasRef}
          className="relative overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: canvasSize.width, height: canvasSize.height }}
        >
          {/* Arka Plan */}
          {background.kind === 'color' ? (
            <div className="absolute inset-0" style={{ backgroundColor: background.color }} />
          ) : background.kind === 'gradient' ? (
            <div className="absolute inset-0" style={{ backgroundImage: background.gradient }} />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: '#0a1224',
                backgroundImage: `url('${background.imageUrl || ''}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(2,6,16,${background.overlayOpacity}), rgba(2,6,16,${Math.max(0.2, background.overlayOpacity - 0.35)}), rgba(2,6,16,${Math.max(0.1, background.overlayOpacity - 0.55)}))` }} />
            </div>
          )}

          {/* Katmanlar */}
          {visible.map((layer) => (
            <LayerNode key={layer.id} layer={layer} selected={selectedId === layer.id} zoom={zoom} />
          ))}
        </div>
      </div>
    </div>
  );
}
