import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
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
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ news }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
