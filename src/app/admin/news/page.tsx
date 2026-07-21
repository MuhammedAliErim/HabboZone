'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Edit } from 'lucide-react';

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string;
  author_id: string;
  profiles: {
    username: string;
    habbo_username: string;
  };
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('id, title, slug, status, published_at, author_id, profiles(username, habbo_username)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNews(data as any);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) {
      setNews(news.filter(n => n.id !== id));
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Haber Yönetimi</h2>
          <p className="text-white/60">Tüm haberleri, duyuruları buradan düzenleyebilirsin.</p>
        </div>
        <Link 
          href="/admin/news/new"
          className="bg-primary text-white font-bold uppercase tracking-widest px-6 py-3 rounded-lg pixel-borders hover:bg-primary/90 transition-colors"
        >
          + Yeni Haber Ekle
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-4xl text-primary">⚙</div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-sm uppercase tracking-wider text-white/60">
                  <th className="p-4 font-bold">Başlık</th>
                  <th className="p-4 font-bold">Yazar</th>
                  <th className="p-4 font-bold">Tarih</th>
                  <th className="p-4 font-bold">Durum</th>
                  <th className="p-4 font-bold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {news.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/50">
                      Henüz hiç haber yok.
                    </td>
                  </tr>
                ) : (
                  news.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold line-clamp-1">{item.title}</div>
                        <div className="text-xs text-white/50">{item.slug}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={`https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${item.profiles?.habbo_username || 'Admin'}&direction=2&head_direction=2&gesture=sml&size=s`}
                            alt={item.profiles?.username || 'Bilinmiyor'}
                            className="w-8 h-8 rounded-full bg-black/20"
                          />
                          <span className="text-sm font-bold">{item.profiles?.username || 'Bilinmiyor'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-white/70">
                        {item.published_at ? new Date(item.published_at).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                          item.status === 'Published' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          item.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          {item.status === 'Published' ? 'Yayında' : item.status === 'Draft' ? 'Taslak' : 'Planlı'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={`/admin/news/edit/${item.id}`} className="inline-flex p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="inline-flex p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
