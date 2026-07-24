'use server'

import { createClient } from '@/utils/supabase/server'

// Get all wiki categories
export async function getWikiCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('wiki_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching wiki categories:', error)
    return []
  }

  return data
}

// Get recent wiki items (for homepage)
export async function getRecentWikiItems(limit = 8) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('wiki_items')
    .select('*, wiki_categories(name, slug)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent wiki items:', error)
    return []
  }

  return data
}

// Get items by category slug
export async function getWikiItemsByCategory(categorySlug: string) {
  const supabase = await createClient()

  // First get the category id
  const { data: categoryData, error: categoryError } = await supabase
    .from('wiki_categories')
    .select('id, name, description')
    .eq('slug', categorySlug)
    .single()

  if (categoryError || !categoryData) {
    console.error('Category not found:', categoryError)
    return { items: [], categoryName: '', description: '' }
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('wiki_items')
    .select('*, wiki_categories(name, slug)')
    .eq('category_id', categoryData.id)
    .order('created_at', { ascending: false })

  if (itemsError) {
    console.error('Error fetching items by category:', itemsError)
    return { items: [], categoryName: categoryData.name, description: categoryData.description }
  }

  return { 
    items: itemsData, 
    categoryName: categoryData.name, 
    description: categoryData.description 
  }
}

// Get single item details by slug
export async function getWikiItemBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('wiki_items')
    .select('*, wiki_categories(name, slug)')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching wiki item:', error)
    return null
  }

  return data
}
