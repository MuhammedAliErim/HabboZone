import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import RoleSelect from './_components/RoleSelect'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kullanıcı Yönetimi</h1>

      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1f1f1f] text-gray-400 uppercase border-b border-[#333]">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Motto</th>
                <th className="px-6 py-4">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-right">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-[#333] hover:bg-[#333]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-[#1f1f1f] overflow-hidden">
                          <Image 
                            src={u.avatar_url || '/placeholder.png'} 
                            alt={u.username || 'User'} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate max-w-[200px]">
                      {u.motto || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RoleSelect userId={u.id} currentRole={u.role || 'Member'} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Kullanıcı bulunamadı.
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
