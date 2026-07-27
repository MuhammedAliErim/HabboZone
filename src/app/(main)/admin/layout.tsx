import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AdminSidebar from './_components/AdminSidebar'

export const metadata = {
  title: 'Admin Paneli - HabboZone',
}

const adminRoles = ['Owner', 'Developer', 'Administrator', 'Moderator', 'Admin', 'Editor', 'Yazar', 'Muhabir', 'Staff', 'Yetkili', 'Yönetici', 'Birim Sorumlusu']

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !adminRoles.includes(profile.role)) {
    redirect('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row gap-6">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-4 sticky top-24 shadow-2xl">
          <div className="habbo-box-header mb-4 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white">YÖNETİM PANELİ</span>
            <span className="w-2 h-2 bg-[#facc15] rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
          </div>
          
          <AdminSidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 min-h-full shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  )
}
