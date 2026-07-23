import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Gem,
  LogOut
} from 'lucide-react'

export const metadata = {
  title: 'Admin Paneli - HabboZone',
}

const adminRoles = ['Owner', 'Developer', 'Administrator', 'Moderator']

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
        <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-4 sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6 px-2 flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-400 rounded-sm"></span>
            Yönetim Paneli
          </h2>
          
          <nav className="space-y-1">
            <Link 
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/admin/news"
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
            >
              <Newspaper size={18} />
              <span>Haberler</span>
            </Link>
            
            <Link 
              href="/admin/values"
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
            >
              <Gem size={18} />
              <span>Nadire Değerleri</span>
            </Link>
            
            <Link 
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
            >
              <Users size={18} />
              <span>Kullanıcılar</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
