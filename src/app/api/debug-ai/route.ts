import { NextResponse } from 'next/server';

export async function GET() {
  const textKey = process.env.NVIDIA_TEXT_API_KEY;
  const imageKey = process.env.NVIDIA_IMAGE_API_KEY;

  const result: any = {
    env: {
      NVIDIA_TEXT_API_KEY: textKey ? 'Var' : 'YOK! (Vercel Environment Variables kısmından eklenmeli)',
      NVIDIA_IMAGE_API_KEY: imageKey ? 'Var' : 'YOK! (Vercel Environment Variables kısmından eklenmeli)',
    },
    testCall: null,
  };

  if (!textKey) {
    result.testCall = {
      status: 'skipped',
      reason: 'NVIDIA_TEXT_API_KEY bulunamadığı için API testi atlandı.'
    };
    return NextResponse.json(result);
  }

  // NVIDIA NIM üzerinde farklı popüler modelleri test edelim
  const modelsToTest = [
    'meta/llama-3.1-70b-instruct',
    'meta/llama-3.1-405b-instruct',
    'mistralai/mixtral-8x22b-instruct-v0.1',
    'nvidia/nemotron-4-340b-instruct',
    'openai/gpt-oss-120b'
  ];

  const modelResults: Record<string, any> = {};

  for (const model of modelsToTest) {
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
            { role: "user", content: "Merhaba, bana sadece 'ok' de." }
          ],
          max_tokens: 10,
        })
      });

      if (response.ok) {
        const data = await response.json();
        modelResults[model] = { success: true, response: data.choices?.[0]?.message?.content };
      } else {
        const errText = await response.text();
        modelResults[model] = { success: false, status: response.status, error: errText };
      }
    } catch (e: any) {
      modelResults[model] = { success: false, exception: e.message };
    }
  }

  result.testCall = modelResults;

  // Görsel (FLUX) API testi
  if (imageKey) {
    try {
      const imgRes = await fetch("https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${imageKey}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "test pixel art",
          cfg_scale: 5,
          width: 1024,
          height: 1024,
          steps: 10
        })
      });
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        const hasBase64 = !!(imgData.artifacts && imgData.artifacts[0] && imgData.artifacts[0].base64);
        result.imageTest = { success: true, format: hasBase64 ? 'artifacts[0].base64' : 'other', sample: hasBase64 ? 'data:image/jpeg;base64,...' : imgData };
      } else {
        result.imageTest = { success: false, status: imgRes.status, error: await imgRes.text() };
      }
    } catch (e: any) {
      result.imageTest = { success: false, exception: e.message };
    }
  } else {
    result.imageTest = { status: 'skipped', reason: 'NVIDIA_IMAGE_API_KEY eksik' };
  }

  return NextResponse.json(result);
}
