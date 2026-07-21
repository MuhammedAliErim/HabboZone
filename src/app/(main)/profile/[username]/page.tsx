import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, FileText, User } from 'lucide-react';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);
  
  const supabase = await createClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch recent forum topics
  const { data: topics } = await supabase
    .from('topics')
    .select('id, title, slug, created_at, replies(count)')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch recent news if author
  let news: any[] = [];
  if (profile.role === 'admin' || profile.role === 'news_author') {
    const { data } = await supabase
      .from('news')
      .select('id, title, slug, published_at')
      .eq('author_id', profile.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5);
    if (data) {
      news = data;
    }
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500 text-white',
    moderator: 'bg-blue-500 text-white',
    news_author: 'bg-green-500 text-white',
    dj: 'bg-purple-500 text-white',
    user: 'bg-white/10 text-white',
  };

  const roleNames: Record<string, string> = {
    admin: 'Yönetici',
    moderator: 'Moderatör',
    news_author: 'Haber Yazarı',
    dj: 'Radyo DJ',
    user: 'Kullanıcı',
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-purple-500/20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 mt-8">
          <div className="w-32 h-32 rounded-2xl bg-black/40 border-4 border-white/10 shadow-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
            <img 
              src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${profile.habbo_username || 'Admin'}&direction=2&head_direction=3&gesture=sml&size=l`}
              alt={profile.username}
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black uppercase tracking-wider mb-2">
              {profile.username}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${roleColors[profile.role] || roleColors.user}`}>
                {roleNames[profile.role] || 'Kullanıcı'}
              </span>
              {profile.habbo_username && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/30">
                  Habbo: {profile.habbo_username}
                </span>
              )}
            </div>
            <p className="text-white/50 mt-4 text-sm max-w-xl">
              HabboZone topluluğunun değerli bir üyesi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Forum Topics */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
            <MessageCircle className="text-[#FF9800]" /> Son Konuları
          </h2>
          {topics && topics.length > 0 ? (
            <div className="space-y-4">
              {topics.map((topic) => (
                <Link 
                  key={topic.id} 
                  href={`/forum/topic/${topic.slug}`}
                  className="block p-4 rounded-xl bg-black/20 hover:bg-white/5 border border-white/5 transition-colors group"
                >
                  <h3 className="font-bold text-base truncate group-hover:text-[#FF9800] transition-colors mb-1">
                    {topic.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-white/50">
                    <span>{new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {(topic.replies as any)?.[0]?.count || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-white/50 bg-black/20 rounded-xl">
              Henüz konu açmamış.
            </div>
          )}
        </div>

        {/* Recent News (If Author) */}
        {(profile.role === 'admin' || profile.role === 'news_author') && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <FileText className="text-primary" /> Son Haberleri
            </h2>
            {news && news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/news/${item.slug}`}
                    className="block p-4 rounded-xl bg-black/20 hover:bg-white/5 border border-white/5 transition-colors group"
                  >
                    <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors mb-1">
                      {item.title}
                    </h3>
                    <div className="text-xs text-white/50">
                      <span>{new Date(item.published_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-white/50 bg-black/20 rounded-xl">
                Henüz haber yazmamış.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
