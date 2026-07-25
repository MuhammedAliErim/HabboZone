import RoomStudioClient from './RoomStudioClient';
import { Compass, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const metadata = {
  title: 'Labirent & Oda Harita Çözüm Stüdyosu - Admin Paneli',
};

export default function AdminRoomStudioPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> CANVA PRO STÜDYO v3.0
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> REHBER & WIRED HARİTASI
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Compass className="text-emerald-400 animate-spin-slow" size={32} /> HABBO ODA & LABİRENT ÇÖZÜM STÜDYOSU
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1 max-w-3xl">
            Oda yarışmaları, Wired labirentleri ve rozet görevleri için adım adım işaretli rehber haritaları tasarlayın. Oklar, numaralı adım rozetleri ve Wired ikonlarıyla haritanızı oluşturun.
          </p>
        </div>

        <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <Layers className="text-yellow-400 animate-bounce" size={20} />
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Harita Tipi</span>
            <span className="text-xs font-black text-white">İNTERAKTİF REHBER v1</span>
          </div>
        </div>
      </div>

      {/* İNTERAKTİF HARİTA STÜDYOSU BİLEŞENİ */}
      <RoomStudioClient />
    </div>
  );
}
