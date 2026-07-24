'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Yeni bildirim ekleme (Diğer modüllerden çağrılabilir)
export async function createNotification(
  user_id: string, 
  type: string, 
  message: string, 
  link?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id,
      type,
      message,
      link: link || null,
      is_read: false
    })

  if (error) {
    console.error('Error creating notification:', error)
    return { error: 'Bildirim oluşturulamadı.' }
  }

  return { success: true }
}

// Belirli bir bildirimi okundu işaretleme
export async function markAsRead(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Yetkisiz erişim.' }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error marking as read:', error)
    return { error: 'İşlem başarısız.' }
  }

  revalidatePath('/')
  return { success: true }
}

// Tüm bildirimleri okundu işaretleme
export async function markAllAsRead() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Yetkisiz erişim.' }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking all as read:', error)
    return { error: 'İşlem başarısız.' }
  }

  revalidatePath('/')
  revalidatePath('/notifications')
  return { success: true }
}
