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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <BookOpen size={200} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)]" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Dergiler & Bültenler
          </h1>
          <p className="text-lg text-white/70 font-medium">
            HabboZone ekibi tarafından hazırlanan özel dergiler, aylık bültenler ve daha fazlası.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {magazines?.map((magazine) => (
          <div key={magazine.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all flex flex-col">
            <div className="aspect-[3/4] relative overflow-hidden bg-black/40 border-b border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={magazine.cover_image_url} 
                alt={magazine.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              {magazine.issue_number && (
                <div className="absolute top-4 right-4 bg-primary text-white font-black px-3 py-1 rounded-lg text-sm shadow-xl">
                  Sayı #{magazine.issue_number}
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                {new Date(magazine.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </div>
              <h3 className="font-bold text-lg mb-4 leading-tight">{magazine.title}</h3>
              
              <div className="mt-auto grid grid-cols-2 gap-2">
                {magazine.read_link && (
                  <a 
                    href={magazine.read_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg text-sm transition-colors col-span-1 border border-white/10"
                  >
                    <ExternalLink size={16} /> Oku
                  </a>
                )}
                {magazine.pdf_url && (
                  <a 
                    href={magazine.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/40 text-primary font-bold py-2 rounded-lg text-sm transition-colors border border-primary/20 ${!magazine.read_link ? 'col-span-2' : 'col-span-1'}`}
                  >
                    <Download size={16} /> PDF
                  </a>
                )}
                {!magazine.read_link && !magazine.pdf_url && (
                  <div className="col-span-2 flex justify-center items-center py-2 text-white/30 text-sm font-bold bg-white/5 rounded-lg border border-white/5">
                    Link Yok
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {magazines?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <BookOpen size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Dergi Bulunamadı</h3>
          <p className="text-white/50">Henüz sisteme eklenmiş bir dergi/bülten yok.</p>
        </div>
      )}

    </div>
  );
}

