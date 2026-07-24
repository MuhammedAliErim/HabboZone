'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Info, MessageSquare, Heart, Award, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { markAsRead } from '@/app/(main)/notifications/actions'
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

export default function NotificationBell({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Sadece ilk yüklemede ve Realtime güncellemelerinde çalışır
  useEffect(() => {
    fetchNotifications()

    // Realtime subscription (yeni bildirim gelirse)
    const channel = supabase
      .channel('public:notifications')
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

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) setNotifications(data)
  }

  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false)
    if (!notification.is_read) {
      // Optimizasyon için UI'ı hemen güncelle
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      )
      // Arka planda DB güncelle
      await markAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'reply': return <MessageSquare size={16} className="text-blue-400" />
      case 'like': return <Heart size={16} className="text-pink-400" />
      case 'award': return <Award size={16} className="text-yellow-400" />
      case 'system': return <Info size={16} className="text-purple-400" />
      default: return <Bell size={16} className="text-gray-400" />
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#111827] hover:bg-[#1e293b] border border-[#1e293b] transition-colors"
      >
        <Bell size={18} className="text-gray-300" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#090e17]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#111827]">
            <h3 className="font-bold text-white">Bildirimler</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                {unreadCount} Okunmamış
              </span>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3 p-4 border-b border-[#1e293b] cursor-pointer hover:bg-[#1e293b] transition-colors ${!notif.is_read ? 'bg-[#1e293b]/30' : ''}`}
                >
                  <div className="shrink-0 mt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#111827] border ${!notif.is_read ? 'border-blue-500/30' : 'border-[#334155]'}`}>
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.is_read ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <Bell size={32} className="text-[#334155] mb-2" />
                <p className="text-sm text-gray-400">Henüz bildiriminiz yok.</p>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-[#1e293b] bg-[#111827]">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-center text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Tüm Bildirimleri Gör
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
