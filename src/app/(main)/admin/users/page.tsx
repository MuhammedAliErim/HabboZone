import { createClient } from '@/utils/supabase/server';
import UsersClient from './UsersClient';

export const revalidate = 0; // Her zaman canlı kullanıcı verisi

export const metadata = {
  title: 'Kullanıcı & Rol Yönetimi - Admin Paneli',
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('id, username, habbo_username, avatar_url, motto, role, created_at')
    .order('created_at', { ascending: false });

  return <UsersClient initialUsers={users || []} />;
}
