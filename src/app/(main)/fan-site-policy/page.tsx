import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Fan Site Politikası - Habbo Zone',
};

export default function FanSitePolicyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="habbo-box p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-[#facc15]" />
          <h1 className="text-3xl font-black text-white">Fan Site Politikası</h1>
        </div>
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-4">
          <p>HabboZone, Habbo Fan Sitesi Politikası çerçevesinde faaliyet gösteren bağımsız bir hayran sitesidir.</p>
          <h2 className="text-white font-bold text-lg mt-6">Sorumluluk Reddi</h2>
          <p>HabboZone, Sulake Oy veya iştirakleri tarafından doğrulanmamış, onaylanmamış ve desteklenmemektedir. Bu site, Habbo Fan Sitesi Politikası altında izin verilen ticari markaları ve diğer Habbo fikri mülkiyetlerini kullanmaktadır.</p>
          <h2 className="text-white font-bold text-lg mt-6">İçerik Kullanımı</h2>
          <p>Sitemizde yer alan içerikler, Habbo evrenine ait görseller ve markalar Sulake Oy'nin mülkiyetindedir. Tüm hakları saklıdır. Fan sitesi olarak, bu içerikleri yalnızca hayran topluluğuna hizmet amacıyla kullanmaktayız.</p>
          <h2 className="text-white font-bold text-lg mt-6">Telif Hakkı İhlalleri</h2>
          <p>Telif hakkı ihlali olduğunu düşündüğünüz bir içerik varsa, lütfen <a href="/contact" className="text-[#facc15] hover:underline">iletişim</a> sayfasından bizimle iletişime geçin. İhlal edici içerikler en kısa sürede kaldırılacaktır.</p>
        </div>
      </div>
    </div>
  );
}
