'use server';

import { createClient } from '@/utils/supabase/server';

export interface SearchResult {
  id: string;
  type: 'news' | 'magazine' | 'event' | 'badge' | 'profile' | 'topic' | 'guide' | 'market' | 'wiki';
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export async function globalSearch(query: string, limitPerType = 3): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();
  const searchPattern = `%${query}%`;
  const results: SearchResult[] = [];

  // 1. Search News
  const { data: news } = await supabase
    .from('news')
    .select('id, title, summary, slug, thumbnail_url')
    .ilike('title', searchPattern)
    .eq('status', 'Published')
    .limit(limitPerType);

  if (news) {
    results.push(...news.map(n => ({
      id: n.id,
      type: 'news' as const,
      title: n.title,
      description: n.summary,
      url: `/news/${n.slug}`,
      imageUrl: n.thumbnail_url
    })));
  }

  // 2. Search Badges
  const { data: badges } = await supabase
    .from('badges')
    .select('id, name, description, code, image_url')
    .or(`name.ilike.${searchPattern},code.ilike.${searchPattern}`)
    .limit(limitPerType);

  if (badges) {
    results.push(...badges.map(b => ({
      id: b.id,
      type: 'badge' as const,
      title: b.name,
      description: b.description || b.code,
      url: `/badges`, // Currently badges might not have individual pages, point to main badges page
      imageUrl: b.image_url
    })));
  }

  // 3. Search Profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, avatar_url')
    .or(`username.ilike.${searchPattern},habbo_username.ilike.${searchPattern}`)
    .limit(limitPerType);

  if (profiles) {
    results.push(...profiles.map(p => ({
      id: p.id,
      type: 'profile' as const,
      title: p.username,
      description: p.habbo_username ? `Habbo: ${p.habbo_username}` : '',
      url: `/profile/${p.username}`,
      imageUrl: p.avatar_url || `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${p.habbo_username || p.username}&direction=2&head_direction=2&gesture=sml&size=m`
    })));
  }

  // 4. Search Events
  const { data: events } = await supabase
    .from('events')
    .select('id, title, description, image_url')
    .ilike('title', searchPattern)
    .eq('is_active', true)
    .limit(limitPerType);

  if (events) {
    results.push(...events.map(e => ({
      id: e.id,
      type: 'event' as const,
      title: e.title,
      description: e.description,
      url: `/events`, // Point to events page
      imageUrl: e.image_url
    })));
  }

  // 5. Search Guides
  const { data: guides } = await supabase
    .from('guides')
    .select('id, title, summary, slug, image_url')
    .ilike('title', searchPattern)
    .eq('status', 'Published')
    .limit(limitPerType);

  if (guides) {
    results.push(...guides.map(g => ({
      id: g.id,
      type: 'guide' as const,
      title: g.title,
      description: g.summary,
      url: `/guides/${g.slug}`,
      imageUrl: g.image_url
    })));
  }

  // 6. Search Market Items
  const { data: marketItems } = await supabase
    .from('market_items')
    .select('id, name, description, slug, image_url')
    .ilike('name', searchPattern)
    .limit(limitPerType);

  if (marketItems) {
    results.push(...marketItems.map(m => ({
      id: m.id,
      type: 'market' as const,
      title: m.name,
      description: m.description,
      url: `/market/item/${m.slug}`,
      imageUrl: m.image_url
    })));
  }

  // 7. Search Wiki Items
  const { data: wikiItems } = await supabase
    .from('wiki_items')
    .select('id, name, description, slug, image_url')
    .ilike('name', searchPattern)
    .limit(limitPerType);

  if (wikiItems) {
    results.push(...wikiItems.map(w => ({
      id: w.id,
      type: 'wiki' as const,
      title: w.name,
      description: w.description,
      url: `/wiki/item/${w.slug}`,
      imageUrl: w.image_url
    })));
  }

  return results;
}
