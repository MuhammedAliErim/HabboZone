'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAnnouncement(formData: FormData) {
  const supabase = await createClient()
  
  const message = formData.get('message') as string

  if (!message) {
    return { error: 'Mesaj zorunludur.' }
  }

  const { error } = await supabase
    .from('announcements')
    .insert({
      message,
      is_active: true
    })

  if (error) {
    console.error('Add announcement error:', error)
    return { error: 'Duyuru eklenirken bir hata oluştu.' }
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/')
  return { success: true }
}

export async function toggleAnnouncement(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('announcements')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Toggle announcement error:', error)
    return { error: 'Duyuru güncellenirken bir hata oluştu.' }
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/')
  return { success: true }
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete announcement error:', error)
    return { error: 'Duyuru silinirken bir hata oluştu.' }
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/')
  return { success: true }
}
