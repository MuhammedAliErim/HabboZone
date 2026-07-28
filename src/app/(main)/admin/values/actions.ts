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
    .maybeSingle()

  if (!profile || !['Owner', 'Developer', 'Administrator', 'Moderator'].includes(profile.role)) {
    return { supabase: null as any, error: 'Yetkisiz işlem' }
  }

  return { supabase, error: null as string | null }
}

export async function createCategory(formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  const { error } = await supabase.from('habbo_item_categories').insert({
    name, slug
  })

  if (error) {
    console.error('Error creating category:', error)
    return { error: 'Kategori eklenemedi' }
  }

  revalidatePath('/admin/values')
  return { success: true }
}

export async function createItem(formData: FormData) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const category_id = formData.get('category_id') as string
  const name = formData.get('name') as string
  const current_value = parseInt(formData.get('current_value') as string)
  const currency_type = formData.get('currency_type') as string
  const image_url = formData.get('image_url') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

  const { error } = await supabase.from('habbo_items').insert({
    category_id, name, slug, current_value, currency_type, image_url
  })

  if (error) {
    console.error('Error creating item:', error)
    return { error: 'Eşya eklenemedi' }
  }

  revalidatePath('/admin/values')
  revalidatePath('/values')
  return { success: true }
}
