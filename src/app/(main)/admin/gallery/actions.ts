'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveGalleryImage(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['Owner', 'Developer', 'Administrator', 'Moderator'].includes(profile.role)) {
    throw new Error('Yetkisiz işlem')
  }

  const { error } = await supabase
    .from('gallery')
    .update({ is_approved: true })
    .eq('id', id)

  if (error) {
    console.error('Error approving image:', error)
    throw new Error('Onaylanırken hata oluştu.')
  }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

export async function rejectGalleryImage(id: string, imageUrl: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['Owner', 'Developer', 'Administrator', 'Moderator'].includes(profile.role)) {
    throw new Error('Yetkisiz işlem')
  }

  // Extract filename from URL to delete from storage
  const filename = imageUrl.split('/').pop()

  if (filename) {
    await supabase.storage.from('gallery').remove([filename])
  }

  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error rejecting image:', error)
    throw new Error('Reddedilirken hata oluştu.')
  }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}
