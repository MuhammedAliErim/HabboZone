'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Tip tanımlamaları — gerçek veritabanı şemasıyla eşleşir
export interface Magazine {
  id: string;
  title: string;
  issue_number: number | null;
  cover_image_url: string;
  pdf_url: string | null;
  read_link: string | null;
  published_at: string | null;
  created_at: string;
  is_active?: boolean;
  // UI tarafı için opsiyonel alanlar (tabloda olmayabilir)
  description?: string | null;
  cover_image?: string | null;
  is_ai_generated?: boolean;
  is_published?: boolean;
  view_count?: number;
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

  // Veritabanı şemasına tam uyumlu insert: 
  // magazines tablosu: id, title, issue_number, cover_image_url, pdf_url, read_link, published_at, created_at
  const { data, error } = await supabase
    .from('magazines')
    .insert({ 
      title, 
      cover_image_url: '/placeholder.png',
      issue_number: Math.floor(Math.random() * 8999) + 1000,
      published_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("createMagazine err:", JSON.stringify(error));
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

// Tüm Dergileri Getir — hata fırlatmaz, boş dizi döndürür
export async function getAdminMagazines(): Promise<Magazine[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("getAdminMagazines err:", JSON.stringify(error));
      return [];
    }
    return (data || []) as Magazine[];
  } catch (e) {
    console.error("getAdminMagazines exception:", e);
    return [];
  }
}

// Yayınlanmış dergileri getir (herkese açık sayfa için)
export async function getPublishedMagazines(): Promise<Magazine[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error("getPublishedMagazines err:", JSON.stringify(error));
      return [];
    }
    return (data || []) as Magazine[];
  } catch (e) {
    console.error("getPublishedMagazines exception:", e);
    return [];
  }
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

  // magazine_pages tablosu yoksa boş dizi döndür
  if (pageErr) {
    console.error("getMagazineWithPages pages err:", JSON.stringify(pageErr));
    return { magazine: magazine as Magazine, pages: [] as MagazinePage[] };
  }

  return { magazine: magazine as Magazine, pages: (pages || []) as MagazinePage[] };
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
        background_image: backgroundImage
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
