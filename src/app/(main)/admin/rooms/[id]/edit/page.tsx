import RoomForm from '../../_components/RoomForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditRoomPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!room) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Oda Düzenle: {room.name}</h1>
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <RoomForm initialData={room} />
      </div>
    </div>
  )
}
