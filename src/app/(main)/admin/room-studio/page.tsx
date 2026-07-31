import RoomStudioClient from './RoomStudioClient';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminStat from '@/components/admin/AdminStat';
import { Compass, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const metadata = {
  title: 'Labirent & Oda Harita Çözüm Stüdyosu - Admin Paneli',
};

export default function AdminRoomStudioPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={Compass}
        iconColor="text-emerald-400"
        title="HABBO ODA & LABİRENT ÇÖZÜM STÜDYOSU"
        subtitle="Oda yarışmaları, Wired labirentleri ve rozet görevleri için adım adım işaretli rehber haritaları tasarlayın. Oklar, numaralı adım rozetleri ve Wired ikonlarıyla haritanızı oluşturun."
        badges={
          <>
            <AdminBadge color="green" icon={Sparkles}>CANVA PRO STÜDYO v3.0</AdminBadge>
            <AdminBadge color="yellow" icon={CheckCircle2}>REHBER & WIRED HARİTASI</AdminBadge>
          </>
        }
        stats={
          <AdminStat
            label="HARİTA TİPİ"
            value="İNTERAKTİF REHBER v1"
            icon={Layers}
            iconColor="text-[#facc15]"
          />
        }
      />

      <RoomStudioClient />
    </div>
  );
}
