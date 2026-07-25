'use server';

// NVIDIA NIM API'leri ile entegrasyon (Metin ve Görsel Üretimi)

const NVIDIA_TEXT_API_KEY = process.env.NVIDIA_TEXT_API_KEY;
const NVIDIA_IMAGE_API_KEY = process.env.NVIDIA_IMAGE_API_KEY;

// Dergi yapısı için tipler
export interface MagazinePageLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  content?: string; // Yazı içeriği veya görsel URL'si
  style?: React.CSSProperties; // x, y, width, height, color vb.
}

export interface MagazinePageSchema {
  page_number: number;
  background_color: string;
  layers: MagazinePageLayer[];
}

export interface GeneratedMagazineSchema {
  title: string;
  description: string;
  pages: MagazinePageSchema[];
}

export interface AIGenerationResult {
  success: boolean;
  data?: GeneratedMagazineSchema;
  error?: string;
}

/**
 * 1. Adım: Yapay zekaya dergi içeriği ürettirme (JSON formatında)
 */
export async function generateMagazineLayout(prompt: string): Promise<GeneratedMagazineSchema> {
  const textKey = process.env.NVIDIA_TEXT_API_KEY;
  if (!textKey) {
    throw new Error("NVIDIA_TEXT_API_KEY Vercel ortam değişkenlerinde (Environment Variables) bulunamadı! Lütfen ekleyip redeploy yapın.");
  }

  const systemPrompt = `
Sen profesyonel bir dergi editörü ve sayfa tasarımcısısın. 
Kullanıcının verdiği konuya göre bir dergi içeriği üreteceksin ve sonucu AŞAĞIDAKİ JSON formatında döndüreceksin. 
JSON dışında hiçbir ekstra metin, açıklama veya markdown bloğu kullanma. SADECE saf JSON.

{
  "title": "Dergi Başlığı",
  "description": "Derginin kısa bir açıklaması",
  "pages": [
    {
      "page_number": 1,
      "background_color": "#1e293b",
      "layers": [
        {
          "id": "layer_1",
          "type": "text",
          "content": "Kapak Başlığı",
          "style": { "x": 50, "y": 100, "fontSize": "48px", "color": "#ffffff", "fontWeight": "bold", "width": 700 }
        },
        {
          "id": "layer_2",
          "type": "image",
          "content": "IMAGE_PROMPT: Habbo characters at a beach party, high quality pixel art style", 
          "style": { "x": 0, "y": 300, "width": 800, "height": 500 }
        }
      ]
    }
  ]
}

Önemli Notlar:
- Dergi genel olarak 800x1131 (A4) boyutunda bir tuvalde (canvas) oluşturulur. x ve y değerlerini buna göre belirle.
- Resim gelmesi gereken yerlere type: 'image' ver ve content kısmına "IMAGE_PROMPT: [İngilizce detaylı resim oluşturma komutu]" yaz. Böylece biz o promptu FLUX'a gönderip resmi çizeceğiz.
- Yazılara uygun font, boyut ve renk ver.
- En az 3 sayfa üret (1 kapak, 2 içerik sayfası).
`;

  // NVIDIA NIM üzerinde popüler, en stabil çalışan modelleri sırayla deneyelim (Fallback sistemi)
  const modelsToTry = [
    "openai/gpt-oss-120b",
    "meta/llama-3.1-70b-instruct",
    "meta/llama-3.1-405b-instruct",
    "mistralai/mixtral-8x22b-instruct-v0.1",
    "nvidia/nemotron-4-340b-instruct",
    "meta/llama3-70b-instruct"
  ];

  let lastErrorText = "";

  for (const model of modelsToTry) {
    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${textKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Lütfen şu konuda bir dergi üret: ${prompt}` }
          ],
          temperature: 0.7,
          max_tokens: 4096,
          stream: false,
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        lastErrorText = `Model ${model} (HTTP ${response.status}): ${errText}`;
        console.warn(lastErrorText);
        continue; // Bir sonraki modele geç
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || "";
      
      // JSON bloğunu temizle (markdown taglerini kaldır)
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedJson = JSON.parse(content) as GeneratedMagazineSchema;
      if (!parsedJson || !parsedJson.pages || !Array.isArray(parsedJson.pages)) {
        throw new Error("Geçersiz JSON formatı alındı.");
      }
      return parsedJson;

    } catch (err: any) {
      lastErrorText = err.message || "Bilinmeyen JSON Parse / İstek hatası";
      console.warn(`Model ${model} denenirken hata:`, lastErrorText);
    }
  }

  throw new Error(`NVIDIA NIM üzerindeki hiçbir modelden yanıt alınamadı. Son Hata: ${lastErrorText}`);
}

/**
 * 2. Adım: IMAGE_PROMPT yazan kısımlar için resmi çizdirme
 */
export async function generateImageFromFlux(prompt: string): Promise<string> {
  const imageKey = process.env.NVIDIA_IMAGE_API_KEY;
  if (!imageKey) throw new Error("NVIDIA_IMAGE_API_KEY bulunamadı!");

  const invokeUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";

  try {
    const response = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${imageKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        cfg_scale: 5,
        width: 1024,
        height: 1024,
        steps: 40 // dev modeli için uygun bir adım sayısı
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flux AI Hatası: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.data && data.data[0] && data.data[0].b64_json) {
      return `data:image/jpeg;base64,${data.data[0].b64_json}`;
    }
    
    if (data.data && data.data[0] && data.data[0].url) {
      return data.data[0].url;
    }

    throw new Error("Geçerli bir resim verisi dönmedi.");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}

/**
 * AI sürecini baştan sona yöneten Master Fonksiyon
 */
export async function createAIPoweredMagazine(topic: string): Promise<AIGenerationResult> {
  try {
    if (!process.env.NVIDIA_TEXT_API_KEY) {
      return {
        success: false,
        error: "NVIDIA_TEXT_API_KEY ortam değişkeni (Vercel Environment Variables) eksik! Lütfen Vercel panelinden anahtarı ekleyip Redeploy yapın."
      };
    }

    // 1. JSON üret
    const magazineData = await generateMagazineLayout(topic);

    // 2. Sayfalardaki IMAGE_PROMPT'ları bulup resme çevir
    for (const page of magazineData.pages) {
      for (const layer of page.layers) {
        if (layer.type === 'image' && layer.content?.startsWith('IMAGE_PROMPT:')) {
          const imagePrompt = layer.content.replace('IMAGE_PROMPT:', '').trim();
          try {
            if (!process.env.NVIDIA_IMAGE_API_KEY) {
              console.warn("NVIDIA_IMAGE_API_KEY yok, placeholder resim kullanılacak.");
              layer.content = "https://placehold.co/600x400/1e293b/ffffff?text=NVIDIA+Image+Key+Missing";
            } else {
              const generatedImageUrl = await generateImageFromFlux(imagePrompt);
              layer.content = generatedImageUrl;
            }
          } catch (error) {
            console.error("Görsel üretilirken hata oluştu (Prompt: " + imagePrompt + ")", error);
            layer.content = "https://placehold.co/600x400/1e293b/ffffff?text=Image+Generation+Failed";
          }
        }
      }
    }

    return {
      success: true,
      data: magazineData
    };
  } catch (error: any) {
    console.error("createAIPoweredMagazine fatal error:", error);
    return {
      success: false,
      error: error?.message || "Dergi oluşturulurken bilinmeyen bir hata meydana geldi."
    };
  }
}
