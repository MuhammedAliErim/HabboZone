import { Book, AlertCircle, FileText } from "lucide-react";

export const metadata = {
  title: "Kullanım Şartları | HabboZone",
  description: "HabboZone kullanım şartları ve yasal bilgiler.",
};

export default function TermsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-in fade-in duration-500 w-full space-y-6">
      
      <div className="flex items-center gap-3 bg-[#1e293b] border-2 border-black p-4 rounded-[4px] shadow-[0_4px_0_#000]">
        <Book size={24} className="text-[#38bdf8]" />
        <h1 className="text-xl font-black text-white tracking-widest uppercase">Kullanım Şartları</h1>
      </div>

      <div className="habbo-box p-8 md:p-10 space-y-8 bg-[#0f172a] prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white">
        
        <p className="text-[14px] leading-relaxed font-medium">
          HabboZone'u kullanarak aşağıdaki şartları ve koşulları kabul etmiş sayılırsınız. Lütfen hizmetlerimizi kullanmadan önce bu metni dikkatlice okuyunuz.
        </p>

        <h3 className="flex items-center gap-2 border-b border-[#1e293b] pb-2 mt-8">
            <FileText size={18} className="text-[#38bdf8]" /> 
            1. Genel Hükümler
        </h3>
        <p>
            HabboZone, gönüllüler tarafından yönetilen bağımsız bir platformdur. Sitede yer alan haberler, rehberler ve diğer tüm içerikler bilgi verme amacı taşır. İçeriklerin doğruluğu için azami çaba gösterilmekle birlikte, HabboZone oluşabilecek herhangi bir mağduriyetten sorumlu tutulamaz.
        </p>

        <h3 className="flex items-center gap-2 border-b border-[#1e293b] pb-2 mt-8">
            <AlertCircle size={18} className="text-[#facc15]" /> 
            2. Sulake Sorumluluk Reddi
        </h3>
        <p>
            Bu HabboZone, Sulake Oy veya İştirakleri tarafından doğrulanmamış, onaylanmamış ve desteklenmemiştir ve bunlar ile bağlı değildir. Bu HabboZone, Habbo Fan Sitesi Poliçesi altında izin verilen ticaret markalarını ve diğer Habbo fikrî mülkiyetlerini kullanabilir.
        </p>

        <h3 className="flex items-center gap-2 border-b border-[#1e293b] pb-2 mt-8">
            <FileText size={18} className="text-[#38bdf8]" /> 
            3. Kullanıcı İçerikleri
        </h3>
        <p>
            Kullanıcıların forumda veya yorumlarda paylaştığı her türlü içeriğin (yazı, resim, bağlantı) sorumluluğu tamamen paylaşan kişiye aittir. Yasadışı, telif hakkı ihlali içeren veya topluluk kurallarına aykırı içerikler yöneticiler tarafından uyarısız silinebilir.
        </p>

        <h3 className="flex items-center gap-2 border-b border-[#1e293b] pb-2 mt-8">
            <FileText size={18} className="text-[#38bdf8]" /> 
            4. Hesap Güvenliği
        </h3>
        <p>
            HabboZone hesap güvenliğinizden siz sorumlusunuz. Şifrenizi kimseyle paylaşmayınız. HabboZone personeli sizden asla Habbo şifrenizi veya oyun içi kişisel bilgilerinizi istemez.
        </p>

      </div>

    </div>
  );
}
