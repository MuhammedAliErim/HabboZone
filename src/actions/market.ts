'use server'

import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'

export const getMarketCategories = cache(async () => {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habbo_item_categories')
    .select('*')
    .order('name', { ascending: true })
    
  if (error) {
    console.error('Error fetching market categories:', error)
    return []
  }
  
  return data
})

export const getLatestItems = cache(async (limit = 10) => {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habbo_items')
    .select(`
      *,
      category:habbo_item_categories(name, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (error) {
    console.error('Error fetching latest market items:', error)
    return []
  }
  
  return data
})

export const getItemsByCategory = cache(async (categorySlug: string) => {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habbo_items')
    .select(`
      *,
      category:habbo_item_categories!inner(name, slug)
    `)
    .eq('category.slug', categorySlug)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error(`Error fetching market items for category ${categorySlug}:`, error)
    return []
  }
  
  return data
})

export const getItemDetails = cache(async (itemSlug: string) => {
  const supabase = await createClient()
  
  const { data: item, error: itemError } = await supabase
    .from('habbo_items')
    .select(`
      *,
      category:habbo_item_categories(name, slug)
    `)
    .eq('slug', itemSlug)
    .single()
    
  if (itemError) {
    console.error(`Error fetching market item ${itemSlug}:`, itemError)
    return null
  }
  
  const { data: history, error: historyError } = await supabase
    .from('habbo_item_values')
    .select('*')
    .eq('item_id', item.id)
    .order('created_at', { ascending: true })
    
  if (historyError) {
    console.error(`Error fetching history for market item ${itemSlug}:`, historyError)
  }
  
  return { item, history: history || [] }
})
