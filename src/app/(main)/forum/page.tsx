import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { MessageSquare, Users, FileText } from 'lucide-react';

export const revalidate = 0; // Disable caching for now to always show fresh data

export default async function ForumIndexPage() {
  const supabase = await createClient();

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
    .order('name'); 

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 py-6">
      
      {/* Forum Başlığı */}
      <div className="habbo-box bg-white">
        <div className="habbo-box-header orange">
          Topluluk Forumu
        </div>
        <div className="p-6">
            <p className="text-gray-600 text-sm mb-6 max-w-2xl">
            HabboZone üyeleriyle tanış, tartışmalara katıl, rehberler oku ve rozetler kazan. Habbo dünyasının nabzı burada atıyor!
            </p>
            
            {/* Hızlı İstatistikler */}
            <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded border border-gray-200">
                <div className="p-2 bg-blue-100 rounded">
                <MessageSquare className="text-blue-500" size={16} />
                </div>
                <div>
                <div className="text-sm font-bold text-gray-800">12.4K</div>
                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Mesaj</div>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded border border-gray-200">
                <div className="p-2 bg-purple-100 rounded">
                <FileText className="text-purple-500" size={16} />
                </div>
                <div>
                <div className="text-sm font-bold text-gray-800">3.2K</div>
                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Konu</div>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded border border-gray-200">
                <div className="p-2 bg-green-100 rounded">
                <Users className="text-green-500" size={16} />
                </div>
                <div>
                <div className="text-sm font-bold text-gray-800">850</div>
                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Aktif Üye</div>
                </div>
            </div>
            </div>
        </div>
      </div>

      {/* Kategoriler ve Forumlar */}
      <div className="space-y-6">
        {error ? (
          <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm font-bold shadow-sm">
            Forum verileri çekilirken bir hata oluştu: {error.message}
          </div>
        ) : categories?.length === 0 ? (
          <div className="habbo-box p-10 text-center text-gray-500 bg-white">
            Henüz hiç kategori eklenmemiş. Admin panelinden kategori ve forum eklemelisin.
          </div>
        ) : (
          categories?.map((category, index) => (
            <div key={category.id} className="habbo-box">
              {/* Kategori Başlığı */}
              <div className={`habbo-box-header ${index % 2 === 0 ? 'blue' : 'green'}`}>
                {category.name}
              </div>
              
              {/* Alt Forumlar Listesi */}
              <div className="bg-white">
                {category.forums && category.forums.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {category.forums.map((forum: any) => (
                      <Link 
                        key={forum.id} 
                        href={`/forum/${forum.slug}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                      >
                        {/* Forum İkonu */}
                        <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl group-hover:scale-105 transition-all shadow-sm">
                          {forum.icon || '💬'}
                        </div>
                        
                        {/* Forum Bilgisi */}
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
                            {forum.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {forum.description || 'Bu forumun açıklaması bulunmuyor.'}
                          </p>
                        </div>

                        {/* Son Mesaj Gösterimi */}
                        <div className="hidden md:block w-48 text-xs bg-gray-100 p-2 rounded border border-gray-200">
                          <div className="text-gray-700 font-bold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            Son Konu Başlığı...
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-500">
                            <span className="font-bold">odokhan</span>
                            <span>2 dk önce</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-sm text-gray-500 italic text-center bg-gray-50">
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
