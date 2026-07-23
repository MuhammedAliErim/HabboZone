import { Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Kurallar | HabboZone",
  description: "HabboZone topluluk kuralları ve davranış yönergeleri.",
};

export default function RulesPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-in fade-in duration-500 w-full space-y-6">
      
      <div className="flex items-center gap-3 bg-[#1e293b] border-2 border-black p-4 rounded-[4px] shadow-[0_4px_0_#000]">
        <Shield size={24} className="text-[#facc15]" />
        <h1 className="text-xl font-black text-white tracking-widest uppercase">Topluluk Kuralları</h1>
      </div>

      <div className="habbo-box p-8 md:p-10 space-y-8 bg-[#0f172a]">
        
        <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
          HabboZone'un güvenli, saygılı ve eğlenceli bir ortam olarak kalabilmesi için herkesin aşağıdaki kurallara uyması zorunludur. Kurallara uymayan kullanıcılar platformdan uzaklaştırılabilir.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="mt-1"><XCircle size={20} className="text-[#ef4444]" /></div>
            <div>
              <h3 className="text-white font-bold text-[15px] mb-1 uppercase tracking-wider">Saygısızlık ve Hakaret</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Diğer üyelere, yöneticilere veya üçüncü şahıslara yönelik hakaret, küfür, aşağılayıcı dil kullanmak ve kışkırtıcı davranışlarda bulunmak kesinlikle yasaktır.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><XCircle size={20} className="text-[#ef4444]" /></div>
            <div>
              <h3 className="text-white font-bold text-[15px] mb-1 uppercase tracking-wider">Spam ve Reklam</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Forumda, haber yorumlarında veya profillerde gereksiz, tekrarlayan mesajlar (spam) atmak; başka web sitelerinin veya ticari oluşumların reklamını yapmak yasaktır.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><AlertTriangle size={20} className="text-[#facc15]" /></div>
            <div>
              <h3 className="text-white font-bold text-[15px] mb-1 uppercase tracking-wider">Kişisel Bilgilerin Paylaşımı</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Kendinize veya bir başkasına ait kişisel bilgileri (gerçek isim, adres, telefon numarası vb.) herkese açık alanlarda paylaşmak güvenlik nedeniyle yasaktır.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><AlertTriangle size={20} className="text-[#facc15]" /></div>
            <div>
              <h3 className="text-white font-bold text-[15px] mb-1 uppercase tracking-wider">Scam ve Dolandırıcılık</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Kullanıcıları kandırmaya yönelik çekilişler, şifre çalma girişimleri (phishing) veya hile (script) paylaşımları anında kalıcı uzaklaştırma sebebidir.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><CheckCircle size={20} className="text-[#22c55e]" /></div>
            <div>
              <h3 className="text-white font-bold text-[15px] mb-1 uppercase tracking-wider">Habbo Way (Habbo Yolu)</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                HabboZone üzerinde yapılan tüm paylaşımlar resmi Habbo Yolu kurallarına uygun olmalıdır. Resmi kuralları ihlal eden içerikler sitemizden de kaldırılır.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
