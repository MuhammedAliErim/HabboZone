import StudioClient from './StudioClient'
import { Sparkles, Layers, Wand2 } from 'lucide-react'

export const metadata = {
  title: 'Canva Görsel & Banner Stüdyosu - Admin Paneli',
  description: 'HabboZone için haber kapakları, rehber bannerları ve rozet grafikleri tasarlayın.',
}

export default function AdminStudioPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> CANVA PRO STÜDYO v4.0
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Wand2 className="text-pink-500 animate-pulse" size={32} /> GÖRSEL & BANNER TASARIM STÜDYOSU
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Haberler, rehberler ve duyurular için profesyonel Habbo manşetleri, rozet ikonları ve sosyal medya grafikleri tasarlayın.
          </p>
        </div>

        <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
          <Layers className="text-pink-400" size={20} />
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Katman Motoru</span>
            <span className="text-base font-black text-white">Canva-Habbo Engine</span>
          </div>
        </div>
      </div>

      {/* Ana Stüdyo Aracı */}
      <StudioClient />
    </div>
  )
}
