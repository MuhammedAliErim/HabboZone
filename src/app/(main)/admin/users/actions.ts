'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if current user is Owner or Developer or Admin (Role Hierarchy logic)
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUserProfile || !['Owner', 'Developer', 'Administrator'].includes(currentUserProfile.role)) {
    throw new Error('Yetkisiz işlem')
  }

  // Prevent modifying another Owner or Developer unless you are an Owner
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (targetProfile) {
    if (targetProfile.role === 'Owner' && currentUserProfile.role !== 'Owner') {
       throw new Error('Owner rolünü değiştiremezsiniz.')
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating role:', error)
    throw new Error('Rol güncellenemedi')
  }

  revalidatePath('/admin/users')
}
