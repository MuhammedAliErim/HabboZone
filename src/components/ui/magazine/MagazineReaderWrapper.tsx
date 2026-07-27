'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const MagazineReader = dynamic(() => import('./MagazineReader'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] bg-[#0a1325] border border-[#1e293b] rounded-[2px] flex flex-col items-center justify-center text-white gap-4 p-8">
      <div className="w-10 h-10 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-wider text-gray-300">3D DERGİ OKUYUCU HAZIRLANIYOR...</p>
    </div>
  )
});

export default function MagazineReaderWrapper(props: any) {
  return <MagazineReader {...props} />;
}
