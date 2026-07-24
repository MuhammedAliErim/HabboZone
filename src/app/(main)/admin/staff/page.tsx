import { createClient } from '@/utils/supabase/server'
import StaffClient from './_components/StaffClient'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Ekip Yönetimi | Admin',
}

export default async function AdminStaffPage() {
  const supabase = await createClient()

  // Only Owner, Developer, Administrator can access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['Owner', 'Developer', 'Administrator'].includes(profile.role)) {
    redirect('/')
  }

  // Fetch current staff
  const { data: staffMembers } = await supabase
    .from('staff')
    .select(`
      id,
      position,
      order_index,
      user_id,
      profiles:user_id (
        id,
        username,
        habbo_username,
        avatar_url,
        role
      )
    `)
    .order('order_index', { ascending: true })

  // Fetch users who are not in staff to populate "add" dropdown
  const currentStaffUserIds = staffMembers?.map(s => s.user_id) || []
  
  let nonStaffQuery = supabase
    .from('profiles')
    .select('id, username, habbo_username')
    .order('username')

  if (currentStaffUserIds.length > 0) {
    // If there are staff members, exclude them
    nonStaffQuery = nonStaffQuery.not('id', 'in', `(${currentStaffUserIds.join(',')})`)
  }

  const { data: nonStaffUsers } = await nonStaffQuery

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Ekip Yönetimi</h1>
      
      <StaffClient 
        initialStaff={(staffMembers as any) || []} 
        availableUsers={nonStaffUsers || []} 
      />
    </div>
  )
}
