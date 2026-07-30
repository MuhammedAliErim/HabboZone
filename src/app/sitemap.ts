import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://habbozone.vercel.app'

  const supabase = await createClient()

  const [newsResult, forumResult, wikiResult] = await Promise.all([
    supabase.from('news').select('slug, updated_at').eq('status', 'Published'),
    supabase.from('topics').select('slug, updated_at').limit(100),
    supabase.from('wiki_items').select('slug, updated_at'),
  ])

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/news`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/forum`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/magazines`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/guides`, priority: 0.7 },
    { url: `${baseUrl}/groups`, priority: 0.7 },
    { url: `${baseUrl}/rooms`, priority: 0.7 },
    { url: `${baseUrl}/market`, priority: 0.7 },
    { url: `${baseUrl}/wiki`, priority: 0.7 },
    { url: `${baseUrl}/events`, priority: 0.6 },
    { url: `${baseUrl}/badges`, priority: 0.6 },
    { url: `${baseUrl}/values`, priority: 0.6 },
    { url: `${baseUrl}/staff`, priority: 0.6 },
    { url: `${baseUrl}/gallery`, priority: 0.6 },
    { url: `${baseUrl}/tools`, priority: 0.6 },
    { url: `${baseUrl}/about`, priority: 0.4 },
    { url: `${baseUrl}/contact`, priority: 0.4 },
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
  ]

  const newsPages = (newsResult.data || []).map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: item.updated_at,
    priority: 0.7 as const,
  }))

  const forumPages = (forumResult.data || []).map((item) => ({
    url: `${baseUrl}/forum/topic/${item.slug}`,
    lastModified: item.updated_at,
    priority: 0.6 as const,
  }))

  const wikiPages = (wikiResult.data || []).map((item) => ({
    url: `${baseUrl}/wiki/item/${item.slug}`,
    lastModified: item.updated_at,
    priority: 0.5 as const,
  }))

  return [...staticPages, ...newsPages, ...forumPages, ...wikiPages]
}
