'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkModerator() {
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

export async function approveGalleryImage(id: string) {
  const { supabase, error: authError } = await checkModerator()
  if (authError) return { error: authError }

  const { error } = await supabase.from('gallery').update({ is_approved: true }).eq('id', id)

  if (error) {
    console.error('Error approving image:', error)
    return { error: 'Onaylanırken hata oluştu.' }
  }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function rejectGalleryImage(id: string, imageUrl: string) {
  const { supabase, error: authError } = await checkModerator()
  if (authError) return { error: authError }

  const filename = imageUrl.split('/').pop()
  if (filename) {
    await supabase.storage.from('gallery').remove([filename])
  }

  const { error } = await supabase.from('gallery').delete().eq('id', id)

  if (error) {
    console.error('Error rejecting image:', error)
    return { error: 'Reddedilirken hata oluştu.' }
  }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}
