import { createClient } from '@/utils/supabase/server'
import StaffClient from './_components/StaffClient'
import { redirect } from 'next/navigation'
import { Shield, Award, Users, Star } from 'lucide-react'

export const revalidate = 0;

export const metadata = {
  title: 'Ekip Kadro & Yönetim Merkezi - Admin Paneli',
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

  const staffCount = staffMembers?.length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Üst Başlık & İstatistik */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Shield className="text-yellow-400" size={32} /> EKİP & KADRO YÖNETİM MERKEZİ
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            HabboZone resmi ekip üyelerini, unvanlarını ve sayfada görüntülenme önceliklerini yönetin.
          </p>
        </div>

        <div className="habbo-box bg-[#0a1224] border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
          <Award className="text-yellow-400" size={24} />
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Topluluk Kadrosu</span>
            <span className="text-lg font-black text-white">{staffCount} Yetkili Üye</span>
          </div>
        </div>
      </div>
      
      <StaffClient 
        initialStaff={(staffMembers as any) || []} 
        availableUsers={nonStaffUsers || []} 
      />
    </div>
  )
}
