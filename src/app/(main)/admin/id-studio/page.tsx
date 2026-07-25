import IdStudioClient from './IdStudioClient';
import { CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Habbo Kart & İmza Stüdyosu - Admin Paneli',
};

export default function AdminIdStudioPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> CANVA PRO STÜDYO v2.0
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> EKİP & KULLANICI ARACI
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <CreditCard className="text-purple-400 animate-pulse" size={32} /> HABBO KART & İMZA STÜDYOSU
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1 max-w-3xl">
            Yetkililer için resmi yaka kartları (ID Card), forumlarda kullanılmak üzere dinamik imza barları (Signature) ve etkinliklere özel VIP geçiş kartları tasarlayın.
          </p>
        </div>

        <div className="habbo-box bg-[#0a1224] border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black text-white uppercase tracking-wider">CANLI RENDER ERİŞİMİ</span>
        </div>
      </div>

      {/* İNTERAKTİF STÜDYO BİLEŞENİ */}
      <IdStudioClient />
    </div>
  );
}
