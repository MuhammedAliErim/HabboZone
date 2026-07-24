'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addEvent(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Yetkisiz erişim.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const event_date = formData.get('event_date') as string
  const event_type = formData.get('event_type') as string
  const image_url = formData.get('image_url') as string
  const reward_text = formData.get('reward_text') as string
  const room_link = formData.get('room_link') as string

  if (!title || !event_date) {
    return { error: 'Başlık ve Tarih zorunludur.' }
  }

  const { error } = await supabase
    .from('events')
    .insert({
      title,
      description: description || null,
      author_id: user.id,
      event_date: new Date(event_date).toISOString(),
      event_type: event_type || 'Genel',
      image_url: image_url || null,
      reward_text: reward_text || null,
      room_link: room_link || null,
      is_active: true
    })

  if (error) {
    console.error('Add event error:', error)
    return { error: 'Etkinlik eklenirken bir hata oluştu.' }
  }

  revalidatePath('/admin/events')
  revalidatePath('/events')
  revalidatePath('/')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete event error:', error)
    return { error: 'Etkinlik silinirken bir hata oluştu.' }
  }

  revalidatePath('/admin/events')
  revalidatePath('/events')
  revalidatePath('/')
  return { success: true }
}
