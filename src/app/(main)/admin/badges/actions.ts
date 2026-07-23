'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBadge(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const how_to_get = formData.get('how_to_get') as string
  const image_file = formData.get('image_file') as File

  if (!name || !image_file || image_file.size === 0) {
    return { error: 'Rozet adı ve görseli zorunludur.' }
  }

  // Upload image to Supabase Storage
  const fileExt = image_file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('badges')
    .upload(fileName, image_file)

  if (uploadError) {
    console.error('Badge upload error:', uploadError)
    return { error: 'Görsel yüklenirken bir hata oluştu.' }
  }

  const { data: publicUrlData } = supabase.storage
    .from('badges')
    .getPublicUrl(fileName)

  const image_url = publicUrlData.publicUrl

  // Insert into database
  const { error } = await supabase
    .from('badges')
    .insert({
      name,
      description,
      how_to_get,
      image_url
    })

  if (error) {
    console.error('Add badge error:', error)
    return { error: 'Rozet eklenirken bir hata oluştu.' }
  }

  revalidatePath('/admin/badges')
  revalidatePath('/')
  return { success: true }
}

export async function deleteBadge(id: string) {
  const supabase = await createClient()

  // We could also delete the file from storage if we had the filename, 
  // but for simplicity we'll just delete the database record.
  const { error } = await supabase
    .from('badges')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete badge error:', error)
    return { error: 'Rozet silinirken bir hata oluştu.' }
  }

  revalidatePath('/admin/badges')
  revalidatePath('/')
  return { success: true }
}
