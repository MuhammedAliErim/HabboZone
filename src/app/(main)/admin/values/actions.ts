'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  const { error } = await supabase.from('habbo_item_categories').insert({
    name,
    slug
  })

  if (error) {
    console.error('Error creating category:', error)
    throw new Error('Kategori eklenemedi')
  }

  revalidatePath('/admin/values')
}

export async function createItem(formData: FormData) {
  const supabase = await createClient()

  const category_id = formData.get('category_id') as string
  const name = formData.get('name') as string
  const current_value = parseInt(formData.get('current_value') as string)
  const currency_type = formData.get('currency_type') as string
  const image_url = formData.get('image_url') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

  const { error } = await supabase.from('habbo_items').insert({
    category_id,
    name,
    slug,
    current_value,
    currency_type,
    image_url
  })

  if (error) {
    console.error('Error creating item:', error)
    throw new Error('Eşya eklenemedi')
  }

  revalidatePath('/admin/values')
  revalidatePath('/values')
}
