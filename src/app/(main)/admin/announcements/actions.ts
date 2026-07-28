'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase: null as any, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !['Owner', 'Developer', 'Administrator', 'Moderator'].includes(profile.role)) {
    return { supabase: null as any, error: 'Yetkisiz işlem' }
  }

  return { supabase, error: null as string | null }
}

export async function addAnnouncement(formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const message = formData.get('message') as string
  if (!message) return { error: 'Mesaj zorunludur.' }

  const { error } = await supabase.from('announcements').insert({
    message, is_active: true
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
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

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
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('announcements').delete().eq('id', id)

  if (error) {
    console.error('Delete announcement error:', error)
    return { error: 'Duyuru silinirken bir hata oluştu.' }
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/')
  return { success: true }
}
