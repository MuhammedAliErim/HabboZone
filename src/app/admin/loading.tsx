import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#facc15] animate-spin" />
        <p className="text-gray-400 text-sm font-bold">Admin paneli yükleniyor...</p>
      </div>
    </div>
  );
}
