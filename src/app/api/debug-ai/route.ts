import { NextResponse } from 'next/server';

export async function GET() {
  const textKey = process.env.NVIDIA_TEXT_API_KEY;
  const imageKey = process.env.NVIDIA_IMAGE_API_KEY;

  const result: any = {
    env: {
      NVIDIA_TEXT_API_KEY: textKey ? `Var (Başlıyor: ${textKey.substring(0, 7)}...)` : 'YOK! (Vercel Environment Variables kısmından eklenmeli)',
      NVIDIA_IMAGE_API_KEY: imageKey ? `Var (Başlıyor: ${imageKey.substring(0, 7)}...)` : 'YOK! (Vercel Environment Variables kısmından eklenmeli)',
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

  return NextResponse.json(result);
}
