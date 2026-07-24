import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import MagazineReader from '@/components/ui/magazine/MagazineReader';
import { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: magazine } = await supabase
    .from('magazines')
    .select('title, issue_number, cover_image_url')
    .eq(isNaN(Number(resolvedParams.id)) ? 'id' : 'issue_number', resolvedParams.id)
    .single();

  if (!magazine) {
    return { title: 'Dergi Bulunamadı' };
  }

  return {
    title: `${magazine.title} - Sayı ${magazine.issue_number} - Habbo Zone`,
    description: `Habbo Zone Dergisi Sayı ${magazine.issue_number} okuyun.`,
    openGraph: {
      title: `${magazine.title} - Sayı ${magazine.issue_number}`,
      images: [magazine.cover_image_url],
    }
  };
}

export default async function MagazineReaderPage({ params }: Props) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  // Accept either UUID or Issue Number
  const isNumeric = !isNaN(Number(resolvedParams.id));
  
  let query = supabase.from('magazines').select('*');
  if (isNumeric) {
    query = query.eq('issue_number', resolvedParams.id);
  } else {
    query = query.eq('id', resolvedParams.id);
  }

  const { data: magazine } = await query.single();

  if (!magazine) {
    notFound();
  }

  return <MagazineReader magazine={magazine} />;
}
