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

/**
 * 1. Adım: Yapay zekaya dergi içeriği ürettirme (JSON formatında)
 */
export async function generateMagazineLayout(prompt: string): Promise<GeneratedMagazineSchema> {
  if (!NVIDIA_TEXT_API_KEY) throw new Error("NVIDIA_TEXT_API_KEY bulunamadı!");

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

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_TEXT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
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
      const errorText = await response.text();
      throw new Error(`AI Hatası: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || "";
    
    // JSON bloğunu temizle (eğer markdown ```json ... ``` kullanmışsa)
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedJson = JSON.parse(content) as GeneratedMagazineSchema;
    return parsedJson;

  } catch (error) {
    console.error("Magazine generation error:", error);
    throw error;
  }
}

/**
 * 2. Adım: IMAGE_PROMPT yazan kısımlar için resmi çizdirme
 */
export async function generateImageFromFlux(prompt: string): Promise<string> {
  if (!NVIDIA_IMAGE_API_KEY) throw new Error("NVIDIA_IMAGE_API_KEY bulunamadı!");

  const invokeUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";

  try {
    const response = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_IMAGE_API_KEY}`,
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
    // Flux API'si base64 data URI formatında b64_json dönebilir (OpenAI formatı)
    if (data.data && data.data[0] && data.data[0].b64_json) {
      return `data:image/jpeg;base64,${data.data[0].b64_json}`;
    }
    
    // Veya direkt url dönebilir
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
export async function createAIPoweredMagazine(topic: string) {
  // 1. JSON üret
  const magazineData = await generateMagazineLayout(topic);

  // 2. Sayfalardaki IMAGE_PROMPT'ları bulup resme çevir
  for (const page of magazineData.pages) {
    for (const layer of page.layers) {
      if (layer.type === 'image' && layer.content?.startsWith('IMAGE_PROMPT:')) {
        const imagePrompt = layer.content.replace('IMAGE_PROMPT:', '').trim();
        try {
          const generatedImageUrl = await generateImageFromFlux(imagePrompt);
          layer.content = generatedImageUrl; // Base64 veya URL
        } catch (error) {
          console.error("Görsel üretilirken hata oluştu (Prompt: " + imagePrompt + ")", error);
          // Hata olursa placeholder resim koyabiliriz
          layer.content = "https://placehold.co/600x400/1e293b/ffffff?text=Image+Generation+Failed";
        }
      }
    }
  }

  // 3. Artık magazineData tam anlamıyla render edilmeye hazır! 
  // İlerleyen aşamalarda bu veriyi DB'ye kaydedeceğiz.
  return magazineData;
}
