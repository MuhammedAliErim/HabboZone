'use client';

import { toPng, toJpeg } from 'html-to-image';
import type {
  CanvasBackground,
  CanvasSize,
  Layer,
  TextLayer,
  AvatarLayer,
  StickerLayer,
  ShapeLayer,
  ImageLayer,
} from './useStudioStore';

export function proxifyImageUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export function getAvatarUrl(username: string, direction: number, action: string, size: 'm' | 'l'): string {
  return `https://www.habbo.com/habbo-imaging/avatarimage?user=${encodeURIComponent(username || 'Habbo')}&direction=${direction}&head_direction=${direction}&action=${action}&size=${size}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shapeSvg(layer: ShapeLayer): string {
  const w = layer.width;
  const h = layer.height;
  const fill = layer.fill;
  const stroke = layer.strokeWidth > 0 ? `stroke="${layer.strokeColor}" stroke-width="${layer.strokeWidth}"` : '';
  const fillAttr = `fill="${fill}"`;
  const opacity = layer.opacity;
  switch (layer.shape) {
    case 'circle':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="opacity:${opacity}"><circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 2 - Math.max(layer.strokeWidth, 0)}" ${fillAttr} ${stroke}/></svg>`;
    case 'triangle':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="opacity:${opacity}"><polygon points="${w / 2},0 ${w},${h} 0,${h}" ${fillAttr} ${stroke}/></svg>`;
    case 'star':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="opacity:${opacity}"><polygon points="${w / 2},0 ${w * 0.63},${h * 0.35} ${w},${h * 0.38} ${w * 0.7},${h * 0.62} ${w * 0.82},${h} ${w / 2},${h * 0.76} ${w * 0.18},${h} ${w * 0.3},${h * 0.62} 0,${h * 0.38} ${w * 0.37},${h * 0.35}" ${fillAttr} ${stroke}/></svg>`;
    case 'heart':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="opacity:${opacity}"><path d="M${w / 2},${h * 0.82} C${w * 0.1},${h * 0.55} 0,${h * 0.28} ${w * 0.22},${h * 0.14} C${w * 0.4},${h * 0.04} ${w / 2},${h * 0.16} ${w / 2},${h * 0.16} C${w / 2},${h * 0.16} ${w * 0.6},${h * 0.04} ${w * 0.78},${h * 0.14} C${w},${h * 0.28} ${w * 0.9},${h * 0.55} ${w / 2},${h * 0.82}Z" ${fillAttr} ${stroke}/></svg>`;
    case 'line':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="opacity:${opacity}"><line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" ${stroke || `stroke="${fill}"`} stroke-width="${Math.max(layer.strokeWidth, 4)}"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="opacity:${opacity}"><rect width="${w}" height="${h}" rx="${layer.borderRadius}" ${fillAttr} ${stroke}/></svg>`;
  }
}

function layerToHtml(layer: Layer): string {
  const style = `position:absolute;left:${layer.x}px;top:${layer.y}px;width:${layer.width}px;height:${layer.height}px;transform:rotate(${layer.rotation}deg);opacity:${layer.opacity};z-index:${layer.zIndex};overflow:visible;`;
  switch (layer.type) {
    case 'text': {
      const t = layer as TextLayer;
      const textTransform = t.uppercase ? 'uppercase' : 'none';
      const textShadow = t.glow
        ? '0 0 20px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,1)'
        : '2px 2px 4px rgba(0,0,0,0.8)';
      return `<div style="${style}font-family:${t.fontFamily};font-size:${t.fontSize}px;font-weight:${t.fontWeight};font-style:${t.fontStyle};color:${t.color};letter-spacing:${t.letterSpacing}px;line-height:${t.lineHeight};text-align:${t.align};text-transform:${textTransform};text-shadow:${textShadow};white-space:pre-wrap;word-break:break-word;">${escapeHtml(t.content || '')}</div>`;
    }
    case 'avatar': {
      const a = layer as AvatarLayer;
      const src = proxifyImageUrl(getAvatarUrl(a.username, a.direction, a.action, a.avatarSize));
      return `<div style="${style}display:flex;align-items:center;justify-content:center;"><img src="${src}" alt="${escapeHtml(a.username)}" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 12px 20px rgba(0,0,0,0.7));"/></div>`;
    }
    case 'sticker': {
      const s = layer as StickerLayer;
      const src = proxifyImageUrl(s.icon);
      return `<div style="${style}display:flex;align-items:center;justify-content:center;"><img src="${src}" alt="${escapeHtml(s.label)}" style="max-width:100%;max-height:100%;object-fit:contain;"/></div>`;
    }
    case 'shape':
      return `<div style="${style}"><div style="width:100%;height:100%;">${shapeSvg(layer as ShapeLayer)}</div></div>`;
    case 'image': {
      const im = layer as ImageLayer;
      const src = proxifyImageUrl(im.src);
      return `<div style="${style}overflow:hidden;border-radius:${im.borderRadius}px;"><img src="${src}" alt="${escapeHtml(im.name)}" style="width:100%;height:100%;object-fit:cover;"/></div>`;
    }
    default:
      return '';
  }
}

function backgroundStyle(bg: CanvasBackground): string {
  if (bg.kind === 'color') {
    return `background-color:${bg.color};`;
  }
  if (bg.kind === 'gradient') {
    return `background-image:${bg.gradient};`;
  }
  const overlay = Math.round(bg.overlayOpacity * 100) / 100;
  return `background-color:#0a1224;background-image:url('${proxifyImageUrl(bg.imageUrl || '')}'),linear-gradient(to right, rgba(2,6,16,${overlay}), rgba(2,6,16,${Math.max(0.2, overlay - 0.35)}), rgba(2,6,16,${Math.max(0.1, overlay - 0.55)}));background-size:cover;background-position:center;`;
}

export function generateEmbedHtml(bg: CanvasBackground, layers: Layer[], size: CanvasSize): string {
  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  const layersHtml = sorted.map(layerToHtml).join('\n  ');
  return `<div style="position:relative;overflow:hidden;width:100%;border-radius:8px;${backgroundStyle(bg)}aspect-ratio:${size.width}/${size.height};">
  ${layersHtml}
</div>`;
}

export interface ExportOptions {
  width: number;
  height: number;
  pixelRatio?: number;
  backgroundColor?: string;
}

async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const onLoad = () => resolve();
              const onError = () => resolve();
              img.addEventListener('load', onLoad);
              img.addEventListener('error', onError);
              setTimeout(resolve, 4000);
            })
    )
  );
}

export async function exportElementToPng(node: HTMLElement, options: ExportOptions): Promise<string> {
  await waitForImages(node);
  return toPng(node, {
    width: options.width,
    height: options.height,
    pixelRatio: options.pixelRatio ?? 2,
    cacheBust: false,
    style: { margin: '0', padding: '0', transform: 'none' },
  });
}

export async function exportElementToJpeg(node: HTMLElement, options: ExportOptions): Promise<string> {
  await waitForImages(node);
  return toJpeg(node, {
    width: options.width,
    height: options.height,
    pixelRatio: options.pixelRatio ?? 2,
    quality: 0.95,
    backgroundColor: options.backgroundColor ?? '#0a1224',
    cacheBust: false,
    style: { margin: '0', padding: '0', transform: 'none' },
  });
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
