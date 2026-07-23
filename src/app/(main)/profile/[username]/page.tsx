import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, FileText, User, Coins } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

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
  if (profile.role === 'Admin' || profile.role === 'Editor' || profile.role === 'Journalist' || profile.role === 'Owner') {
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
    Owner: 'bg-red-100 text-red-800 border-red-300',
    Admin: 'bg-red-100 text-red-800 border-red-300',
    Developer: 'bg-blue-100 text-blue-800 border-blue-300',
    Moderator: 'bg-green-100 text-green-800 border-green-300',
    Editor: 'bg-purple-100 text-purple-800 border-purple-300',
    Journalist: 'bg-purple-100 text-purple-800 border-purple-300',
    User: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Profile Header */}
      <div className="habbo-box bg-white overflow-hidden">
        <div className="habbo-box-header blue">
            Oyuncu Profili
        </div>
        <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <User size={150} className="text-blue-600" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded bg-white border border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center p-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
                    <HabboAvatar 
                        username={profile.habbo_username || 'Habbo'} 
                        direction={2} 
                        headDirection={3} 
                        size="l"
                        className="scale-110 relative z-10 filter drop-shadow-md mt-6"
                    />
                </div>
                
                <div className="text-center md:text-left flex-1 space-y-4">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-gray-800 drop-shadow-sm">
                        {profile.username}
                    </h1>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-widest shadow-sm ${roleColors[profile.role] || roleColors.User}`}>
                            {profile.role || 'Kullanıcı'}
                        </span>
                        
                        {profile.habbo_username && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm flex items-center gap-1">
                                <img src="https://habbo.com.tr/favicon.ico" alt="Habbo" className="w-3 h-3" />
                                {profile.habbo_username}
                            </span>
                        )}

                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 border border-green-300 shadow-sm flex items-center gap-1">
                            <Coins size={12} />
                            {profile.hz_points || 0} HZ Puanı
                        </span>
                    </div>

                    <div className="text-xs text-gray-500 font-bold bg-white p-2 border border-gray-200 rounded shadow-inner inline-block mt-2">
                        Katılım: {new Date(profile.created_at).toLocaleDateString('tr-TR')}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Forum Topics */}
        <div className="habbo-box bg-white">
          <div className="habbo-box-header orange flex items-center gap-2">
            <MessageCircle size={16} /> Son Forum Konuları
          </div>
          
          <div className="p-4 bg-gray-50">
            {topics && topics.length > 0 ? (
                <div className="space-y-3">
                {topics.map((topic) => (
                    <Link 
                    key={topic.id} 
                    href={`/forum/topic/${topic.slug}`}
                    className="block p-3 rounded bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 transition-colors shadow-sm group"
                    >
                    <h3 className="font-bold text-sm truncate text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
                        {topic.title}
                    </h3>
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
                        <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-600">
                        <MessageCircle size={10} />
                        {(topic.replies as any)?.[0]?.count || 0}
                        </span>
                    </div>
                    </Link>
                ))}
                </div>
            ) : (
                <div className="text-center p-6 text-gray-400 text-xs font-bold bg-white border border-gray-200 rounded">
                Henüz konu açmamış.
                </div>
            )}
          </div>
        </div>

        {/* Recent News (If Author) */}
        {(profile.role === 'Admin' || profile.role === 'Editor' || profile.role === 'Journalist' || profile.role === 'Owner') && (
          <div className="habbo-box bg-white">
            <div className="habbo-box-header green flex items-center gap-2">
              <FileText size={16} /> Son Haberleri
            </div>
            
            <div className="p-4 bg-gray-50">
                {news && news.length > 0 ? (
                <div className="space-y-3">
                    {news.map((item) => (
                    <Link 
                        key={item.id} 
                        href={`/news/${item.slug}`}
                        className="block p-3 rounded bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 transition-colors shadow-sm group"
                    >
                        <h3 className="font-bold text-sm truncate text-gray-800 group-hover:text-green-700 transition-colors mb-2">
                        {item.title}
                        </h3>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{new Date(item.published_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                    </Link>
                    ))}
                </div>
                ) : (
                <div className="text-center p-6 text-gray-400 text-xs font-bold bg-white border border-gray-200 rounded">
                    Henüz haber yazmamış.
                </div>
                )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
