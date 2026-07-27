import MagazineForm from '../_components/MagazineForm'

export default function NewMagazinePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-black text-white uppercase tracking-wider">YENİ GAZETE/DERGİ EKLE</h1>
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[2px] p-6 shadow-lg">
        <MagazineForm />
      </div>
    </div>
  )
}
