import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NotificationsClient from './_components/NotificationsClient'

export const metadata = {
  title: 'Bildirimler - Habbo Zone',
  description: 'Habbo Zone bildirim merkezi',
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Bildirimleri çek
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="w-full">
      {/* Header Alanı */}
      <div className="bg-[#0a1325] border-b border-[#1e293b] py-8">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-[#facc15] rounded-[1px]"></span>
                <span className="text-[#facc15] text-[10px] font-black tracking-widest uppercase">HABBOZONE BİLDİRİM MERKEZİ</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
                BİLDİRİMLER
              </h1>
              <p className="text-gray-300 mt-2 text-xs max-w-2xl font-medium">
                Sistemden, forumdan ve etkileşimlerinizden gelen tüm güncel bildirimleriniz.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-6 shadow">
          <NotificationsClient initialNotifications={notifications || []} userId={user.id} />
        </div>
      </div>
    </div>
  )
}
