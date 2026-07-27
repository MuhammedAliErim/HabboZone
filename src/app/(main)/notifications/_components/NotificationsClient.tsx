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
        <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
          TÜM BİLDİRİMLERİNİZ
          {unreadCount > 0 && (
            <span className="bg-red-500/10 text-red-400 text-[10px] font-black uppercase py-0.5 px-2 rounded-[2px] border border-red-500/30">
              {unreadCount} OKUNMAMIŞ
            </span>
          )}
        </h2>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="habbo-button blue px-3 py-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-tight disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            {isMarkingAll ? 'İŞARETLENİYOR...' : 'TÜMÜNÜ OKUNDU İŞARETLE'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex flex-col sm:flex-row gap-4 p-4 rounded-[3px] border cursor-pointer transition-all ${
                !notif.is_read 
                  ? 'bg-[#050a14] border-[#3b82f6] shadow-[inset_0_0_8px_rgba(59,130,246,0.15)] hover:bg-[#0a1325]' 
                  : 'bg-[#050a14] border-[#1e293b] hover:bg-[#0a1325]'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-[2px] bg-[#0a1325] border border-[#1e293b]">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!notif.is_read ? 'text-white font-black' : 'text-gray-300 font-medium'}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-[1px] bg-[#facc15]"></span>
                    {notif.created_at.replace('T', ' ').slice(0, 16)}
                  </span>
                </div>
              </div>
              {!notif.is_read && (
                <div className="shrink-0 flex items-center justify-center sm:self-center self-start">
                  <div className="w-2.5 h-2.5 bg-[#3b82f6] rounded-[1px] shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-[#050a14] rounded-[3px] border border-[#1e293b] border-dashed">
            <div className="w-12 h-12 rounded-[2px] bg-[#0a1325] border border-[#1e293b] flex items-center justify-center mb-4">
              <Bell size={24} className="text-[#facc15]" />
            </div>
            <h3 className="text-sm font-black uppercase text-white mb-1">BİLDİRİM KUTUSU BOŞ</h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto">
              Şu anda gösterilecek herhangi bir bildiriminiz bulunmuyor. Etkileşimde bulundukça bildirimleriniz burada listelenecektir.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
