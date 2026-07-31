import StudioClient from './StudioClient'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminBadge from '@/components/admin/AdminBadge'
import AdminStat from '@/components/admin/AdminStat'
import { Sparkles, Layers, Wand2 } from 'lucide-react'

export const metadata = {
  title: 'Canva Görsel & Banner Stüdyosu - Admin Paneli',
  description: 'HabboZone için haber kapakları, rehber bannerları ve rozet grafikleri tasarlayın.',
}

export default function AdminStudioPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={Wand2}
        iconColor="text-pink-500"
        title="GÖRSEL & BANNER TASARIM STÜDYOSU"
        subtitle="Haberler, rehberler ve duyurular için profesyonel Habbo manşetleri, rozet ikonları ve sosyal medya grafikleri tasarlayın."
        badges={
          <AdminBadge color="pink" icon={Sparkles}>CANVA PRO STÜDYO v4.0</AdminBadge>
        }
        stats={
          <AdminStat
            label="KATMAN MOTORU"
            value="Canva-Habbo Engine"
            icon={Layers}
            iconColor="text-pink-400"
          />
        }
      />

      <StudioClient />
    </div>
  )
}
