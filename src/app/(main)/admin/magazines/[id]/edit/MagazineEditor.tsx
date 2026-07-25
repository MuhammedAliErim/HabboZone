'use client';

import { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Magazine, MagazinePage, saveMagazinePage } from '@/app/actions/magazine';
import { createAIPoweredMagazine } from '@/app/actions/ai';
import { Save, Plus, Type, Image as ImageIcon, Wand2, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditorProps {
  initialMagazine: Magazine;
  initialPages: MagazinePage[];
}

export default function MagazineEditor({ initialMagazine, initialPages }: EditorProps) {
  const [pages, setPages] = useState<MagazinePage[]>(
    initialPages.length > 0 ? initialPages : [createEmptyPage(initialMagazine.id, 1)]
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  
  const currentPage = pages[currentPageIndex];

  function createEmptyPage(magazineId: string, pageNum: number): MagazinePage {
    return {
      id: `temp_${Date.now()}`,
      magazine_id: magazineId,
      page_number: pageNum,
      layout_data: { layers: [] },
      background_color: '#ffffff',
      background_image: null
    };
  }

  // --- Layer Management ---
  const addLayer = (type: 'text' | 'image') => {
    const newLayer = {
      id: `layer_${Date.now()}`,
      type,
      content: type === 'text' ? 'Yeni Metin' : 'https://placehold.co/400x300?text=Resim',
      style: {
        x: 50,
        y: 50,
        width: 300,
        height: type === 'text' ? 100 : 200,
        fontSize: '24px',
        color: '#000000',
        fontWeight: 'normal',
      }
    };

    updateCurrentPageLayout(newLayer);
  };

  const updateCurrentPageLayout = (newLayer: any) => {
    const updatedPages = [...pages];
    const layers = updatedPages[currentPageIndex].layout_data?.layers || [];
    updatedPages[currentPageIndex].layout_data = { ...updatedPages[currentPageIndex].layout_data, layers: [...layers, newLayer] };
    setPages(updatedPages);
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
  };

  // --- Page Management ---
  const addNewPage = () => {
    const newPage = createEmptyPage(initialMagazine.id, pages.length + 1);
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
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
      toast.success('Dergi kaydedildi!');
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
    const loadingToast = toast.loading('Yapay Zeka dergiyi tasarlıyor... (Bu işlem 30-60 sn sürebilir)');
    try {
      const result = await createAIPoweredMagazine(aiPrompt);
      if (!result.success || !result.data) {
        toast.error('Yapay Zeka Hatası: ' + (result.error || 'Bilinmeyen bir hata oluştu'), { id: loadingToast });
        return;
      }
      const generatedData = result.data;
      
      // JSON'u MagazinePage formatına çevirelim
      const newPages: MagazinePage[] = generatedData.pages.map((p, idx) => ({
        id: `ai_${Date.now()}_${idx}`,
        magazine_id: initialMagazine.id,
        page_number: p.page_number,
        background_color: p.background_color,
        background_image: null,
        layout_data: { layers: p.layers }
      }));

      setPages(newPages);
      setCurrentPageIndex(0);
      toast.success('Yapay zeka dergiyi başarıyla üretti!', { id: loadingToast });
    } catch (error: any) {
      console.error(error);
      toast.error('Yapay Zeka Hatası: ' + error.message, { id: loadingToast });
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#111] text-gray-200">
      
      {/* Sol Panel: Araçlar ve AI */}
      <div className="w-80 border-r border-[#333] bg-[#1a1a1a] p-4 flex flex-col gap-6 overflow-y-auto">
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">✨ AI ile Üret</h2>
          <textarea 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full bg-[#2a2a2a] p-3 rounded-md border border-[#444] text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="Örn: 1980'ler retro tarzında, cyberpunk esintili bir Habbo moda dergisi..."
            rows={4}
          />
          <button 
            onClick={generateWithAI}
            disabled={isAIGenerating}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAIGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {isAIGenerating ? 'Üretiliyor...' : 'Yapay Zekaya Yaptır'}
          </button>
        </div>

        <div className="h-[1px] w-full bg-[#333]"></div>

        <div>
          <h2 className="text-lg font-bold mb-4 text-white">🛠 Araçlar</h2>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => addLayer('text')} className="flex flex-col items-center justify-center gap-2 p-4 bg-[#2a2a2a] hover:bg-[#333] rounded-md transition-colors border border-[#444]">
              <Type className="w-6 h-6 text-blue-400" />
              <span className="text-xs font-medium">Metin</span>
            </button>
            <button onClick={() => addLayer('image')} className="flex flex-col items-center justify-center gap-2 p-4 bg-[#2a2a2a] hover:bg-[#333] rounded-md transition-colors border border-[#444]">
              <ImageIcon className="w-6 h-6 text-green-400" />
              <span className="text-xs font-medium">Resim</span>
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <button 
            onClick={saveAllPages}
            disabled={isSaving}
            className="w-full bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Tümünü Kaydet
          </button>
        </div>

      </div>

      {/* Orta Panel: Canvas (Tuval) */}
      <div className="flex-1 bg-[#0a0a0a] flex flex-col items-center overflow-auto p-8">
        
        {/* Üst Bar: Sayfa Kontrolleri */}
        <div className="flex items-center gap-4 mb-6 bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#333]">
          <button 
            onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
            disabled={currentPageIndex === 0}
            className="p-1 hover:bg-[#333] rounded-full disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Sayfa {currentPageIndex + 1} / {pages.length}
          </span>
          <button 
            onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
            disabled={currentPageIndex === pages.length - 1}
            className="p-1 hover:bg-[#333] rounded-full disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="w-[1px] h-4 bg-[#444] mx-2"></div>
          
          <button 
            onClick={addNewPage}
            className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-4 h-4" /> Yeni Sayfa
          </button>
        </div>

        {/* Canva-like Tuval */}
        <div 
          className="relative shadow-2xl rounded-sm"
          style={{
            width: 800,
            height: 1131,
            backgroundColor: currentPage.background_color,
            backgroundImage: currentPage.background_image ? `url(${currentPage.background_image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {currentPage.layout_data?.layers?.map((layer: any) => (
            <Rnd
              key={layer.id}
              default={{
                x: layer.style?.x || 0,
                y: layer.style?.y || 0,
                width: layer.style?.width || 200,
                height: layer.style?.height || 100,
              }}
              bounds="parent"
              onDragStop={(e, d) => updateLayerStyle(layer.id, { x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateLayerStyle(layer.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position
                });
              }}
              className="group border-2 border-transparent hover:border-blue-500/50 focus-within:border-blue-500 outline-none"
            >
              <div className="relative w-full h-full">
                {/* Sil Butonu (Hover olunca görünür) */}
                <button 
                  onClick={() => removeLayer(layer.id)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                {layer.type === 'text' ? (
                  <textarea
                    value={layer.content}
                    onChange={(e) => updateLayerContent(layer.id, e.target.value)}
                    className="w-full h-full bg-transparent resize-none outline-none overflow-hidden"
                    style={{
                      fontSize: layer.style?.fontSize,
                      color: layer.style?.color,
                      fontWeight: layer.style?.fontWeight,
                    }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={layer.content} 
                    alt="Layer" 
                    className="w-full h-full object-cover rounded-sm pointer-events-none" 
                  />
                )}
              </div>
            </Rnd>
          ))}
        </div>

      </div>

    </div>
  );
}
