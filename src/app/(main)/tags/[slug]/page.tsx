import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Hash, Newspaper, BookOpen, Calendar, FileText } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: tag } = await supabase.from('tags').select('name').eq('slug', resolvedParams.slug).single();

  if (!tag) {
    return { title: 'Etiket Bulunamadı' };
  }

  return {
    title: `${tag.name} Etiketi - Habbo Zone`,
    description: `${tag.name} etiketi ile ilgili tüm haberler, gazeteler ve etkinlikler.`,
  };
}

export default async function TagPage({ params }: Props) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // 1. Fetch tag
  const { data: tag } = await supabase
    .from('tags')
    .select('id, name, slug')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!tag) {
    notFound();
  }

  let items: any[] = [];

  try {
    // 2. Try fetching from polymorphic taggables
    const { data: taggables, error: taggablesError } = await supabase
      .from('taggables')
      .select('target_id, target_type')
      .eq('tag_id', tag.id);

    if (!taggablesError && taggables && taggables.length > 0) {
      const newsIds = taggables.filter(t => t.target_type === 'news').map(t => t.target_id);
      const magazineIds = taggables.filter(t => t.target_type === 'magazine').map(t => t.target_id);
      const eventIds = taggables.filter(t => t.target_type === 'event').map(t => t.target_id);

      // Fetch News
      if (newsIds.length > 0) {
        const { data: news } = await supabase
          .from('news')
          .select('id, title, slug, summary, thumbnail_url, published_at')
          .in('id', newsIds)
          .eq('status', 'Published');
          
        if (news) {
          items.push(...news.map(n => ({
            id: n.id,
            _type: 'news',
            title: n.title,
            description: n.summary,
            url: `/news/${n.slug}`,
            imageUrl: n.thumbnail_url,
            date: n.published_at
          })));
        }
      }

      // Fetch Magazines
      if (magazineIds.length > 0) {
        const { data: magazines } = await supabase
          .from('magazines')
          .select('id, title, issue_number, cover_image_url, published_at')
          .in('id', magazineIds);
          
        if (magazines) {
          items.push(...magazines.map(m => ({
            id: m.id,
            _type: 'magazine',
            title: `${m.title} - Sayı ${m.issue_number}`,
            url: `/magazines/${m.issue_number}`, // Adjust based on your magazine route
            imageUrl: m.cover_image_url,
            date: m.published_at
          })));
        }
      }
      
      // Fetch Events
      if (eventIds.length > 0) {
        const { data: events } = await supabase
          .from('events')
          .select('id, title, description, image_url, event_date')
          .in('id', eventIds)
          .eq('is_active', true);
          
        if (events) {
          items.push(...events.map(e => ({
            id: e.id,
            _type: 'event',
            title: e.title,
            description: e.description,
            url: `/events`,
            imageUrl: e.image_url,
            date: e.event_date
          })));
        }
      }
    } else if (taggablesError) {
      // Fallback: If taggables doesn't exist, use news_tags
      const { data: newsTags } = await supabase
        .from('news_tags')
        .select('news_id')
        .eq('tag_id', tag.id);
        
      if (newsTags && newsTags.length > 0) {
        const newsIds = newsTags.map(nt => nt.news_id);
        const { data: news } = await supabase
          .from('news')
          .select('id, title, slug, summary, thumbnail_url, published_at')
          .in('id', newsIds)
          .eq('status', 'Published');
          
        if (news) {
          items.push(...news.map(n => ({
            id: n.id,
            _type: 'news',
            title: n.title,
            description: n.summary,
            url: `/news/${n.slug}`,
            imageUrl: n.thumbnail_url,
            date: n.published_at
          })));
        }
      }
    }
  } catch (e) {
    // Fallback on catch
    const { data: newsTags } = await supabase
      .from('news_tags')
      .select('news_id')
      .eq('tag_id', tag.id);
      
    if (newsTags && newsTags.length > 0) {
      const newsIds = newsTags.map(nt => nt.news_id);
      const { data: news } = await supabase
        .from('news')
        .select('id, title, slug, summary, thumbnail_url, published_at')
        .in('id', newsIds)
        .eq('status', 'Published');
        
      if (news) {
        items.push(...news.map(n => ({
          id: n.id,
          _type: 'news',
          title: n.title,
          description: n.summary,
          url: `/news/${n.slug}`,
          imageUrl: n.thumbnail_url,
          date: n.published_at
        })));
      }
    }
  }

  // Sort items by date descending
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper size={16} className="text-[#38bdf8]" />;
      case 'magazine': return <BookOpen size={16} className="text-yellow-400" />;
      case 'event': return <Calendar size={16} className="text-purple-400" />;
      case 'guide': return <FileText size={16} className="text-blue-400" />;
      default: return null;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'news': return 'Haber';
      case 'magazine': return 'Gazete';
      case 'event': return 'Etkinlik';
      case 'guide': return 'Rehber';
      default: return 'İçerik';
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full py-12 px-4">
      {/* Header */}
      <div className="mb-10 relative overflow-hidden rounded-xl border-2 border-black shadow-[8px_8px_0_#000] min-h-[250px] flex items-center justify-center">
        {/* Abstract Background Image */}
        <div className="absolute inset-0 z-0">
           <img src="/images/assets/Gemini_Generated_Image_2zj0l42zj0l42zj0.png" className="w-full h-full object-cover opacity-30 pixelated" alt="Tag Background" onError={(e) => (e.currentTarget.style.display = 'none')} />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e293b] rounded-full border-4 border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.3)] mb-4">
            <Hash size={32} className="text-[#38bdf8]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
            {tag.name}
          </h1>
          <p className="text-gray-300 text-lg font-bold bg-black/40 px-4 py-1 rounded-full inline-block backdrop-blur-sm border border-gray-700">
            Bu etiketle ilgili <strong className="text-white">{items.length}</strong> içerik bulundu
          </p>
        </div>
      </div>

      {/* Results */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              href={item.url}
              key={`${item._type}-${item.id}`}
              className="bg-[#1e293b] border-2 border-black rounded-lg hover:border-[#38bdf8] hover:-translate-y-2 transition-all shadow-[4px_4px_0_#000] flex flex-col group overflow-hidden"
            >
              <div className="h-40 w-full relative border-b-2 border-black bg-[#0a1325]">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover pixelated group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getTypeIcon(item._type)}
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-[4px] flex items-center gap-1.5 border border-gray-700">
                  {getTypeIcon(item._type)}
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{getTypeName(item._type)}</span>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-[#38bdf8] transition-colors">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto flex items-center text-gray-500 text-[11px] font-bold">
                  {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[#1e293b] border-2 border-dashed border-gray-700 rounded-lg p-16 text-center flex flex-col items-center">
          <Hash size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-black text-white mb-2">İçerik Bulunamadı</h3>
          <p className="text-gray-400 text-sm">
            Şu anda bu etikete ait herhangi bir içerik bulunmuyor.
          </p>
          <Link href="/" className="mt-6 habbo-button success px-6 py-2">
            ANA SAYFAYA DÖN
          </Link>
        </div>
      )}
    </div>
  );
}
