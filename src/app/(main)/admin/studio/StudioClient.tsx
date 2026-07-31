'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import StudioToolbar from './StudioToolbar';
import StudioLeftPanel from './StudioLeftPanel';
import StudioCanvas from './StudioCanvas';
import StudioRightPanel from './StudioRightPanel';
import {
  useStudioStore,
  DEFAULT_BACKGROUND,
  DEFAULT_CANVAS_SIZE,
  createTextLayer,
  createAvatarLayer,
} from './useStudioStore';

export default function StudioClient() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const load = useStudioStore((s) => s.load);
  const layers = useStudioStore((s) => s.layers);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const selectedId = useStudioStore((s) => s.selectedId);
  const select = useStudioStore((s) => s.select);
  const updateLayer = useStudioStore((s) => s.updateLayer);
  const removeLayer = useStudioStore((s) => s.removeLayer);
  const duplicateLayer = useStudioStore((s) => s.duplicateLayer);

  useEffect(() => {
    if (layers.length === 0) {
      load({
        layers: [
          createTextLayer({ content: 'HABBOZONE ÖZEL MANŞETİ!', x: 60, y: 80, width: 600, height: 90 }),
          createTextLayer({ content: 'Topluluğun en yeni nadire ve etkinlik haberleri burada!', x: 60, y: 190, width: 520, height: 50, fontSize: 22, fontWeight: 600, color: '#cbd5e1' }),
          createAvatarLayer({ username: 'MuhammedAliErim', x: 880, y: 130, width: 260, height: 380 }),
        ],
        background: DEFAULT_BACKGROUND,
        canvasSize: DEFAULT_CANVAS_SIZE,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    const mod = e.ctrlKey || e.metaKey;

    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if (mod && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
      return;
    }
    if ((mod && e.key.toLowerCase() === 'd')) {
      e.preventDefault();
      if (selectedId) duplicateLayer(selectedId);
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !isTyping) {
      e.preventDefault();
      removeLayer(selectedId);
      return;
    }
    if (isTyping || !selectedId) return;

    const step = e.shiftKey ? 10 : 1;
    const layer = useStudioStore.getState().layers.find((l) => l.id === selectedId);
    if (!layer) return;

    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); updateLayer(selectedId, { x: layer.x - step }); break;
      case 'ArrowRight': e.preventDefault(); updateLayer(selectedId, { x: layer.x + step }); break;
      case 'ArrowUp': e.preventDefault(); updateLayer(selectedId, { y: layer.y - step }); break;
      case 'ArrowDown': e.preventDefault(); updateLayer(selectedId, { y: layer.y + step }); break;
      case 'Escape': select(null); break;
    }
  }, [selectedId, select, updateLayer, removeLayer, duplicateLayer, undo, redo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (editorRef.current) {
      editorRef.current.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div
      ref={editorRef}
      className={`flex flex-col overflow-hidden border border-[#1e293b] bg-[#05070f] ${
        isFullscreen
          ? 'fixed inset-0 z-[200] h-screen w-screen rounded-none border-0'
          : 'h-[calc(100vh-7.5rem)] min-h-[560px] rounded-[3px]'
      }`}
    >
      <StudioToolbar canvasRef={canvasRef} isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
      <div className="flex flex-1 overflow-hidden">
        <StudioLeftPanel />
        <StudioCanvas canvasRef={canvasRef} />
        <StudioRightPanel />
      </div>
    </div>
  );
}
