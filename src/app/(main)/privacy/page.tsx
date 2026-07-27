import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Gizlilik Politikası - Habbo Zone',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="habbo-box p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-[#facc15]" />
          <h1 className="text-3xl font-black text-white">Gizlilik Politikası</h1>
        </div>
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-4">
          <p>HabboZone olarak gizliliğinize önem veriyoruz. Bu gizlilik politikası, sitemizi kullanırken hangi bilgilerin toplandığını, bu bilgilerin nasıl kullanıldığını ve korunduğunu açıklamaktadır.</p>
          <h2 className="text-white font-bold text-lg mt-6">Toplanan Bilgiler</h2>
          <p>Hesap oluştururken sağladığınız kullanıcı adı, e-posta adresi ve profil bilgileri. Site kullanım istatistikleri ve çerezler aracılığıyla toplanan anonim veriler.</p>
          <h2 className="text-white font-bold text-lg mt-6">Bilgilerin Kullanımı</h2>
          <p>Toplanan bilgiler, size daha iyi bir kullanıcı deneyimi sunmak, siteyi geliştirmek ve topluluk kurallarına uygunluğu sağlamak amacıyla kullanılır.</p>
          <h2 className="text-white font-bold text-lg mt-6">Veri Güvenliği</h2>
          <p>Kişisel bilgileriniz şifrelenmiş bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır. Üçüncü taraflarla kişisel bilgileriniz paylaşılmaz.</p>
          <h2 className="text-white font-bold text-lg mt-6">Çerezler</h2>
          <p>Site deneyiminizi iyileştirmek için çerezler kullanılmaktadır. Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz.</p>
          <h2 className="text-white font-bold text-lg mt-6">İletişim</h2>
          <p>Gizlilik politikamız hakkında sorularınız için <a href="/contact" className="text-[#facc15] hover:underline">iletişim</a> sayfasını kullanabilirsiniz.</p>
          <p className="text-sm text-gray-500 mt-8">Son güncelleme: 2024</p>
        </div>
      </div>
    </div>
  );
}
