import MagazineForm from '../_components/MagazineForm'

export default function NewMagazinePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Yeni Gazete/Dergi Ekle</h1>
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <MagazineForm />
      </div>
    </div>
  )
}
