'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createGuide(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const content = formData.get('content') as string
  const read_time = formData.get('read_time') as string
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('guides').insert({
    title,
    category,
    content,
    read_time,
    image_url
  })

  if (error) {
    console.error('Error creating guide:', error)
    throw new Error('Failed to create guide: ' + error.message)
  }

  revalidatePath('/admin/guides')
  revalidatePath('/guides')
  revalidatePath('/')
  redirect('/admin/guides')
}

export async function updateGuide(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const content = formData.get('content') as string
  const read_time = formData.get('read_time') as string
  const image_url = formData.get('image_url') as string

  const { error } = await supabase
    .from('guides')
    .update({
      title,
      category,
      content,
      read_time,
      image_url
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating guide:', error)
    throw new Error('Failed to update guide: ' + error.message)
  }

  revalidatePath('/admin/guides')
  revalidatePath('/guides')
  revalidatePath('/')
  redirect('/admin/guides')
}

export async function deleteGuide(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('guides').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting guide:', error)
    throw new Error('Failed to delete guide')
  }

  revalidatePath('/admin/guides')
  revalidatePath('/guides')
  revalidatePath('/')
}
