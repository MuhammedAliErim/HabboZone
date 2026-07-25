'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const MagazineReader = dynamic(() => import('./MagazineReader'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center text-white gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-300">3D Dergi Okuyucu Hazırlanıyor...</p>
    </div>
  )
});

export default function MagazineReaderWrapper(props: any) {
  return <MagazineReader {...props} />;
}
