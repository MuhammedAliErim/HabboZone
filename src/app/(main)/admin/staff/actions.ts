'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addStaff(userId: string, position: string, orderIndex: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUserProfile || !['Owner', 'Developer', 'Administrator'].includes(currentUserProfile.role)) {
    throw new Error('Yetkisiz işlem')
  }

  const { error } = await supabase
    .from('staff')
    .insert({
      user_id: userId,
      position: position,
      order_index: orderIndex
    })

  if (error) {
    console.error('Error adding staff:', error)
    throw new Error('Personel eklenirken hata oluştu: ' + error.message)
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
}

export async function updateStaff(id: string, position: string, orderIndex: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUserProfile || !['Owner', 'Developer', 'Administrator'].includes(currentUserProfile.role)) {
    throw new Error('Yetkisiz işlem')
  }

  const { error } = await supabase
    .from('staff')
    .update({
      position: position,
      order_index: orderIndex
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating staff:', error)
    throw new Error('Personel güncellenirken hata oluştu: ' + error.message)
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
}

export async function deleteStaff(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUserProfile || !['Owner', 'Developer', 'Administrator'].includes(currentUserProfile.role)) {
    throw new Error('Yetkisiz işlem')
  }

  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting staff:', error)
    throw new Error('Personel silinirken hata oluştu: ' + error.message)
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
}
