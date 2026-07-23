'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createNews(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const image_url = formData.get('image_url') as string
  const excerpt = formData.get('excerpt') as string

  const { error } = await supabase.from('news').insert({
    title,
    content,
    category,
    image_url,
    excerpt,
    author_id: user.id,
    published: true // auto publish for now
  })

  if (error) {
    console.error('Error creating news:', error)
    throw new Error('Failed to create news')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
  redirect('/admin/news')
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const image_url = formData.get('image_url') as string
  const excerpt = formData.get('excerpt') as string

  const { error } = await supabase
    .from('news')
    .update({
      title,
      content,
      category,
      image_url,
      excerpt
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating news:', error)
    throw new Error('Failed to update news')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
  redirect('/admin/news')
}

export async function deleteNews(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('news').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting news:', error)
    throw new Error('Failed to delete news')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
}
