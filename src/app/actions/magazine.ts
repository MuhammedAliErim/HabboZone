'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Tip tanımlamaları
export interface Magazine {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  cover_image_url?: string | null;
  issue_number?: number;
  is_published: boolean;
  published_at: string | null;
  is_ai_generated: boolean;
  view_count: number;
  created_at: string;
}

export interface MagazinePage {
  id: string;
  magazine_id: string;
  page_number: number;
  layout_data: any;
  background_color: string;
  background_image: string | null;
}

// Dergi Oluşturma
export async function createMagazine(title: string, description: string = '') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Giriş yapmanız gerekiyor.");

  const { data, error } = await supabase
    .from('magazines')
    .insert({ 
      title, 
      description, 
      author_id: user.id,
      cover_image: '/placeholder.png',
      cover_image_url: '/placeholder.png',
      is_ai_generated: true,
      is_published: false
    })
    .select()
    .single();

  if (error) {
    console.error("createMagazine err", error);
    throw new Error(error.message);
  }
  
  revalidatePath('/admin/magazines');
  return data as Magazine;
}

// Dergi Güncelleme
export async function updateMagazine(id: string, updates: Partial<Magazine>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('magazines')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/magazines');
  revalidatePath(`/admin/magazines/${id}/edit`);
}

// Tüm Dergileri Getir
export async function getAdminMagazines() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Magazine[];
}

// Tek Bir Dergi ve Sayfalarını Getir
export async function getMagazineWithPages(id: string) {
  const supabase = await createClient();
  const { data: magazine, error: magErr } = await supabase
    .from('magazines')
    .select('*')
    .eq('id', id)
    .single();

  if (magErr) throw new Error(magErr.message);

  const { data: pages, error: pageErr } = await supabase
    .from('magazine_pages')
    .select('*')
    .eq('magazine_id', id)
    .order('page_number', { ascending: true });

  if (pageErr) throw new Error(pageErr.message);

  return { magazine: magazine as Magazine, pages: pages as MagazinePage[] };
}

// Sayfa Kaydet (veya Güncelle)
export async function saveMagazinePage(magazineId: string, pageNumber: number, layoutData: any, backgroundColor: string, backgroundImage?: string | null) {
  const supabase = await createClient();
  
  // Önce sayfa var mı diye kontrol et
  const { data: existingPage } = await supabase
    .from('magazine_pages')
    .select('id')
    .eq('magazine_id', magazineId)
    .eq('page_number', pageNumber)
    .single();

  if (existingPage) {
    // Güncelle
    const { error } = await supabase
      .from('magazine_pages')
      .update({ layout_data: layoutData, background_color: backgroundColor, background_image: backgroundImage })
      .eq('id', existingPage.id);
    if (error) throw new Error(error.message);
  } else {
    // Yeni Ekle
    const { error } = await supabase
      .from('magazine_pages')
      .insert({
        magazine_id: magazineId,
        page_number: pageNumber,
        layout_data: layoutData,
        background_color: backgroundColor,
        background_image: backgroundImage,
        image_url: backgroundImage || '/placeholder.png'
      });
    if (error) throw new Error(error.message);
  }
}

export async function deleteMagazine(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('magazines').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/magazines');
}
