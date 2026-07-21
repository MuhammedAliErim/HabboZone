import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { MessageSquare, Users, FileText } from 'lucide-react';

export const revalidate = 0; // Disable caching for now to always show fresh data

export default async function ForumIndexPage() {
  const supabase = createClient();

  // Kategori ve alt forumları çek
  // Supabase'de nested join (categories -> forums)
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id, 
      name, 
      description,
      forums (
        id,
        title,
        slug,
        description,
        icon
      )
    `)
    .eq('type', 'forum')
    .order('name'); // Varsa order_index de eklenebilir.

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Forum Başlığı */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-4">
          Topluluk Forumu
        </h1>
        <p className="text-white/60 text-lg max-w-2xl">
          HabboZone üyeleriyle tanış, tartışmalara katıl, rehberler oku ve rozetler kazan. Habbo dünyasının nabzı burada atıyor!
        </p>
        
        {/* Hızlı İstatistikler (Şimdilik statik) */}
        <div className="flex gap-6 mt-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <MessageSquare className="text-blue-400" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">12.4K</div>
              <div className="text-xs text-white/50 uppercase font-bold tracking-wider">Mesaj</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FileText className="text-purple-400" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">3.2K</div>
              <div className="text-xs text-white/50 uppercase font-bold tracking-wider">Konu</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="text-green-400" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">850</div>
              <div className="text-xs text-white/50 uppercase font-bold tracking-wider">Aktif Üye</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kategoriler ve Forumlar */}
      <div className="space-y-8">
        {error ? (
          <div className="p-4 bg-red-500/20 border border-red-500 text-red-500 rounded-lg">
            Forum verileri çekilirken bir hata oluştu: {error.message}
          </div>
        ) : categories?.length === 0 ? (
          <div className="text-center p-10 text-white/50">
            Henüz hiç kategori eklenmemiş. Admin panelinden kategori ve forum eklemelisin.
          </div>
        ) : (
          categories?.map((category) => (
            <div key={category.id} className="space-y-4">
              {/* Kategori Başlığı */}
              <div className="flex items-center gap-3 px-2">
                <h2 className="text-2xl font-black uppercase tracking-widest text-primary">
                  {category.name}
                </h2>
                <div className="h-px bg-white/10 flex-1" />
              </div>
              
              {/* Alt Forumlar Listesi */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {category.forums && category.forums.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {category.forums.map((forum: any) => (
                      <Link 
                        key={forum.id} 
                        href={`/forum/${forum.slug}`}
                        className="flex items-center gap-4 p-6 hover:bg-white/5 transition-colors group cursor-pointer"
                      >
                        {/* Forum İkonu */}
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-primary/50 transition-all">
                          {forum.icon || '💬'}
                        </div>
                        
                        {/* Forum Bilgisi */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {forum.title}
                          </h3>
                          <p className="text-sm text-white/50 mt-1 line-clamp-1">
                            {forum.description || 'Bu forumun açıklaması bulunmuyor.'}
                          </p>
                        </div>

                        {/* Son Mesaj Gösterimi (Dummy data for layout) */}
                        <div className="hidden md:block w-64 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                          <div className="text-white/70 line-clamp-1 mb-1 hover:underline">
                            Son Konu Başlığı Örneği...
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/40">
                            <span className="font-bold">odokhan</span>
                            <span>2 dk önce</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-sm text-white/40 italic text-center">
                    Bu kategoriye ait alt forum bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
