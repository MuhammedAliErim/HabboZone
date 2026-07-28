'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase: null as any, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) {
    return { supabase: null as any, error: 'Yetkisiz işlem' }
  }

  return { supabase, error: null as string | null }
}

export async function addStaff(userId: string, position: string, orderIndex: number) {
  const { supabase, error: authError } = await checkAuth()
  if (authError) return { error: authError }

  const { error } = await supabase.from('staff').insert({
    user_id: userId,
    position,
    order_index: orderIndex
  })

  if (error) {
    console.error('Error adding staff:', error)
    return { error: 'Personel eklenirken hata oluştu: ' + error.message }
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
  return { success: true }
}

export async function updateStaff(id: string, position: string, orderIndex: number) {
  const { supabase, error: authError } = await checkAuth()
  if (authError) return { error: authError }

  const { error } = await supabase.from('staff').update({
    position,
    order_index: orderIndex
  }).eq('id', id)

  if (error) {
    console.error('Error updating staff:', error)
    return { error: 'Personel güncellenirken hata oluştu: ' + error.message }
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
  return { success: true }
}

export async function deleteStaff(id: string) {
  const { supabase, error: authError } = await checkAuth()
  if (authError) return { error: authError }

  const { error } = await supabase.from('staff').delete().eq('id', id)

  if (error) {
    console.error('Error deleting staff:', error)
    return { error: 'Personel silinirken hata oluştu: ' + error.message }
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
  return { success: true }
}
