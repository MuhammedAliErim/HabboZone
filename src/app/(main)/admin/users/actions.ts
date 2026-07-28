'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (!currentUserProfile || !['Owner', 'Developer', 'Administrator'].includes(currentUserProfile.role)) {
    return { error: 'Yetkisiz işlem' }
  }

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (targetProfile) {
    if (targetProfile.role === 'Owner' && currentUserProfile.role !== 'Owner') {
      return { error: 'Owner rolünü değiştiremezsiniz.' }
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating role:', error)
    return { error: 'Rol güncellenemedi' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
