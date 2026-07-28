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

export async function createRoom(formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const name = formData.get('name') as string
  const owner = formData.get('owner') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const max_users = parseInt(formData.get('max_users') as string, 10) || 100
  const current_users = parseInt(formData.get('current_users') as string, 10) || 0
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('rooms').insert({
    name, owner, description, category, max_users, current_users, image_url
  })

  if (error) {
    console.error('Error creating room:', error)
    return { error: 'Failed to create room: ' + error.message }
  }

  revalidatePath('/admin/rooms')
  revalidatePath('/rooms')
  revalidatePath('/')
  redirect('/admin/rooms')
}

export async function updateRoom(id: string, formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const name = formData.get('name') as string
  const owner = formData.get('owner') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const max_users = parseInt(formData.get('max_users') as string, 10) || 100
  const current_users = parseInt(formData.get('current_users') as string, 10) || 0
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('rooms').update({
    name, owner, description, category, max_users, current_users, image_url
  }).eq('id', id)

  if (error) {
    console.error('Error updating room:', error)
    return { error: 'Failed to update room: ' + error.message }
  }

  revalidatePath('/admin/rooms')
  revalidatePath('/rooms')
  revalidatePath('/')
  redirect('/admin/rooms')
}

export async function deleteRoom(id: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('rooms').delete().eq('id', id)

  if (error) {
    console.error('Error deleting room:', error)
    return { error: 'Failed to delete room' }
  }

  revalidatePath('/admin/rooms')
  revalidatePath('/rooms')
  revalidatePath('/')
  return { success: true }
}
