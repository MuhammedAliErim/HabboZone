import GuideForm from '../_components/GuideForm'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Yeni Rehber Ekle - Admin Paneli',
}

export default function NewGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-yellow-400" size={32} /> YENİ HABBO REHBERİ YAYINLA
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Wired mekanizmaları, oda yapımı veya oyun taktikleri hakkında detaylı bir kılavuz hazırlayın.
          </p>
        </div>

        <Link 
          href="/admin/guides" 
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs uppercase transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Geri Dön
        </Link>
      </div>

      <div className="habbo-box bg-[#0a1224] border-2 border-white/10 rounded-xl p-8 shadow-2xl">
        <GuideForm />
      </div>
    </div>
  )
}
