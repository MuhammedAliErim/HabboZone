'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const MagazineEditor = dynamic(() => import('./MagazineEditor'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center text-white gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-300">Gelişmiş AI Dergi Editörü Yükleniyor...</p>
    </div>
  )
});

export default function MagazineEditorWrapper(props: any) {
  return <MagazineEditor {...props} />;
}
