import RoomForm from '../_components/RoomForm'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Yeni Oda Ekle - Admin Paneli',
}

export default function NewRoomPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={32} /> YENİ HABBO ODASI YAYINLA
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Topluluk için yeni bir buluşma, oyun veya resmi etkinlik odası ekleyin.
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
        <RoomForm />
      </div>
    </div>
  )
}
