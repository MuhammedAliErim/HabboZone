'use client'

import { useState, useEffect } from 'react'
import { Bell, Info, MessageSquare, Heart, Award, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { markAsRead, markAllAsRead } from '../actions'
import { createClient } from '@/utils/supabase/client'

type Notification = {
  id: string
  user_id: string
  type: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}

export default function NotificationsClient({ 
  initialNotifications, 
  userId 
}: { 
  initialNotifications: Notification[]
  userId: string
}) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Realtime subscription
    const channel = supabase
      .channel('public:notifications_page')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      )
      await markAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true)
    const { success } = await markAllAsRead()
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }
    setIsMarkingAll(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'reply': return <MessageSquare size={20} className="text-blue-400" />
      case 'like': return <Heart size={20} className="text-pink-400" />
      case 'award': return <Award size={20} className="text-yellow-400" />
      case 'system': return <Info size={20} className="text-purple-400" />
      default: return <Bell size={20} className="text-gray-400" />
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1e293b]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Tüm Bildirimleriniz
          {unreadCount > 0 && (
            <span className="bg-red-500/10 text-red-400 text-xs py-1 px-2 rounded-full border border-red-500/20">
              {unreadCount} Okunmamış
            </span>
          )}
        </h2>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-sm font-bold rounded transition-colors disabled:opacity-50"
          >
            <CheckCircle2 size={16} className="text-blue-400" />
            {isMarkingAll ? 'İşaretleniyor...' : 'Tümünü Okundu İşaretle'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex flex-col sm:flex-row gap-4 p-5 rounded-lg border cursor-pointer transition-all ${
                !notif.is_read 
                  ? 'bg-[#1e293b]/40 border-blue-500/30 hover:bg-[#1e293b]/60' 
                  : 'bg-[#111827] border-[#1e293b] hover:bg-[#1e293b]/30'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#090e17] border border-[#1e293b]">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={`text-base ${!notif.is_read ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                    {new Date(notif.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {!notif.is_read && (
                <div className="shrink-0 flex items-center justify-center sm:self-center self-start">
                  <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-[#111827] rounded-lg border border-[#1e293b] border-dashed">
            <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center mb-4">
              <Bell size={32} className="text-[#64748b]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Bildirim Kutusu Boş</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Şu anda gösterilecek herhangi bir bildiriminiz bulunmuyor. Etkileşimde bulundukça bildirimleriniz burada listelenecektir.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
