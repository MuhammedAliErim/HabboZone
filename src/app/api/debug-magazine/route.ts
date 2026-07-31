import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const { allowed, resetIn } = checkRateLimit(getRateLimitKey(request), 10)
  if (!allowed) {
    return NextResponse.json({ error: 'Çok fazla istek. Lütfen bekleyin.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) },
    })
  }

  try {
    const supabase = await createClient();
    
    // 1. Auth kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      return NextResponse.json({ step: 'auth', error: authError.message }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json({ step: 'auth', error: 'No user logged in' }, { status: 401 });
    }

    // 2. Staff kontrolü
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 3. Magazines tablosu sütun bilgisi — boş select deneyelim
    const { data: magTest, error: magTestError } = await supabase
      .from('magazines')
      .select('*')
      .limit(1);

    // 4. Asıl insert denemesi
    const { data: insertData, error: insertError } = await supabase
      .from('magazines')
      .insert({
        title: 'DEBUG TEST',
        cover_image_url: '/placeholder.png',
        issue_number: Math.floor(Math.random() * 89999) + 10000,
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    // 5. Eğer insert başarılıysa sil
    if (insertData) {
      await supabase.from('magazines').delete().eq('id', insertData.id);
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      staff: staffData ? { found: true, role: staffData.role } : { found: false, error: staffError?.message },
      magSelect: { 
        success: !magTestError, 
        error: magTestError?.message,
        columns: magTest && magTest.length > 0 ? Object.keys(magTest[0]) : 'no rows',
        sampleRow: magTest?.[0]
      },
      insert: {
        success: !insertError,
        error: insertError ? { message: insertError.message, details: insertError.details, hint: insertError.hint, code: insertError.code } : null,
        data: insertData
      }
    });
  } catch (e: any) {
    await logger.error('api_debug_magazine', e?.message || 'Unknown error')
    return NextResponse.json({ step: 'exception', error: e.message, stack: e.stack }, { status: 500 });
  }
}
