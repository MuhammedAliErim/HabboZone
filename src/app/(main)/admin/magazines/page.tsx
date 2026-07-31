import { getAdminMagazines } from '@/app/actions/magazine'
import Link from 'next/link'
import { Edit, Trash2, Wand2, BookOpen, Sparkles, Calendar, ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStat from '@/components/admin/AdminStat'

export const revalidate = 0;

export const metadata = {
  title: 'AI Dergi & Gazete Yönetim Merkezi - Admin Paneli',
}

export default async function AdminMagazinesPage() {
  const magazines = await getAdminMagazines();
  const magCount = magazines?.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={BookOpen}
        iconColor="text-purple-400"
        title="AI DERGİ & GAZETE MERKEZİ"
        subtitle="HabboZone topluluk dergilerini, yapay zeka destekli sayvaları ve yayın sayılarını kontrol edin."
        stats={
          <AdminStat
            label="Yayın Sayısı"
            value={<span className="text-purple-300">{magCount} Dergi</span>}
            icon={Sparkles}
            iconColor="text-purple-400"
          />
        }
        actions={
          <form action={async () => {
            'use server';
            const { createMagazine } = await import('@/app/(main)/admin/magazines/actions');
            const { redirect } = await import('next/navigation');
            const fd = new FormData();
            fd.set('title', 'Yeni Sayı');
            fd.set('issue_number', String(Math.floor(Math.random() * 8999) + 1000));
            fd.set('cover_image_url', '/placeholder.png');
            const result = await createMagazine(fd);
            if (result?.error) return;
            redirect('/admin/magazines');
          }}>
            <button
              type="submit"
              className="habbo-button px-5 py-3 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              <Wand2 size={18} /> YENİ AI DERGİ BAŞLAT
            </button>
          </form>
        }
      />

      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#050a14] border-b border-[#1e293b] flex justify-between items-center">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="text-purple-400" size={16} /> TÜM SAYILAR VE ARŞİV LİSTESİ
          </h2>
          <span className="text-xs text-gray-400 font-bold bg-[#050a14] px-3 py-1 rounded-[2px]">
            Toplam {magCount} Kayıt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs font-black uppercase tracking-wider border-b border-[#1e293b]">
              <tr>
                <th className="px-6 py-4 w-20">Kapak</th>
                <th className="px-6 py-4 w-24">Sayı No</th>
                <th className="px-6 py-4">Dergi Başlığı & Konu</th>
                <th className="px-6 py-4">Yayın Durumu / Tarih</th>
                <th className="px-6 py-4 text-right">Stüdyo Yönetimi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {magazines && magazines.length > 0 ? (
                magazines.map((item) => (
                  <tr key={item.id} className="hover:bg-[#050a14] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-16 rounded-[3px] overflow-hidden bg-[#050a14] border border-[#1e293b] shadow-md group-hover:scale-105 transition-transform">
                        <Image 
                          src={item.cover_image_url || '/placeholder.png'} 
                          alt={item.title || 'Dergi Kapağı'} 
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-1 rounded-[2px]">
                        #{item.issue_number || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-white text-base max-w-[280px] truncate group-hover:text-purple-300 transition-colors">
                        {item.title || 'Başlıksız Dergi Sayısı'}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[280px] mt-0.5 font-normal">
                        {item.description || 'Açıklama belirtilmedi'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.published_at ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-[3px]">
                          <Calendar size={13} /> {new Date(item.published_at).toLocaleDateString('tr-TR')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-[3px]">
                          <Clock size={13} /> Taslak / Yayınlanmadı
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/magazines/${item.id}/edit`}
                          className="px-3.5 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white rounded-[3px] transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Edit size={14} /> STÜDYOYA GİT
                        </Link>
                        <form action={async () => {
                          'use server';
                          const { deleteMagazine } = await import('@/app/(main)/admin/magazines/actions');
                          await deleteMagazine(item.id);
                        }}>
                          <button 
                            type="submit"
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-[3px] transition-all"
                            title="Sayfayı Arşivden Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <BookOpen size={40} className="mx-auto mb-3 text-gray-600 opacity-40" />
                    <p className="font-bold text-base text-gray-400">Henüz hiç dergi veya gazete sayısı oluşturulmadı.</p>
                    <p className="text-xs mt-1">Yukarıdaki butonla hemen yapay zeka destekli ilk sayınızı başlatabilirsiniz.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
