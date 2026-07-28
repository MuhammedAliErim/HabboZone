import RoomForm from '../../_components/RoomForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Oda Düzenle - Admin Paneli',
}

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!room) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Edit className="text-blue-400" size={32} /> ODA AYARLARINI DÜZENLE
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            <strong className="text-yellow-400">{room.name}</strong> odasının bilgilerini, kapasitesini ve görselini güncelleyin.
          </p>
        </div>

        <Link 
          href="/admin/rooms" 
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs uppercase transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Geri Dön
        </Link>
      </div>

      <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-xl p-8 shadow-2xl">
        <RoomForm initialData={room} />
      </div>
    </div>
  )
}
