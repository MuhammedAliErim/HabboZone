import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const { allowed, remaining, resetIn } = checkRateLimit(getRateLimitKey(request))
  if (!allowed) {
    return NextResponse.json({ error: 'Çok fazla istek. Lütfen bekleyin.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) },
    })
  }

  try {
    const supabase = await createClient();
    const { data: news, error } = await supabase
      .from('news')
      .select(`
        id, 
        title, 
        slug, 
        summary, 
        thumbnail_url, 
        published_at,
        authors ( name, habbo_username )
      `)
      .eq('status', 'Published')
      .order('published_at', { ascending: false });

    if (error) {
      await logger.error('api_news_query', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ news }, { status: 200 });
  } catch (err) {
    await logger.error('api_news_exception', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
