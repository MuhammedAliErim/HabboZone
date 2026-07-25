import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Gem,
  LogOut,
  BookOpen,
  Award,
  Calendar,
  Megaphone,
  Home,
  Book,
  Image,
  MessageSquare,
  Package,
  Wand2,
  Sparkles,
  CreditCard,
  Compass
} from 'lucide-react'

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
        <div className="habbo-box bg-[#070c18] border-2 border-white/10 rounded-xl p-4 sticky top-24 shadow-2xl">
          <h2 className="text-lg font-black text-white mb-6 px-2 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2 h-6 bg-yellow-400 rounded-sm shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>
            Yönetim Paneli
          </h2>
          
          <nav className="space-y-1 text-sm font-bold">
            <Link 
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <LayoutDashboard size={18} className="text-yellow-400" />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/admin/studio"
              className="flex items-center justify-between px-3 py-2.5 text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-lg transition-all my-1 shadow-lg shadow-pink-500/10"
            >
              <div className="flex items-center gap-3">
                <Wand2 size={18} className="text-pink-400 animate-pulse" />
                <span>Canva Stüdyo</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-pink-500 text-white text-[9px] font-black uppercase tracking-wider">PRO</span>
            </Link>

            <Link 
              href="/admin/id-studio"
              className="flex items-center justify-between px-3 py-2.5 text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all my-1 shadow-lg shadow-purple-500/10"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-purple-400 animate-bounce" />
                <span>Kart & İmza</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-purple-500 text-white text-[9px] font-black uppercase tracking-wider">NEW</span>
            </Link>

            <Link 
              href="/admin/room-studio"
              className="flex items-center justify-between px-3 py-2.5 text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all my-1 shadow-lg shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3">
                <Compass size={18} className="text-emerald-400 animate-spin-slow" />
                <span>Harita Stüdyo</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">MAP</span>
            </Link>
            
            <Link 
              href="/admin/news"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Newspaper size={18} className="text-green-400" />
              <span>Haberler</span>
            </Link>

            <Link 
              href="/admin/magazines"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <BookOpen size={18} className="text-pink-400" />
              <span>Gazete/Dergi</span>
            </Link>
            
            <Link 
              href="/admin/values"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Gem size={18} className="text-yellow-400" />
              <span>Nadire Değerleri</span>
            </Link>

            <Link 
              href="/admin/wiki"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Package size={18} className="text-purple-400" />
              <span>Wiki Kütüphanesi</span>
            </Link>

            <Link 
              href="/admin/badges"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Award size={18} className="text-blue-400" />
              <span>Rozetler</span>
            </Link>

            <Link 
              href="/admin/events"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Calendar size={18} className="text-emerald-400" />
              <span>Etkinlik Takvimi</span>
            </Link>

            <Link 
              href="/admin/announcements"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Megaphone size={18} className="text-red-400" />
              <span>Son Dakika Bantı</span>
            </Link>

            <Link 
              href="/admin/rooms"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Home size={18} className="text-cyan-400" />
              <span>Odalar</span>
            </Link>

            <Link 
              href="/admin/guides"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Book size={18} className="text-orange-400" />
              <span>Rehberler</span>
            </Link>
            
            <Link 
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Users size={18} className="text-indigo-400" />
              <span>Kullanıcılar</span>
            </Link>

            <Link 
              href="/admin/staff"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Users size={18} className="text-amber-400" />
              <span>Ekip Yönetimi</span>
            </Link>
            
            <Link 
              href="/admin/gallery"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <Image size={18} className="text-teal-400" />
              <span>Galeri</span>
            </Link>

            <Link 
              href="/admin/forum"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <MessageSquare size={18} className="text-violet-400" />
              <span>Forum Kategorileri</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-xl p-6 min-h-full shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  )
}
