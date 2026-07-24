'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function submitGalleryImage(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Giriş yapmalısınız.')
  }

  const file = formData.get('image') as File
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!file || !title) {
    throw new Error('Lütfen bir resim ve başlık girin.')
  }

  // Upload to Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    throw new Error('Resim yüklenirken hata oluştu.')
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath)

  // Insert to database
  const { error: dbError } = await supabase
    .from('gallery')
    .insert({
      title,
      description,
      image_url: publicUrl,
      author_id: user.id,
      is_approved: false
    })

  if (dbError) {
    console.error('DB Error:', dbError)
    throw new Error('Kayıt oluşturulurken hata oluştu.')
  }

  revalidatePath('/gallery')
}
