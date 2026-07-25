import { getAdminMagazines } from '@/app/actions/magazine'
import Link from 'next/link'
import { Edit, Trash2, Wand2, BookOpen, Sparkles, Calendar, ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'

export const revalidate = 0;

export const metadata = {
  title: 'AI Dergi & Gazete Yönetim Merkezi - Admin Paneli',
}

export default async function AdminMagazinesPage() {
  const magazines = await getAdminMagazines();
  const magCount = magazines?.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık & Eylem */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-purple-400" size={32} /> AI DERGİ & GAZETE MERKEZİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            HabboZone topluluk dergilerini, yapay zeka destekli sayvaları ve yayın sayılarını kontrol edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <Sparkles className="text-purple-400" size={20} />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Yayın Sayısı</span>
              <span className="text-base font-black text-purple-300">{magCount} Dergi</span>
            </div>
          </div>

          <form action={async () => {
            'use server';
            const { createMagazine } = await import('@/app/actions/magazine');
            const { redirect } = await import('next/navigation');
            const newMag = await createMagazine('Yeni Sayı', 'Yapay zeka ile hazırlanan yeni sayı açıklaması...');
            redirect(`/admin/magazines/${newMag.id}/edit`);
          }}>
            <button 
              type="submit"
              className="habbo-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
            >
              <Wand2 size={18} /> YENİ AI DERGİ BAŞLAT
            </button>
          </form>
        </div>
      </div>

      <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#050a14] border-b border-white/10 flex justify-between items-center">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="text-purple-400" size={16} /> TÜM SAYILAR VE ARŞİV LİSTESİ
          </h2>
          <span className="text-xs text-gray-400 font-bold bg-white/5 px-3 py-1 rounded-lg">
            Toplam {magCount} Kayıt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs font-black uppercase tracking-wider border-b border-white/10">
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
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-[#050a14] border border-white/10 shadow-md group-hover:scale-105 transition-transform">
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
                      <span className="font-black text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-1 rounded-lg">
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
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                          <Calendar size={13} /> {new Date(item.published_at).toLocaleDateString('tr-TR')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                          <Clock size={13} /> Taslak / Yayınlanmadı
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/magazines/${item.id}/edit`}
                          className="px-3.5 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Edit size={14} /> STÜDYOYA GİT
                        </Link>
                        <form action={async () => {
                          'use server';
                          const { deleteMagazine } = await import('@/app/actions/magazine');
                          await deleteMagazine(item.id);
                        }}>
                          <button 
                            type="submit"
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"
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
