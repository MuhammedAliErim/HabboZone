import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import OutfitStudioClient from './OutfitStudioClient';

export const metadata = {
  title: 'Kombin & Lookbook Moda Stüdyosu - HabboZone Admin',
  description: 'Habbo modası, avatar kombinleri ve günün tarzı kartları tasarlayın.',
};

export default async function OutfitStudioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const allowedRoles = ['Owner', 'Developer', 'Administrator', 'Moderator', 'Admin', 'Editor', 'Yazar', 'Muhabir', 'Staff', 'Yetkili', 'Yönetici'];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/');
  }

  return <OutfitStudioClient />;
}
