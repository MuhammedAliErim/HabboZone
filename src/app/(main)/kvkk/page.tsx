import { FileText } from 'lucide-react';

export const metadata = {
  title: 'KVKK Aydınlatma Metni - Habbo Zone',
};

export default function KvkkPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="habbo-box p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-[#facc15]" />
          <h1 className="text-3xl font-black text-white">KVKK Aydınlatma Metni</h1>
        </div>
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-4">
          <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, veri sorumlusu sıfatıyla HabboZone tarafından işlenen kişisel verileriniz hakkında sizi bilgilendirmek isteriz.</p>
          <h2 className="text-white font-bold text-lg mt-6">Veri Sorumlusu</h2>
          <p>HabboZone, KVKK kapsamında veri sorumlusu olarak hareket etmektedir.</p>
          <h2 className="text-white font-bold text-lg mt-6">Kişisel Verilerin İşlenme Amacı</h2>
          <p>Kişisel verileriniz, üyelik işlemleri, site kullanım deneyiminin iyileştirilmesi, topluluk kurallarının uygulanması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.</p>
          <h2 className="text-white font-bold text-lg mt-6">Verilerin Aktarılması</h2>
          <p>Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz. Verileriniz Supabase altyapısında, güvenli sunucularda saklanmaktadır.</p>
          <h2 className="text-white font-bold text-lg mt-6">Haklarınız</h2>
          <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme</li>
            <li>Verilerinizin silinmesini veya yok edilmesini isteme</li>
            <li>İşleme amacına aykırı kullanım durumunda düzeltme talep etme</li>
          </ul>
          <p className="mt-4">Haklarınızı kullanmak için <a href="/contact" className="text-[#facc15] hover:underline">iletişim</a> sayfasından bize ulaşabilirsiniz.</p>
        </div>
      </div>
    </div>
  );
}
