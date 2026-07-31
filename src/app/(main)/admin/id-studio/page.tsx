import IdStudioClient from './IdStudioClient';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminStat from '@/components/admin/AdminStat';
import { CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Habbo Kart & İmza Stüdyosu - Admin Paneli',
};

export default function AdminIdStudioPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader
        icon={CreditCard}
        iconColor="text-purple-400"
        title="HABBO KART & İMZA STÜDYOSU"
        subtitle="Yetkililer için resmi yaka kartları (ID Card), forumlarda kullanılmak üzere dinamik imza barları (Signature) ve etkinliklere özel VIP geçiş kartları tasarlayın."
        badges={
          <>
            <AdminBadge color="purple" icon={Sparkles}>CANVA PRO STÜDYO v2.0</AdminBadge>
            <AdminBadge color="yellow" icon={CheckCircle2}>EKİP & KULLANICI ARACI</AdminBadge>
          </>
        }
        stats={
          <AdminStat
            label="CANLI RENDER ERİŞİMİ"
            value={<span className="text-emerald-400">AKTİF</span>}
          />
        }
      />

      <IdStudioClient />
    </div>
  );
}
