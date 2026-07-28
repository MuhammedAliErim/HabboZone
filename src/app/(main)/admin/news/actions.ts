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

  if (!profile || !['Owner', 'Developer', 'Administrator', 'Moderator', 'Journalist', 'Editor'].includes(profile.role)) {
    return { supabase: null as any, error: 'Yetkisiz işlem' }
  }

  return { supabase, error: null as string | null }
}

export async function createNews(formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { data: { user } } = await supabase.auth.getUser()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category_id = formData.get('category') as string
  const thumbnail_url = formData.get('image_url') as string
  const summary = formData.get('excerpt') as string
  const status = formData.get('status') as string || 'Published'
  const publishedAtInput = formData.get('published_at') as string
  const published_at = publishedAtInput ? new Date(publishedAtInput).toISOString() : new Date().toISOString()

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { error } = await supabase.from('news').insert({
    title, content, category_id: category_id || null, thumbnail_url: thumbnail_url || null,
    summary: summary || null, author_id: user!.id, slug, status, published_at
  })

  if (error) {
    console.error('Error creating news:', error)
    return { error: 'Failed to create news' }
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
  redirect('/admin/news')
}

export async function updateNews(id: string, formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category_id = formData.get('category') as string
  const thumbnail_url = formData.get('image_url') as string
  const summary = formData.get('excerpt') as string
  const status = formData.get('status') as string || 'Published'
  const publishedAtInput = formData.get('published_at') as string
  const published_at = publishedAtInput ? new Date(publishedAtInput).toISOString() : new Date().toISOString()

  const { error } = await supabase.from('news').update({
    title, content, category_id: category_id || null, thumbnail_url: thumbnail_url || null,
    summary: summary || null, status, published_at
  }).eq('id', id)

  if (error) {
    console.error('Error updating news:', error)
    return { error: 'Failed to update news' }
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
  redirect('/admin/news')
}

export async function deleteNews(id: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('news').delete().eq('id', id)

  if (error) {
    console.error('Error deleting news:', error)
    return { error: 'Failed to delete news' }
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
  return { success: true }
}
