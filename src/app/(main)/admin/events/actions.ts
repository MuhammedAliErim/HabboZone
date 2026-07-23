'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addEvent(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const host_username = formData.get('host_username') as string
  const event_time = formData.get('event_time') as string
  const event_type = formData.get('event_type') as string
  const image_url = formData.get('image_url') as string

  if (!title || !host_username || !event_time) {
    return { error: 'Başlık, Yetkili ve Tarih zorunludur.' }
  }

  const { error } = await supabase
    .from('events')
    .insert({
      title,
      host_username,
      event_time: new Date(event_time).toISOString(),
      event_type: event_type || 'Genel',
      image_url: image_url || null
    })

  if (error) {
    console.error('Add event error:', error)
    return { error: 'Etkinlik eklenirken bir hata oluştu.' }
  }

  revalidatePath('/admin/events')
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
  revalidatePath('/')
  return { success: true }
}
