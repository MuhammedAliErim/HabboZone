'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Magazine, MagazinePage, saveMagazinePage } from '@/app/actions/magazine';
import { createAIPoweredMagazine } from '@/app/actions/ai';
import { 
  Save, Plus, Type, Image as ImageIcon, Wand2, Trash2, ChevronLeft, 
  ChevronRight, Loader2, Square, Sparkles, Copy, ArrowUp, ArrowDown, 
  Palette, Sliders, Layers, Eye, Grid, Maximize2, Minimize2, Check, 
  RefreshCw, Heading, AlignLeft, AlignCenter, AlignRight, ShieldAlert, Smile
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EditorProps {
  initialMagazine: Magazine;
  initialPages: MagazinePage[];
}

const PRESET_COLORS = [
  '#ffffff', '#000000', '#facc15', '#ef4444', '#3b82f6', 
  '#10b981', '#a855f7', '#ec4899', '#f97316', '#64748b', '#1e293b', '#0f172a'
];

const PRESET_BACKGROUNDS = [
  { name: 'Koyu Slate', color: '#0f172a' },
  { name: 'Habbo Mavi', color: '#1e3a8a' },
  { name: 'Cyber Sarı', color: '#422006' },
  { name: 'Retro Pembe', color: '#500724' },
  { name: 'Zümrüt Yeşil', color: '#064e3b' },
  { name: 'Saf Beyaz', color: '#ffffff' },
  { name: 'Gece Siyahı', color: '#000000' },
  { name: 'Karbon Gri', color: '#1f2937' },
];

const PRESET_STICKERS = [
  { name: 'Habbo Ördek', url: 'https://images.habbo.com/c_images/catalogue/icon_256.png' },
  { name: 'Altın Kupa', url: 'https://images.habbo.com/c_images/catalogue/icon_201.png' },
  { name: 'HC Rozeti', url: 'https://www.habbo.com.tr/habbo-imaging/badge/b05034s43114s41114s41114s41114d1f2b18606c4b2b2b1a1f3863435165b.gif' },
  { name: 'Habbo Staff', url: 'https://www.habbo.com.tr/habbo-imaging/badge/b09034s43114s41114s41114s41114d1f2b18606c4b2b2b1a1f3863435165b.gif' },
  { name: 'Frank Avatar', url: 'https://www.habbo.com.tr/habbo-imaging/avatarimage?user=Habbo&action=std&direction=3&head_direction=3&gesture=sml&size=m' },
];

export default function MagazineEditor({ initialMagazine, initialPages }: EditorProps) {
  const [pages, setPages] = useState<MagazinePage[]>(
    initialPages.length > 0 ? initialPages : [createEmptyPage(initialMagazine.id, 1)]
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tools' | 'ai' | 'bg'>('tools');
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);

  const [isSaving, setIsSaving] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  
  const currentPage = pages[currentPageIndex] || createEmptyPage(initialMagazine.id, 1);
  const selectedLayer = currentPage.layout_data?.layers?.find((l: any) => l.id === selectedLayerId);

  function createEmptyPage(magazineId: string, pageNum: number): MagazinePage {
    return {
      id: `temp_${Date.now()}`,
      magazine_id: magazineId,
      page_number: pageNum,
      layout_data: { layers: [] },
      background_color: '#0f172a',
      background_image: null
    };
  }

  // --- Layer Management ---
  const addLayer = (type: 'title' | 'subtitle' | 'text' | 'image' | 'shape' | 'sticker', presetContent?: string) => {
    let newLayer: any = {
      id: `layer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: type === 'title' || type === 'subtitle' ? 'text' : type,
      content: '',
      style: {
        x: 50,
        y: 100 + (currentPage.layout_data?.layers?.length || 0) * 40,
        width: 350,
        height: 100,
        opacity: 1,
        zIndex: (currentPage.layout_data?.layers?.length || 0) + 1
      }
    };

    if (type === 'title') {
      newLayer.content = 'Büyük Başlık';
      newLayer.style = { ...newLayer.style, width: 500, height: 80, fontSize: '42px', fontWeight: 'bold', color: '#facc15', textAlign: 'left' };
    } else if (type === 'subtitle') {
      newLayer.content = 'Alt Başlık Metni';
      newLayer.style = { ...newLayer.style, width: 450, height: 60, fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0', textAlign: 'left' };
    } else if (type === 'text') {
      newLayer.content = 'Buraya paragraf metninizi veya haber içeriğinizi yazabilirsiniz...';
      newLayer.style = { ...newLayer.style, width: 400, height: 120, fontSize: '16px', fontWeight: 'normal', color: '#ffffff', textAlign: 'left' };
    } else if (type === 'image') {
      newLayer.content = presetContent || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80';
      newLayer.style = { ...newLayer.style, width: 450, height: 300 };
    } else if (type === 'shape') {
      newLayer.style = { ...newLayer.style, width: 500, height: 200, backgroundColor: '#1e293b', borderRadius: '12px', border: '2px solid #334155' };
    } else if (type === 'sticker') {
      newLayer.content = presetContent || PRESET_STICKERS[0].url;
      newLayer.style = { ...newLayer.style, width: 100, height: 100 };
    }

    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    updatedPages[currentPageIndex].layout_data = { 
      ...updatedPages[currentPageIndex].layout_data, 
      layers: [...layers, newLayer] 
    };
    setPages(updatedPages);
    setSelectedLayerId(newLayer.id);
    toast.success('Katman eklendi');
  };

  const updateLayerStyle = (layerId: string, newStyle: any) => {
    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    const layerIndex = layers.findIndex((l: any) => l.id === layerId);
    if (layerIndex > -1) {
      layers[layerIndex].style = { ...layers[layerIndex].style, ...newStyle };
      updatedPages[currentPageIndex].layout_data.layers = layers;
      setPages(updatedPages);
    }
  };

  const updateLayerContent = (layerId: string, content: string) => {
    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    const layerIndex = layers.findIndex((l: any) => l.id === layerId);
    if (layerIndex > -1) {
      layers[layerIndex].content = content;
      updatedPages[currentPageIndex].layout_data.layers = layers;
      setPages(updatedPages);
    }
  };

  const removeLayer = (layerId: string) => {
    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    updatedPages[currentPageIndex].layout_data.layers = layers.filter((l: any) => l.id !== layerId);
    setPages(updatedPages);
    if (selectedLayerId === layerId) setSelectedLayerId(null);
    toast.success('Katman silindi');
  };

  const duplicateLayer = (layerId: string) => {
    const layer = currentPage.layout_data?.layers?.find((l: any) => l.id === layerId);
    if (!layer) return;
    const cloned = JSON.parse(JSON.stringify(layer));
    cloned.id = `layer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    cloned.style.x = (cloned.style?.x || 50) + 20;
    cloned.style.y = (cloned.style?.y || 50) + 20;
    
    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    updatedPages[currentPageIndex].layout_data.layers = [...layers, cloned];
    setPages(updatedPages);
    setSelectedLayerId(cloned.id);
    toast.success('Katman çoğaltıldı');
  };

  const bringToFront = (layerId: string) => {
    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    const target = layers.find((l: any) => l.id === layerId);
    if (!target) return;
    const filtered = layers.filter((l: any) => l.id !== layerId);
    updatedPages[currentPageIndex].layout_data.layers = [...filtered, target];
    setPages(updatedPages);
    toast.success('En öne getirildi');
  };

  const sendToBack = (layerId: string) => {
    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    const target = layers.find((l: any) => l.id === layerId);
    if (!target) return;
    const filtered = layers.filter((l: any) => l.id !== layerId);
    updatedPages[currentPageIndex].layout_data.layers = [target, ...filtered];
    setPages(updatedPages);
    toast.success('En arkaya gönderildi');
  };

  // --- Page Background Management ---
  const updatePageBackground = (color: string, image: string | null = null) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex].background_color = color;
    if (image !== undefined) {
      updatedPages[currentPageIndex].background_image = image;
    }
    setPages(updatedPages);
  };

  // --- Page Management ---
  const addNewPage = () => {
    const newPage = createEmptyPage(initialMagazine.id, pages.length + 1);
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
    setSelectedLayerId(null);
    toast.success('Yeni sayfa eklendi');
  };

  const deleteCurrentPage = () => {
    if (pages.length <= 1) {
      toast.error('En az 1 sayfa bulunmalıdır.');
      return;
    }
    const updated = pages.filter((_, idx) => idx !== currentPageIndex);
    // Yeniden numaralandır
    updated.forEach((p, idx) => { p.page_number = idx + 1; });
    setPages(updated);
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    setSelectedLayerId(null);
    toast.success('Sayfa silindi');
  };

  const saveAllPages = async () => {
    setIsSaving(true);
    try {
      for (const page of pages) {
        await saveMagazinePage(
          initialMagazine.id,
          page.page_number,
          page.layout_data,
          page.background_color,
          page.background_image
        );
      }
      toast.success('🎉 Derginin tüm sayfaları başarıyla kaydedildi!');
    } catch (error: any) {
      toast.error('Hata: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt) {
      toast.error("Lütfen AI için bir konu veya prompt girin.");
      return;
    }
    setIsAIGenerating(true);
    const loadingToast = toast.loading('⚡ Yapay Zeka dergiyi tasarlıyor... (Bu işlem 30-60 sn sürebilir)');
    try {
      const result = await createAIPoweredMagazine(aiPrompt);
      if (!result.success || !result.data) {
        toast.error('Yapay Zeka Hatası: ' + (result.error || 'Bilinmeyen bir hata oluştu'), { id: loadingToast });
        return;
      }
      const generatedData = result.data;
      
      const newPages: MagazinePage[] = generatedData.pages.map((p, idx) => ({
        id: `ai_page_${Date.now()}_${idx}`,
        magazine_id: initialMagazine.id,
        page_number: p.page_number || (idx + 1),
        background_color: p.background_color || '#0f172a',
        background_image: null,
        layout_data: {
          layers: (Array.isArray(p.layers) ? p.layers : []).map((layer: any, lIdx: number) => ({
            ...layer,
            id: `layer_${Date.now()}_${idx}_${lIdx}_${Math.random().toString(36).substring(2, 7)}`,
            style: {
              x: typeof layer.style?.x === 'number' ? layer.style.x : 50,
              y: typeof layer.style?.y === 'number' ? layer.style.y : (100 + lIdx * 150),
              width: typeof layer.style?.width === 'number' && layer.style.width > 20 ? layer.style.width : (layer.type === 'image' ? 600 : 500),
              height: typeof layer.style?.height === 'number' && layer.style.height > 20 ? layer.style.height : (layer.type === 'image' ? 400 : 100),
              fontSize: layer.style?.fontSize || '24px',
              color: layer.style?.color || '#ffffff',
              fontWeight: layer.style?.fontWeight || 'normal',
              ...layer.style
            }
          }))
        }
      }));

      setPages(newPages);
      setCurrentPageIndex(0);
      setSelectedLayerId(null);
      toast.success('🚀 Yapay zeka dergiyi başarıyla üretti!', { id: loadingToast });
    } catch (error: any) {
      console.error(error);
      toast.error('Yapay Zeka Hatası: ' + error.message, { id: loadingToast });
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full bg-[#0a0f1d] text-gray-200 border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
      
      {/* SOL PANEL: TAB MENÜSÜ VE ARAÇLAR (w-80) */}
      <div className="w-80 border-r border-[#1e293b] bg-[#0f172a] flex flex-col shrink-0">
        
        {/* Tab Başlıkları */}
        <div className="flex border-b border-[#1e293b] bg-[#090e17] p-1 gap-1">
          <button 
            onClick={() => setActiveTab('tools')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'tools' ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/25' : 'text-gray-400 hover:bg-[#1e293b]'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Katmanlar
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'ai' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:bg-[#1e293b]'}`}
          >
            <Wand2 className="w-3.5 h-3.5" /> AI Motoru
          </button>
          <button 
            onClick={() => setActiveTab('bg')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'bg' ? 'bg-[#facc15] text-black shadow-lg shadow-yellow-500/25 font-black' : 'text-gray-400 hover:bg-[#1e293b]'}`}
          >
            <Palette className="w-3.5 h-3.5" /> Tuval
          </button>
        </div>

        {/* Tab İçerikleri */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* TAB 1: KATMAN VE ÖĞE EKLEME */}
          {activeTab === 'tools' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4 text-blue-400" /> Metin Öğeleri
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => addLayer('title')} 
                    className="flex items-center gap-3 p-3 bg-[#1e293b] hover:bg-[#334155] rounded-lg border border-[#334155] transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center font-black text-blue-400 text-lg group-hover:scale-110 transition-transform">B</div>
                    <div>
                      <div className="text-sm font-bold text-white">Büyük Başlık</div>
                      <div className="text-[11px] text-gray-400">Ana manşet ve sayfa başlıkları</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => addLayer('subtitle')} 
                    className="flex items-center gap-3 p-3 bg-[#1e293b] hover:bg-[#334155] rounded-lg border border-[#334155] transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-base group-hover:scale-110 transition-transform">A</div>
                    <div>
                      <div className="text-sm font-bold text-white">Alt Başlık</div>
                      <div className="text-[11px] text-gray-400">Bölüm ve alt başlıklar için</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => addLayer('text')} 
                    className="flex items-center gap-3 p-3 bg-[#1e293b] hover:bg-[#334155] rounded-lg border border-[#334155] transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded bg-gray-500/20 flex items-center justify-center font-normal text-gray-300 text-sm group-hover:scale-110 transition-transform">T</div>
                    <div>
                      <div className="text-sm font-bold text-white">Paragraf Metni</div>
                      <div className="text-[11px] text-gray-400">Uzun makale ve haber içerikleri</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-400" /> Medya & Şekil
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addLayer('image')} 
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1e293b] hover:bg-[#334155] rounded-lg border border-[#334155] transition-all text-center group"
                  >
                    <ImageIcon className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white">Resim Ekle</span>
                  </button>

                  <button 
                    onClick={() => addLayer('shape')} 
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1e293b] hover:bg-[#334155] rounded-lg border border-[#334155] transition-all text-center group"
                  >
                    <Square className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white">Renk Kutusu</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smile className="w-4 h-4 text-pink-400" /> Hazır Rozet & Sticker
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_STICKERS.map((st, i) => (
                    <button
                      key={i}
                      onClick={() => addLayer('sticker', st.url)}
                      title={st.name}
                      className="p-2 bg-[#1e293b] hover:bg-[#334155] rounded-lg border border-[#334155] flex flex-col items-center justify-center gap-1 transition-all group"
                    >
                      <Image src={st.url} alt={st.name} width={32} height={32} className="object-contain group-hover:scale-125 transition-transform" unoptimized />
                      <span className="text-[10px] text-gray-300 truncate w-full text-center">{st.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: YAPAY ZEKA TASARIMCI */}
          {activeTab === 'ai' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-lg text-xs text-purple-200">
                <p className="font-bold mb-1 flex items-center gap-1">⚡ NVIDIA NIM Yapay Zeka</p>
                Prompt verin; AI sizin için kapak, başlıklar, resimler ve renk paletleriyle tam bir dergi oluştursun!
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Konu / Konsept</label>
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-[#1e293b] p-3 rounded-lg border border-[#334155] text-sm outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
                  placeholder="Örn: 1980'ler retro tarzında, cyberpunk esintili bir Habbo moda dergisi. Kapakta nadire kıyafetler ve içerikte odalar olsun..."
                  rows={5}
                />
              </div>

              <button 
                onClick={generateWithAI}
                disabled={isAIGenerating}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 py-3 rounded-lg font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {isAIGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 animate-bounce" />}
                {isAIGenerating ? 'Yapay Zeka Tasarlıyor...' : 'AI ile Dergi Üret'}
              </button>
            </div>
          )}

          {/* TAB 3: TUVAL VE ARKA PLAN */}
          {activeTab === 'bg' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Arka Plan Rengi</h3>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_BACKGROUNDS.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => updatePageBackground(bg.color)}
                      className={`h-12 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${currentPage.background_color === bg.color ? 'border-yellow-400 scale-105 shadow-md' : 'border-transparent hover:border-white/40'}`}
                      style={{ backgroundColor: bg.color }}
                      title={bg.name}
                    >
                      <span className="text-[10px] font-bold px-1 bg-black/60 text-white rounded">{bg.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={currentPage.background_color || '#0f172a'}
                    onChange={(e) => updatePageBackground(e.target.value)}
                    className="w-10 h-10 rounded bg-transparent cursor-pointer border border-[#334155]" 
                  />
                  <input 
                    type="text"
                    value={currentPage.background_color || '#0f172a'}
                    onChange={(e) => updatePageBackground(e.target.value)}
                    className="flex-1 bg-[#1e293b] border border-[#334155] rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-yellow-400"
                    placeholder="#0f172a"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Arka Plan Görseli (URL)</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentPage.background_image || ''}
                    onChange={(e) => updatePageBackground(currentPage.background_color, e.target.value || null)}
                    className="flex-1 bg-[#1e293b] border border-[#334155] rounded px-3 py-2 text-xs text-white outline-none focus:border-yellow-400"
                    placeholder="https://images.habbo.com/..."
                  />
                  {currentPage.background_image && (
                    <button 
                      onClick={() => updatePageBackground(currentPage.background_color, null)}
                      className="px-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded border border-red-500/30 text-xs font-bold"
                    >
                      Sil
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Izgara ve Kılavuzlar</h3>
                <button 
                  onClick={() => setShowGrid(!showGrid)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${showGrid ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' : 'bg-[#1e293b] border-[#334155] text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                  {showGrid ? 'Izgara Çizgilerini Gizle' : 'Canva Hizalama Izgarası Göster'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Alt Kaydet Butonu */}
        <div className="p-4 border-t border-[#1e293b] bg-[#090e17]">
          <button 
            onClick={saveAllPages}
            disabled={isSaving}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Tüm Dergiyi Kaydet
          </button>
        </div>

      </div>

      {/* ORTA PANEL: TUVAL (CANVAS) ALANI */}
      <div 
        className="flex-1 bg-[#050811] flex flex-col items-center overflow-auto p-6 relative select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedLayerId(null);
        }}
      >
        {/* Üst Kılavuz Çubuğu */}
        <div className="flex items-center gap-3 mb-6 bg-[#0f172a]/90 backdrop-blur px-5 py-2 rounded-full border border-[#1e293b] shadow-xl sticky top-0 z-40">
          <button 
            onClick={() => { setCurrentPageIndex(prev => Math.max(0, prev - 1)); setSelectedLayerId(null); }}
            disabled={currentPageIndex === 0}
            className="p-1.5 hover:bg-[#1e293b] rounded-full disabled:opacity-30 transition-colors"
            title="Önceki Sayfa"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-black text-white px-2">
            SAYFA {currentPageIndex + 1} <span className="text-gray-500 font-normal">/ {pages.length}</span>
          </span>
          <button 
            onClick={() => { setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1)); setSelectedLayerId(null); }}
            disabled={currentPageIndex === pages.length - 1}
            className="p-1.5 hover:bg-[#1e293b] rounded-full disabled:opacity-30 transition-colors"
            title="Sonraki Sayfa"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="w-[1px] h-4 bg-[#334155] mx-1"></div>
          
          <button 
            onClick={addNewPage}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-bold text-blue-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Yeni Sayfa
          </button>

          <button 
            onClick={deleteCurrentPage}
            disabled={pages.length <= 1}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full text-xs font-bold text-red-400 transition-colors disabled:opacity-30"
          >
            <Trash2 className="w-3.5 h-3.5" /> Sayfayı Sil
          </button>
        </div>

        {/* TUVAL (CANVAS - 800x1131 Dergi Boyutu) */}
        <div 
          className={`relative shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-md transition-all duration-300 shrink-0 ${showGrid ? 'bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px]' : ''}`}
          style={{
            width: 800,
            height: 1131,
            backgroundColor: currentPage.background_color || '#0f172a',
            backgroundImage: currentPage.background_image ? `url(${currentPage.background_image})` : (showGrid ? undefined : 'none'),
            backgroundSize: currentPage.background_image ? 'cover' : '40px 40px',
            backgroundPosition: 'center',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLayerId(null);
          }}
        >
          {currentPage.layout_data?.layers?.map((layer: any) => {
            const isSelected = selectedLayerId === layer.id;
            
            return (
              <Rnd
                key={layer.id}
                size={{
                  width: layer.style?.width || 300,
                  height: layer.style?.height || 100,
                }}
                position={{
                  x: layer.style?.x || 50,
                  y: layer.style?.y || 50,
                }}
                bounds="parent"
                onDragStart={() => setSelectedLayerId(layer.id)}
                onDragStop={(e, d) => updateLayerStyle(layer.id, { x: d.x, y: d.y })}
                onResizeStart={() => setSelectedLayerId(layer.id)}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateLayerStyle(layer.id, {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    ...position
                  });
                }}
                className={`group cursor-move transition-shadow ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black z-50' : 'hover:ring-1 hover:ring-blue-500/50'}`}
                style={{
                  zIndex: layer.style?.zIndex || 1,
                  opacity: layer.style?.opacity ?? 1
                }}
              >
                <div 
                  className="relative w-full h-full flex items-center justify-center overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLayerId(layer.id);
                  }}
                  style={{
                    backgroundColor: layer.type === 'shape' ? (layer.style?.backgroundColor || '#1e293b') : 'transparent',
                    borderRadius: layer.style?.borderRadius || '0px',
                    border: layer.type === 'shape' ? (layer.style?.border || 'none') : 'none',
                  }}
                >
                  {/* Seçili Katman Hızlı Aksiyon Menüsü */}
                  {isSelected && (
                    <div className="absolute -top-10 left-0 bg-black/90 border border-yellow-400/50 rounded-full px-3 py-1 flex items-center gap-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                      <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-tighter">{layer.type}</span>
                      <button onClick={() => duplicateLayer(layer.id)} className="p-1 hover:text-white text-gray-400" title="Çoğalt">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => bringToFront(layer.id)} className="p-1 hover:text-white text-gray-400" title="Öne Getir">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => sendToBack(layer.id)} className="p-1 hover:text-white text-gray-400" title="Arkaya Gönder">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeLayer(layer.id)} className="p-1 hover:text-red-400 text-red-500" title="Sil">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* METİN KATMANI */}
                  {layer.type === 'text' && (
                    <textarea
                      value={layer.content || ''}
                      onChange={(e) => updateLayerContent(layer.id, e.target.value)}
                      className="w-full h-full bg-transparent resize-none outline-none p-2 font-sans"
                      style={{
                        fontSize: layer.style?.fontSize || '20px',
                        color: layer.style?.color || '#ffffff',
                        fontWeight: layer.style?.fontWeight || 'normal',
                        textAlign: layer.style?.textAlign || 'left',
                      }}
                      placeholder="Metin yazın..."
                    />
                  )}

                  {/* RESİM / STICKER KATMANI */}
                  {(layer.type === 'image' || layer.type === 'sticker') && (
                    <Image 
                      src={layer.content || 'https://placehold.co/400x300'} 
                      alt="Medya" 
                      fill
                      className={`pointer-events-none ${layer.type === 'sticker' ? 'object-contain' : 'object-cover'}`} 
                      style={{ borderRadius: layer.style?.borderRadius || '0px' }}
                      unoptimized
                    />
                  )}
                </div>
              </Rnd>
            );
          })}
        </div>

      </div>

      {/* SAĞ PANEL: ÖZELLİKLER DENETLEYİCİSİ (INSPECTOR - w-80) */}
      <div className="w-80 border-l border-[#1e293b] bg-[#0f172a] p-5 flex flex-col shrink-0 overflow-y-auto">
        
        {selectedLayer ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-yellow-400" /> ÖZELLİKLER
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Katman ID: {selectedLayer.id.substring(0, 12)}...</p>
              </div>
              <button 
                onClick={() => setSelectedLayerId(null)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-[#1e293b] rounded"
              >
                Kapat
              </button>
            </div>

            {/* İÇERİK VEYA URL DÜZENLEME */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                {selectedLayer.type === 'text' ? 'Metin İçeriği' : 'Görsel / Medya URL'}
              </label>
              {selectedLayer.type === 'text' ? (
                <textarea 
                  value={selectedLayer.content || ''}
                  onChange={(e) => updateLayerContent(selectedLayer.id, e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2.5 text-xs text-white outline-none focus:border-yellow-400"
                  rows={4}
                />
              ) : (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={selectedLayer.content || ''}
                    onChange={(e) => updateLayerContent(selectedLayer.id, e.target.value)}
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-xs text-white outline-none focus:border-yellow-400 font-mono"
                    placeholder="https://..."
                  />
                  <p className="text-[10px] text-gray-400">Doğrudan resim veya gif linki yapıştırın.</p>
                </div>
              )}
            </div>

            {/* METİN FONTLARI VE AYARLARI */}
            {selectedLayer.type === 'text' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Yazı Boyutu</label>
                    <select 
                      value={selectedLayer.style?.fontSize || '20px'}
                      onChange={(e) => updateLayerStyle(selectedLayer.id, { fontSize: e.target.value })}
                      className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-xs text-white outline-none"
                    >
                      {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '38px', '44px', '52px', '64px'].map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Kalınlık</label>
                    <select 
                      value={selectedLayer.style?.fontWeight || 'normal'}
                      onChange={(e) => updateLayerStyle(selectedLayer.id, { fontWeight: e.target.value })}
                      className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-xs text-white outline-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Kalın (Bold)</option>
                      <option value="900">Ekstra Kalın (Black)</option>
                      <option value="300">İnce (Light)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Hizalama</label>
                  <div className="grid grid-cols-3 gap-1 bg-[#1e293b] p-1 rounded-lg border border-[#334155]">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        onClick={() => updateLayerStyle(selectedLayer.id, { textAlign: align })}
                        className={`py-1 rounded flex items-center justify-center transition-colors ${selectedLayer.style?.textAlign === align ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                      >
                        {align === 'left' && <AlignLeft className="w-4 h-4" />}
                        {align === 'center' && <AlignCenter className="w-4 h-4" />}
                        {align === 'right' && <AlignRight className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* RENK PALETİ */}
            {(selectedLayer.type === 'text' || selectedLayer.type === 'shape') && (
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-2">
                  {selectedLayer.type === 'text' ? 'Metin Rengi' : 'Kutu Arka Plan Rengi'}
                </label>
                <div className="grid grid-cols-6 gap-1.5 mb-2">
                  {PRESET_COLORS.map((col, i) => (
                    <button
                      key={i}
                      onClick={() => updateLayerStyle(selectedLayer.id, selectedLayer.type === 'text' ? { color: col } : { backgroundColor: col })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${ (selectedLayer.type === 'text' ? selectedLayer.style?.color : selectedLayer.style?.backgroundColor) === col ? 'scale-125 border-yellow-400 shadow-md' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={(selectedLayer.type === 'text' ? selectedLayer.style?.color : selectedLayer.style?.backgroundColor) || '#ffffff'}
                    onChange={(e) => updateLayerStyle(selectedLayer.id, selectedLayer.type === 'text' ? { color: e.target.value } : { backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded bg-transparent cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={(selectedLayer.type === 'text' ? selectedLayer.style?.color : selectedLayer.style?.backgroundColor) || '#ffffff'}
                    onChange={(e) => updateLayerStyle(selectedLayer.id, selectedLayer.type === 'text' ? { color: e.target.value } : { backgroundColor: e.target.value })}
                    className="flex-1 bg-[#1e293b] border border-[#334155] rounded px-2.5 py-1.5 text-xs font-mono text-white outline-none" 
                  />
                </div>
              </div>
            )}

            {/* SAYDAMLIK (OPACITY) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-300">Saydamlık (Opacity)</label>
                <span className="text-xs font-mono text-yellow-400">{Math.round((selectedLayer.style?.opacity ?? 1) * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05" 
                value={selectedLayer.style?.opacity ?? 1}
                onChange={(e) => updateLayerStyle(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            {/* KENARLIK VE KÖŞE YUVARLAKLIĞI (SHAPE / IMAGE) */}
            {(selectedLayer.type === 'shape' || selectedLayer.type === 'image') && (
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Köşe Yuvarlaklığı</label>
                <select 
                  value={selectedLayer.style?.borderRadius || '0px'}
                  onChange={(e) => updateLayerStyle(selectedLayer.id, { borderRadius: e.target.value })}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-xs text-white outline-none"
                >
                  <option value="0px">Keskin Köşe (0px)</option>
                  <option value="6px">Hafif Yuvarlak (6px)</option>
                  <option value="12px">Orta Yuvarlak (12px)</option>
                  <option value="24px">Çok Yuvarlak (24px)</option>
                  <option value="9999px">Tam Daire / Hap (9999px)</option>
                </select>
              </div>
            )}

            {/* KATMAN SIRALAMA VE İŞLEMLER */}
            <div className="pt-4 border-t border-[#1e293b] space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Katman Sıralaması</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => bringToFront(selectedLayer.id)}
                  className="py-2 px-3 bg-[#1e293b] hover:bg-[#334155] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-blue-400" /> En Öne Al
                </button>
                <button 
                  onClick={() => sendToBack(selectedLayer.id)}
                  className="py-2 px-3 bg-[#1e293b] hover:bg-[#334155] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-indigo-400" /> En Arkaya Al
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => duplicateLayer(selectedLayer.id)}
                  className="py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Çoğalt
                </button>
                <button 
                  onClick={() => removeLayer(selectedLayer.id)}
                  className="py-2.5 px-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-500">
            <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center mb-4 text-yellow-400/50">
              <Sliders className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-gray-300 mb-1">Katman Seçilmedi</p>
            <p className="text-xs text-gray-500">
              Düzenlemek veya konumlandırmak için tuvaldeli herhangi bir öğeye veya yazıya tıklayın.
            </p>
            <div className="mt-8 p-3 bg-[#1e293b]/50 border border-[#334155]/40 rounded-lg text-left text-xs text-gray-400 w-full space-y-1.5">
              <p className="font-bold text-yellow-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> İpucu</p>
              <p>• Katmanları sürükleyerek taşıyın.</p>
              <p>• Köşelerinden çekerek yeniden boyutlandırın.</p>
              <p>• Sol menüden rozet, kutu ve görsel ekleyin.</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
