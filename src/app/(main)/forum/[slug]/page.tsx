import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 60;

export default async function LegacyForumSlugRouter({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  // 1. Check if it's a known category or forum slug
  const mockCategories = [
    'duyurular', 'resmi-haberler', 'yarismalar-cekilisler',
    'topluluk', 'genel-sohbet', 'oda-tasarimlari',
    'ekonomi', 'takas-pazaryeri', 'fiyat-tartismalari'
  ];

  if (mockCategories.includes(slug)) {
    redirect(`/forum/category/${slug}`);
  }

  // 2. Check in database if it is a forum or category
  const { data: forum } = await supabase.from('forums').select('slug').eq('slug', slug).single();
  if (forum) {
    redirect(`/forum/category/${slug}`);
  }

  const { data: cat } = await supabase.from('categories').select('slug').eq('slug', slug).single();
  if (cat) {
    redirect(`/forum/category/${slug}`);
  }

  // 3. Otherwise, safely redirect to the topic page
  redirect(`/forum/topic/${slug}`);
}
