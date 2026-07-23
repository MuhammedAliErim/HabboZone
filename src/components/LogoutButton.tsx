'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="ml-2 w-8 h-8 rounded bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
      title="Çıkış Yap"
    >
      <LogOut size={14} />
    </button>
  );
}
