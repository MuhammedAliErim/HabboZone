import { Mail, MessageSquare, AlertCircle } from "lucide-react";

export const metadata = {
  title: "İletişim | HabboZone",
  description: "HabboZone ekibiyle iletişime geçin.",
};

export default function ContactPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-in fade-in duration-500 w-full space-y-6">
      
      <div className="flex items-center gap-3 bg-[#1e293b] border-2 border-black p-4 rounded-[4px] shadow-[0_4px_0_#000]">
        <Mail size={24} className="text-[#38bdf8]" />
        <h1 className="text-xl font-black text-white tracking-widest uppercase">İletişim</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="habbo-box p-8 bg-[#0f172a]">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 border-b border-[#1e293b] pb-2">Bize Ulaşın</h2>
            <p className="text-[13px] text-gray-300 mb-6 leading-relaxed">
                HabboZone ile ilgili her türlü öneri, şikayet veya iş birliği talebiniz için formu doldurabilirsiniz. Ekibimiz size en kısa sürede dönüş yapacaktır.
            </p>
            
            <form className="space-y-4">
                <div>
                    <label className="block text-[11px] font-black mb-1.5 text-gray-400 uppercase tracking-widest">Adınız</label>
                    <input type="text" className="w-full bg-[#1e293b] text-white border-2 border-black rounded-[4px] p-2.5 focus:outline-none focus:border-[#facc15] text-[13px]" placeholder="Habbo isminiz veya adınız" />
                </div>
                <div>
                    <label className="block text-[11px] font-black mb-1.5 text-gray-400 uppercase tracking-widest">E-Posta</label>
                    <input type="email" className="w-full bg-[#1e293b] text-white border-2 border-black rounded-[4px] p-2.5 focus:outline-none focus:border-[#facc15] text-[13px]" placeholder="Size ulaşabileceğimiz bir adres" />
                </div>
                <div>
                    <label className="block text-[11px] font-black mb-1.5 text-gray-400 uppercase tracking-widest">Mesajınız</label>
                    <textarea rows={5} className="w-full bg-[#1e293b] text-white border-2 border-black rounded-[4px] p-2.5 focus:outline-none focus:border-[#facc15] text-[13px]" placeholder="Mesajınızı buraya yazın..."></textarea>
                </div>
                <button type="button" className="habbo-button success px-6 py-3 mt-2 flex items-center gap-2">
                    <MessageSquare size={16} /> GÖNDER
                </button>
            </form>
        </div>

        <div className="space-y-6">
            <div className="habbo-box p-6 bg-[#050a14] border-l-4 border-[#facc15]">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={18} className="text-[#facc15]" />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Önemli Uyarı</h3>
                </div>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                    Güvenliğiniz için mesajınızda <strong className="text-white">kesinlikle şifrenizi paylaşmayın.</strong> HabboZone personeli sizden asla şifrenizi talep etmez.
                </p>
            </div>

            <div className="habbo-box p-6 bg-[#0f172a]">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-[#1e293b] pb-2">Diğer Kanallar</h3>
                <ul className="space-y-3 text-[13px] text-gray-300">
                    <li className="flex justify-between items-center bg-[#1e293b] p-3 rounded-[4px] border border-black">
                        <span className="font-bold">E-Posta</span>
                        <span className="text-[#38bdf8]">iletisim@habbozone.com</span>
                    </li>
                    <li className="flex justify-between items-center bg-[#1e293b] p-3 rounded-[4px] border border-black">
                        <span className="font-bold">Discord</span>
                        <span className="text-[#a855f7]">discord.gg/habbozone</span>
                    </li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
}
