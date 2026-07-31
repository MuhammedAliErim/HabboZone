'use client';

import React, { useRef, useState } from 'react';
import {
  Undo2, Redo2, ZoomIn, ZoomOut, Download, FileCode2, RotateCcw,
  AlignCenter, ChevronDown, X, Check, Copy, Image as ImageIcon, Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useStudioStore,
  CANVAS_SIZES,
  DEFAULT_BACKGROUND,
  DEFAULT_CANVAS_SIZE,
  createTextLayer,
  createAvatarLayer,
} from './useStudioStore';
import { generateEmbedHtml, exportElementToPng, exportElementToJpeg, downloadDataUrl } from './exportUtils';

export default function StudioToolbar({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> }) {
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const past = useStudioStore((s) => s.past);
  const future = useStudioStore((s) => s.future);
  const zoom = useStudioStore((s) => s.zoom);
  const setZoom = useStudioStore((s) => s.setZoom);
  const canvasSize = useStudioStore((s) => s.canvasSize);
  const setCanvasSize = useStudioStore((s) => s.setCanvasSize);
  const layers = useStudioStore((s) => s.layers);
  const background = useStudioStore((s) => s.background);
  const addLayer = useStudioStore((s) => s.addLayer);
  const reset = useStudioStore((s) => s.reset);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const sizeMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const exportFilename = `habbozone_tasarim_${canvasSize.width}x${canvasSize.height}`;

  const exportPng = async () => {
    if (!canvasRef.current) return;
    setExporting('png');
    try {
      const dataUrl = await exportElementToPng(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
      });
      downloadDataUrl(dataUrl, `${exportFilename}.png`);
      toast.success('PNG görüntüsü indirildi');
    } catch (err) {
      console.error(err);
      toast.error('PNG export başarısız. Görsel URLleri kontrol edin.');
    } finally {
      setExporting(null);
    }
  };

  const exportJpeg = async () => {
    if (!canvasRef.current) return;
    setExporting('jpg');
    try {
      const dataUrl = await exportElementToJpeg(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
      });
      downloadDataUrl(dataUrl, `${exportFilename}.jpg`);
      toast.success('JPEG görüntüsü indirildi');
    } catch (err) {
      console.error(err);
      toast.error('JPEG export başarısız. Görsel URLleri kontrol edin.');
    } finally {
      setExporting(null);
    }
  };

  const copyHtml = async () => {
    const html = generateEmbedHtml(background, layers, canvasSize);
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('HTML embed kodu kopyalandı');
    } catch {
      toast.error('Kopyalama başarısız');
    }
  };

  const handleReset = () => {
    reset({
      layers: [
        createTextLayer({ content: 'HABBOZONE ÖZEL MANŞETİ!', x: 60, y: 80, width: 600, height: 90 }),
        createTextLayer({ content: 'Topluluğun en yeni nadire ve etkinlik haberleri burada!', x: 60, y: 190, width: 520, height: 50, fontSize: 22, fontWeight: 600, color: '#cbd5e1' }),
        createAvatarLayer({ username: 'MuhammedAliErim', x: 880, y: 130, width: 260, height: 380 }),
      ],
      background: DEFAULT_BACKGROUND,
      canvasSize: DEFAULT_CANVAS_SIZE,
    });
    toast.success('Tasarım sıfırlandı');
  };

  return (
    <div className="h-12 shrink-0 bg-[#0a1325] border-b border-[#1e293b] flex items-center gap-1.5 px-3 z-30">
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={past.length === 0}
          className="p-2 rounded-[3px] text-gray-300 hover:bg-[#1e293b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Geri al (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          className="p-2 rounded-[3px] text-gray-300 hover:bg-[#1e293b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Yinele (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-[#1e293b] mx-1" />

      <div className="relative" ref={sizeMenuRef}>
        <button
          onClick={() => { setShowSizeMenu(!showSizeMenu); setShowExportMenu(false); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#050a14] border border-[#1e293b] text-[11px] font-bold text-gray-300 hover:border-[#facc15] hover:text-white transition-all cursor-pointer"
        >
          <AlignCenter className="w-3.5 h-3.5 text-pink-400" />
          {canvasSize.width} × {canvasSize.height}
          <ChevronDown className="w-3 h-3" />
        </button>
        {showSizeMenu && (
          <div className="absolute top-full left-0 mt-1.5 w-56 bg-[#0a1325] border border-[#1e293b] rounded-[3px] shadow-2xl p-1.5 z-50">
            {CANVAS_SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => { setCanvasSize(size); setShowSizeMenu(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[2px] text-[11px] font-bold transition-all cursor-pointer ${
                  canvasSize.id === size.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-300 hover:bg-[#1e293b] hover:text-white'
                }`}
              >
                <span>{size.name}</span>
                <span className="font-mono text-[10px] text-gray-500">{size.width}×{size.height}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-[#1e293b] mx-1" />

      <button
        onClick={() => addLayer(createTextLayer({ content: 'YENİ BAŞLIK', x: 60, y: 60, width: 500, height: 80 }))}
        className="px-2.5 py-1.5 rounded-[3px] bg-[#050a14] border border-[#1e293b] text-[10px] font-bold text-gray-300 hover:border-[#facc15] hover:text-white transition-all cursor-pointer"
      >
        T Yazısı
      </button>
      <button
        onClick={() => addLayer(createAvatarLayer({}))}
        className="px-2.5 py-1.5 rounded-[3px] bg-[#050a14] border border-[#1e293b] text-[10px] font-bold text-gray-300 hover:border-[#facc15] hover:text-white transition-all cursor-pointer"
      >
        Karakter
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => setZoom(zoom * 0.9)}
          className="p-1.5 rounded-[3px] text-gray-300 hover:bg-[#1e293b] hover:text-white transition-all cursor-pointer"
          title="Uzaklaştır"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="w-12 text-center text-[11px] font-mono text-gray-300">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(zoom * 1.1)}
          className="p-1.5 rounded-[3px] text-gray-300 hover:bg-[#1e293b] hover:text-white transition-all cursor-pointer"
          title="Yakınlaştır"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-1 rounded-[3px] text-[10px] font-bold text-gray-400 hover:text-white cursor-pointer"
          title="%%100"
        >
          %100
        </button>
      </div>

      <div className="w-px h-6 bg-[#1e293b] mx-1" />

      <button
        onClick={handleReset}
        className="p-2 rounded-[3px] text-gray-300 hover:bg-[#1e293b] hover:text-yellow-400 transition-all cursor-pointer"
        title="Tasarımı sıfırla"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <div className="relative" ref={exportMenuRef}>
        <button
          onClick={() => { setShowExportMenu(!showExportMenu); setShowSizeMenu(false); }}
          className="flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#facc15] text-black font-black text-xs uppercase hover:bg-yellow-300 transition-all cursor-pointer shadow-lg shadow-yellow-500/10"
        >
          <Download className="w-4 h-4" /> Dışa Aktar
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {showExportMenu && (
          <div className="absolute top-full right-0 mt-1.5 w-60 bg-[#0a1325] border border-[#1e293b] rounded-[3px] shadow-2xl p-1.5 z-50">
            <button
              onClick={exportPng}
              disabled={exporting !== null}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] hover:bg-[#1e293b] transition-all cursor-pointer disabled:opacity-50"
            >
              {exporting === 'png' ? <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" /> : <ImageIcon className="w-4 h-4 text-cyan-400" />}
              <span className="flex flex-col text-left">
                <span className="text-[11px] font-black text-white">PNG İndir</span>
                <span className="text-[9px] text-gray-500">Şeffaf destekli ({canvasSize.width}×{canvasSize.height})</span>
              </span>
            </button>
            <button
              onClick={exportJpeg}
              disabled={exporting !== null}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] hover:bg-[#1e293b] transition-all cursor-pointer disabled:opacity-50"
            >
              {exporting === 'jpg' ? <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" /> : <ImageIcon className="w-4 h-4 text-yellow-400" />}
              <span className="flex flex-col text-left">
                <span className="text-[11px] font-black text-white">JPEG İndir</span>
                <span className="text-[9px] text-gray-500">Sıkıştırılmış görüntü</span>
              </span>
            </button>
            <button
              onClick={() => { setShowHtmlModal(true); setShowExportMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] hover:bg-[#1e293b] transition-all cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 text-pink-400" />
              <span className="flex flex-col text-left">
                <span className="text-[11px] font-black text-white">HTML Embed</span>
                <span className="text-[9px] text-gray-500">Haber & Rehber editörüne yapıştır</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {showHtmlModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowHtmlModal(false)}>
          <div className="bg-[#0a1325] border border-[#1e293b] rounded-[3px] shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b]">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-pink-400" /> HTML Embed Kodu
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Haber veya rehber editöründe kaynak kod (&lt;/&gt;) bölümüne yapıştırın.</p>
              </div>
              <button onClick={() => setShowHtmlModal(false)} className="p-2 rounded-[3px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="bg-[#050a14] border border-[#1e293b] rounded-[3px] p-3 text-[11px] text-gray-300 font-mono h-64 overflow-y-auto whitespace-pre-wrap break-all">
                {generateEmbedHtml(background, layers, canvasSize)}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={copyHtml}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[3px] bg-[#facc15] text-black font-black text-xs uppercase hover:bg-yellow-300 transition-all cursor-pointer"
                >
                  {copied ? <><Check className="w-4 h-4" /> Kopyalandı!</> : <><Copy className="w-4 h-4" /> Kodu Kopyala</>}
                </button>
                <button
                  onClick={() => setShowHtmlModal(false)}
                  className="px-5 py-2.5 rounded-[3px] bg-[#1e293b] text-gray-300 hover:text-white font-black text-xs uppercase transition-all cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
