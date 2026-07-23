import { Shield, Users, Heart, Star, Target } from "lucide-react";

export const metadata = {
  title: "Hakkımızda | HabboZone",
  description: "HabboZone hakkında bilgiler, misyonumuz ve ekibimiz.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-in fade-in duration-500 w-full space-y-8">
      
      <div className="habbo-box overflow-hidden relative">
        <div className="h-[200px] bg-[#050a14] border-b-2 border-black relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://images.habbo.com/c_images/reception/reception_backdrop_4.png")', backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1e293b] rounded-full border-2 border-[#facc15] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                <Shield size={32} className="text-[#facc15]" />
            </div>
            <h1 className="text-4xl font-black text-white drop-shadow-[0_2px_0_#000] tracking-wider uppercase">Biz Kimiz?</h1>
            <p className="text-[#facc15] font-bold tracking-widest text-[12px] uppercase mt-2">HabboZone: Habbo Türkiye'nin Kalbi</p>
          </div>
        </div>

        <div className="p-8 md:p-12 bg-[#0f172a] text-center space-y-6">
          <p className="text-[15px] leading-relaxed text-gray-300 font-medium max-w-2xl mx-auto">
            HabboZone, yıllardır süregelen Habbo tutkusunu bir adım öteye taşımak için kurulmuş bağımsız bir fan sitesidir. Amacımız sadece haber vermek değil, aynı zamanda Habbo topluluğunu güvenli, eğlenceli ve interaktif bir platformda bir araya getirmektir.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#1e293b]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center border border-black text-[#38bdf8]"><Users size={24} /></div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Topluluk</h3>
              <p className="text-[12px] text-gray-400">Aktif, sıcakkanlı ve eğlenceli bir forum ortamı.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center border border-black text-[#facc15]"><Star size={24} /></div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Güncel İçerik</h3>
              <p className="text-[12px] text-gray-400">Habbo'daki en son yenilikler anında burada.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center border border-black text-[#ef4444]"><Heart size={24} /></div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Güvenlik</h3>
              <p className="text-[12px] text-gray-400">Habbo Way kurallarına sıkı sıkıya bağlılık.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="habbo-box p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Target size={20} className="text-[#a855f7]" />
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Misyonumuz</h2>
            </div>
            <p className="text-[13px] text-gray-300 leading-relaxed bg-[#050a14] p-4 rounded border border-[#1e293b]">
                Türkiye'deki tüm Habbo oyuncuları için vazgeçilmez bir rehber ve haber kaynağı olmak. Sadece bilgi sunmakla kalmayıp, düzenlediğimiz etkinlikler, turnuvalar ve ödüllü yarışmalarla oteldeki deneyiminize değer katmayı amaçlıyoruz.
            </p>
        </div>

        <div className="habbo-box p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Shield size={20} className="text-[#22c55e]" />
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Yasal Uyarı</h2>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-bold">
                Bu HabboZone, Sulake Oy veya İştirakleri tarafından doğrulanmamış, onaylanmamış ve desteklenmemiştir ve bunlar ile bağlı değildir. Bu HabboZone, Habbo Fan Sitesi Poliçesi altında izin verilen ticaret markalarını ve diğer Habbo fikrî mülkiyetlerini kullanabilir.
            </p>
        </div>

      </div>

    </div>
  );
}
