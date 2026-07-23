import { createClient } from '@/utils/supabase/server';
import { BookOpen, ExternalLink, Download } from 'lucide-react';

export const revalidate = 60; // Cache for 60 seconds

export default async function MagazinesPage() {
  const supabase = await createClient();

  const { data: magazines } = await supabase
    .from('magazines')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 py-6">
      
      {/* Hero Section */}
      <div className="habbo-box bg-white overflow-hidden relative text-center">
        <div className="habbo-box-header dark">
          Dergiler & Bültenler
        </div>
        
        <div className="p-8 md:p-12 bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <BookOpen size={150} className="text-gray-800" />
            </div>
            
            <div className="relative z-10 max-w-2xl space-y-4">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-800 drop-shadow-sm">
                    Yayın Arşivi
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                    HabboZone ekibi tarafından hazırlanan özel dergiler, aylık bültenler ve daha fazlası.
                </p>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="habbo-box bg-white">
        <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {magazines?.map((magazine) => (
                <div key={magazine.id} className="bg-white border border-gray-200 rounded p-4 flex flex-col text-center hover:border-gray-400 hover:bg-gray-100 transition-colors shadow-sm group">
                <div className="h-64 w-full flex items-center justify-center mb-4 bg-gray-100 rounded border border-gray-200 shadow-inner group-hover:bg-white transition-colors overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                    src={magazine.cover_image_url} 
                    alt={magazine.title} 
                    className="w-full h-full object-cover filter drop-shadow-sm group-hover:scale-105 transition-transform" 
                    />
                    {magazine.issue_number && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white font-black px-2 py-0.5 rounded text-[10px] shadow-sm uppercase tracking-widest">
                        Sayı #{magazine.issue_number}
                    </div>
                    )}
                </div>
                
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {new Date(magazine.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </div>
                <h3 className="font-bold text-sm mb-4 text-gray-800 group-hover:text-black transition-colors">{magazine.title}</h3>
                
                <div className="mt-auto grid grid-cols-2 gap-2">
                    {magazine.read_link && (
                    <a 
                        href={magazine.read_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="habbo-button blue text-xs py-1.5 flex items-center justify-center gap-1 col-span-1"
                    >
                        <ExternalLink size={12} /> Oku
                    </a>
                    )}
                    {magazine.pdf_url && (
                    <a 
                        href={magazine.pdf_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`habbo-button green text-xs py-1.5 flex items-center justify-center gap-1 ${!magazine.read_link ? 'col-span-2' : 'col-span-1'}`}
                    >
                        <Download size={12} /> PDF
                    </a>
                    )}
                    {!magazine.read_link && !magazine.pdf_url && (
                    <div className="col-span-2 flex justify-center items-center py-1.5 text-gray-400 text-xs font-bold bg-gray-100 rounded border border-gray-200">
                        Link Yok
                    </div>
                    )}
                </div>
                </div>
            ))}
            </div>

            {magazines?.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-2" />
                <h3 className="text-sm font-bold text-gray-700 mb-1">Dergi Bulunamadı</h3>
                <p className="text-xs text-gray-500">Henüz sisteme eklenmiş bir dergi/bülten yok.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
}
