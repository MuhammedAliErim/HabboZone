'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

export async function createGuide(formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const content = formData.get('content') as string
  const read_time = formData.get('read_time') as string
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('guides').insert({
    title, category, content, read_time, image_url
  })

  if (error) {
    console.error('Error creating guide:', error)
    return { error: 'Failed to create guide: ' + error.message }
  }

  revalidatePath('/admin/guides')
  revalidatePath('/guides')
  revalidatePath('/')
  redirect('/admin/guides')
}

export async function updateGuide(id: string, formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const content = formData.get('content') as string
  const read_time = formData.get('read_time') as string
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('guides').update({
    title, category, content, read_time, image_url
  }).eq('id', id)

  if (error) {
    console.error('Error updating guide:', error)
    return { error: 'Failed to update guide: ' + error.message }
  }

  revalidatePath('/admin/guides')
  revalidatePath('/guides')
  revalidatePath('/')
  redirect('/admin/guides')
}

export async function deleteGuide(id: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('guides').delete().eq('id', id)

  if (error) {
    console.error('Error deleting guide:', error)
    return { error: 'Failed to delete guide' }
  }

  revalidatePath('/admin/guides')
  revalidatePath('/guides')
  revalidatePath('/')
  return { success: true }
}
