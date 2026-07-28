'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logErrorClient } from '@/lib/error-logger';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logErrorClient('admin_error_boundary', error.message, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="habbo-box p-8 max-w-md text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-white font-black text-xl mb-2">Admin Panelinde Bir Hata Oluştu</h2>
        <p className="text-gray-400 text-sm mb-6">{error.message || 'Beklenmeyen bir hata ile karşılaşıldı.'}</p>
        <button onClick={reset} className="habbo-button inline-flex items-center gap-2 px-6 py-2.5">
          <RefreshCw size={16} />
          TEKRAR DENE
        </button>
      </div>
    </div>
  );
}
