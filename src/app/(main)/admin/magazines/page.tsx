import { getAdminMagazines, deleteMagazine } from '@/app/actions/magazine'
import Link from 'next/link'
import { Plus, Edit, Trash2, Wand2 } from 'lucide-react'
import Image from 'next/image'

export default async function AdminMagazinesPage() {
  const magazines = await getAdminMagazines();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Gelişmiş AI Dergi Yönetimi</h1>
        <form action={async () => {
          'use server';
          const { createMagazine } = await import('@/app/actions/magazine');
          const { redirect } = await import('next/navigation');
          const newMag = await createMagazine('Yeni Dergi', 'Açıklama girilmedi.');
          redirect(`/admin/magazines/${newMag.id}/edit`);
        }}>
          <button 
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-md font-bold transition-colors"
          >
            <Wand2 size={18} />
            Yeni AI Dergi Oluştur
          </button>
        </form>
      </div>

      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
              <tr>
                <th className="px-6 py-4">Kapak</th>
                <th className="px-6 py-4">Sayı</th>
                <th className="px-6 py-4">Başlık</th>
                <th className="px-6 py-4">Yayın Tarihi</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {magazines && magazines.length > 0 ? (
                magazines.map((item) => (
                  <tr key={item.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-16 rounded overflow-hidden border border-[#444]">
                        <Image 
                          src={item.cover_image || item.cover_image_url || '/placeholder.png'} 
                          alt={item.title} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-yellow-500">
                      #{item.issue_number || item.id.substring(0, 4)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">
                      {item.title}
                      {item.is_ai_generated && <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">AI Destekli</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.published_at ? new Date(item.published_at).toLocaleString('tr-TR') : 'Yayınlanmadı'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/magazines/${item.id}/edit`}
                          className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        <form action={async () => {
                          'use server';
                          const { deleteMagazine } = await import('@/app/actions/magazine');
                          await deleteMagazine(item.id);
                        }}>
                          <button 
                            type="submit"
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            title="Sil"
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Henüz hiç gazete/dergi bulunmuyor.
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
