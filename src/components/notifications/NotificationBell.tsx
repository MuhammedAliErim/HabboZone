'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Info, MessageSquare, Heart, Award } from 'lucide-react'
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

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) setNotifications(data)
  }

  useEffect(() => {
    fetchNotifications()

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false)
    if (!notification.is_read) {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      )
      const result = await markAsRead(notification.id)
      if (result?.error) {
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, is_read: false } : n)
        )
      }
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
        className="relative flex items-center justify-center w-10 h-10 rounded-[2px] bg-[#050a14] hover:bg-[#0a1325] border border-[#1e293b] hover:border-[#facc15] transition-colors shadow"
      >
        <Bell size={18} className="text-gray-300" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-600 text-white text-[10px] font-black rounded-[2px] border border-[#050a14] shadow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#050a14]">
            <h3 className="font-black uppercase tracking-wider text-white text-sm">BİLDİRİMLER</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-black uppercase tracking-wider text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded-[2px] border border-[#3b82f6]/30">
                {unreadCount} OKUNMAMIŞ
              </span>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3 p-4 border-b border-[#1e293b] cursor-pointer hover:bg-[#050a14]/60 transition-colors ${!notif.is_read ? 'bg-[#050a14]/80' : ''}`}
                >
                  <div className="shrink-0 mt-0.5">
                    <div className={`w-8 h-8 rounded-[2px] flex items-center justify-center bg-[#050a14] border ${!notif.is_read ? 'border-[#3b82f6]' : 'border-[#1e293b]'}`}>
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!notif.is_read ? 'text-white font-black uppercase tracking-tight' : 'text-gray-300 font-medium'}`}>
                      {notif.message}
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
                      {new Date(notif.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#facc15] rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <Bell size={28} className="text-gray-600 mb-2" />
                <p className="text-xs font-black uppercase tracking-wider text-gray-400">HENÜZ BİLDİRİMİNİZ YOK.</p>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-[#1e293b] bg-[#050a14]">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-center text-xs font-black uppercase tracking-wider text-[#3b82f6] hover:text-[#facc15] transition-colors"
            >
              TÜM BİLDİRİMLERİ GÖR
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
