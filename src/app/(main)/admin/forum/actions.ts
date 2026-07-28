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
    .single()

  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) {
    return { supabase: null as any, error: 'Unauthorized' }
  }

  return { supabase, error: null as string | null }
}

export async function createCategory(name: string, slug: string, description: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('categories').insert({
    name, slug, description, type: 'forum'
  })

  if (error) {
    console.error('Error creating category:', error)
    return { error: 'Kategori oluşturulurken hata oluştu.' }
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    return { error: 'Kategori silinirken hata oluştu. İçinde forumlar olabilir.' }
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
  return { success: true }
}

export async function createForum(
  categoryId: string, title: string, slug: string,
  description: string, icon: string, orderIndex: number
) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('forums').insert({
    category_id: categoryId, title, slug, description, icon, order_index: orderIndex
  })

  if (error) {
    console.error('Error creating forum:', error)
    return { error: 'Alt forum oluşturulurken hata oluştu.' }
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
  return { success: true }
}

export async function updateForum(
  id: string, title: string, description: string, icon: string, orderIndex: number
) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('forums').update({
    title, description, icon, order_index: orderIndex
  }).eq('id', id)

  if (error) {
    console.error('Error updating forum:', error)
    return { error: 'Alt forum güncellenirken hata oluştu.' }
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
  return { success: true }
}

export async function deleteForum(id: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('forums').delete().eq('id', id)

  if (error) {
    console.error('Error deleting forum:', error)
    return { error: 'Alt forum silinirken hata oluştu. İçinde konular olabilir.' }
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
  return { success: true }
}
