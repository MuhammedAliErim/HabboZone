'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Categories (type = 'forum')
export async function createCategory(name: string, slug: string, description: string) {
  const supabase = await createClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) throw new Error('Unauthorized')

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description,
    type: 'forum'
  })

  if (error) {
    console.error('Error creating category:', error)
    throw new Error('Kategori oluşturulurken hata oluştu.')
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) throw new Error('Unauthorized')

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    throw new Error('Kategori silinirken hata oluştu. İçinde forumlar olabilir.')
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
}

// Forums
export async function createForum(
  categoryId: string, 
  title: string, 
  slug: string, 
  description: string, 
  icon: string, 
  orderIndex: number
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) throw new Error('Unauthorized')

  const { error } = await supabase.from('forums').insert({
    category_id: categoryId,
    title,
    slug,
    description,
    icon,
    order_index: orderIndex
  })

  if (error) {
    console.error('Error creating forum:', error)
    throw new Error('Alt forum oluşturulurken hata oluştu.')
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
}

export async function updateForum(
  id: string, 
  title: string, 
  description: string, 
  icon: string, 
  orderIndex: number
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) throw new Error('Unauthorized')

  const { error } = await supabase.from('forums').update({
    title,
    description,
    icon,
    order_index: orderIndex
  }).eq('id', id)

  if (error) {
    console.error('Error updating forum:', error)
    throw new Error('Alt forum güncellenirken hata oluştu.')
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
}

export async function deleteForum(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) throw new Error('Unauthorized')

  const { error } = await supabase.from('forums').delete().eq('id', id)

  if (error) {
    console.error('Error deleting forum:', error)
    throw new Error('Alt forum silinirken hata oluştu. İçinde konular olabilir.')
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
}
