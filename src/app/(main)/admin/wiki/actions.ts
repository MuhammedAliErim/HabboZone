'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface WikiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface WikiItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string;
  rarity_level: 'Common' | 'Rare' | 'Epic' | 'Legendary' | null;
  market_value: string | null;
  release_date: string | null;
  created_at: string;
  wiki_categories?: { name: string };
}

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
    return { supabase: null as any, error: 'Yetkisiz erişim' }
  }

  return { supabase, error: null as string | null }
}

export async function getAdminWikiCategories() {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { data: [], error: authError }

  const { data, error } = await supabase
    .from('wiki_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching wiki categories:', error)
    return { data: [], error: error.message }
  }

  return { data: data as WikiCategory[], error: null }
}

export async function getAdminWikiItems() {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { data: [], error: authError }

  const { data, error } = await supabase
    .from('wiki_items')
    .select('*, wiki_categories(name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wiki items:', error)
    return { data: [], error: error.message }
  }

  return { data: data as WikiItem[], error: null }
}

export async function addWikiCategory(data: Partial<WikiCategory>) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('wiki_categories').insert([{
    name: data.name,
    slug: data.slug,
    description: data.description,
    sort_order: data.sort_order || 0
  }])

  if (error) {
    console.error('Error adding wiki category:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/wiki/categories')
  revalidatePath('/wiki')
  return { success: true }
}

export async function updateWikiCategory(id: string, data: Partial<WikiCategory>) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase
    .from('wiki_categories')
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      sort_order: data.sort_order
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating wiki category:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/wiki/categories')
  revalidatePath('/wiki')
  return { success: true }
}

export async function deleteWikiCategory(id: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('wiki_categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting wiki category:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/wiki/categories')
  revalidatePath('/wiki')
  return { success: true }
}

export async function addWikiItem(data: Partial<WikiItem>) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('wiki_items').insert([{
    category_id: data.category_id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    image_url: data.image_url,
    rarity_level: data.rarity_level || 'Common',
    market_value: data.market_value,
    release_date: data.release_date
  }])

  if (error) {
    console.error('Error adding wiki item:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/wiki')
  revalidatePath('/wiki')
  return { success: true }
}

export async function updateWikiItem(id: string, data: Partial<WikiItem>) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase
    .from('wiki_items')
    .update({
      category_id: data.category_id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      image_url: data.image_url,
      rarity_level: data.rarity_level,
      market_value: data.market_value,
      release_date: data.release_date
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating wiki item:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/wiki')
  revalidatePath('/wiki')
  return { success: true }
}

export async function deleteWikiItem(id: string) {
  const { supabase, error: authError } = await checkAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('wiki_items').delete().eq('id', id)

  if (error) {
    console.error('Error deleting wiki item:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/wiki')
  revalidatePath('/wiki')
  return { success: true }
}
