import { Cookie } from 'lucide-react';

export const metadata = {
  title: 'Çerez Politikası - Habbo Zone',
};

export default function CookiesPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="habbo-box p-8">
        <div className="flex items-center gap-3 mb-6">
          <Cookie size={24} className="text-[#facc15]" />
          <h1 className="text-3xl font-black text-white">Çerez Politikası</h1>
        </div>
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-4">
          <p>Bu çerez politikası, HabboZone web sitesi tarafından kullanılan çerezler ve benzer teknolojiler hakkında sizi bilgilendirmeyi amaçlar.</p>
          <h2 className="text-white font-bold text-lg mt-6">Çerez Nedir?</h2>
          <p>Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Site deneyiminizi iyileştirmek, tercihlerinizi hatırlamak ve site trafiğini analiz etmek için kullanılırlar.</p>
          <h2 className="text-white font-bold text-lg mt-6">Kullandığımız Çerez Türleri</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">Zorunlu Çerezler:</strong> Siteyi düzgün çalışması için gerekli olan çerezlerdir.</li>
            <li><strong className="text-white">Analitik Çerezler:</strong> Site kullanımını anlamamıza yardımcı olan anonim veriler toplar.</li>
            <li><strong className="text-white">Oturum Çerezleri:</strong> Oturumunuz boyunca geçerli olan ve tarayıcıyı kapattığınızda silinen çerezlerdir.</li>
          </ul>
          <h2 className="text-white font-bold text-lg mt-6">Çerezleri Kontrol Etme</h2>
          <p>Tarayıcı ayarlarınızdan çerezleri yönetebilir, silebilir veya engelleyebilirsiniz. Ancak, çerezleri devre dışı bırakmanız durumunda sitemizin bazı özellikleri düzgün çalışmayabilir.</p>
        </div>
      </div>
    </div>
  );
}
