import { createClient } from '@/utils/supabase/server'
import { Users, Newspaper, Gem, MessageSquare } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts for various entities
  const [usersCount, newsCount, itemsCount, topicsCount] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('habbo_items').select('*', { count: 'exact', head: true }),
    supabase.from('forum_topics').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    {
      label: 'Toplam Kullanıcı',
      value: usersCount.count || 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      label: 'Toplam Haber',
      value: newsCount.count || 0,
      icon: Newspaper,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      label: 'Nadire Eşyalar',
      value: itemsCount.count || 0,
      icon: Gem,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    },
    {
      label: 'Forum Konuları',
      value: topicsCount.count || 0,
      icon: MessageSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    }
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6 flex items-center gap-4">
              <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/admin/news/new" className="block p-4 bg-[#1f1f1f] hover:bg-[#333] border border-[#333] rounded-lg text-center transition-colors">
            <Newspaper className="mx-auto mb-2 text-gray-400" size={24} />
            <span className="text-gray-300 font-medium">Yeni Haber Ekle</span>
          </a>
          <a href="/admin/values" className="block p-4 bg-[#1f1f1f] hover:bg-[#333] border border-[#333] rounded-lg text-center transition-colors">
            <Gem className="mx-auto mb-2 text-gray-400" size={24} />
            <span className="text-gray-300 font-medium">Yeni Nadire Ekle</span>
          </a>
          <a href="/admin/users" className="block p-4 bg-[#1f1f1f] hover:bg-[#333] border border-[#333] rounded-lg text-center transition-colors">
            <Users className="mx-auto mb-2 text-gray-400" size={24} />
            <span className="text-gray-300 font-medium">Kullanıcıları Yönet</span>
          </a>
        </div>
      </div>
    </div>
  )
}
