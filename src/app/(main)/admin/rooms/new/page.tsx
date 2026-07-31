import RoomForm from '../_components/RoomForm'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Yeni Oda Ekle - Admin Paneli',
}

export default function NewRoomPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={Sparkles}
        iconColor="text-[#facc15]"
        title="YENİ HABBO ODASI YAYINLA"
        subtitle="Topluluk için yeni bir buluşma, oyun veya resmi etkinlik odası ekleyin."
        actions={
          <Link
            href="/admin/rooms"
            className="px-4 py-2 rounded-[3px] bg-[#050a14] border border-[#1e293b] hover:bg-[#0a1325] text-gray-300 hover:text-white font-bold text-xs uppercase transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Geri Dön
          </Link>
        }
      />

      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] p-8 shadow-2xl">
        <RoomForm />
      </div>
    </div>
  )
}
