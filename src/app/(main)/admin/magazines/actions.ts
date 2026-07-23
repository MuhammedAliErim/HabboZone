'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMagazine(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const issue_number = parseInt(formData.get('issue_number') as string, 10)
  const cover_image_url = formData.get('cover_image_url') as string
  const pdf_url = formData.get('pdf_url') as string
  
  const publishedAtInput = formData.get('published_at') as string
  const published_at = publishedAtInput ? new Date(publishedAtInput).toISOString() : new Date().toISOString()
  const is_active = formData.get('is_active') === 'on'

  const { error } = await supabase.from('magazines').insert({
    title,
    issue_number,
    cover_image_url,
    pdf_url,
    published_at,
    is_active
  })

  if (error) {
    console.error('Error creating magazine:', error)
    throw new Error('Failed to create magazine: ' + error.message)
  }

  revalidatePath('/admin/magazines')
  revalidatePath('/magazines')
  revalidatePath('/')
  redirect('/admin/magazines')
}

export async function updateMagazine(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const issue_number = parseInt(formData.get('issue_number') as string, 10)
  const cover_image_url = formData.get('cover_image_url') as string
  const pdf_url = formData.get('pdf_url') as string
  
  const publishedAtInput = formData.get('published_at') as string
  const published_at = publishedAtInput ? new Date(publishedAtInput).toISOString() : new Date().toISOString()
  const is_active = formData.get('is_active') === 'on'

  const { error } = await supabase
    .from('magazines')
    .update({
      title,
      issue_number,
      cover_image_url,
      pdf_url,
      published_at,
      is_active
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating magazine:', error)
    throw new Error('Failed to update magazine: ' + error.message)
  }

  revalidatePath('/admin/magazines')
  revalidatePath('/magazines')
  revalidatePath('/')
  redirect('/admin/magazines')
}

export async function deleteMagazine(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('magazines').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting magazine:', error)
    throw new Error('Failed to delete magazine')
  }

  revalidatePath('/admin/magazines')
  revalidatePath('/magazines')
  revalidatePath('/')
}
