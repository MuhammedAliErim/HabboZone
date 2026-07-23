import NewsForm from '../_components/NewsForm'

export default function NewNewsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Yeni Haber Ekle</h1>
      <div className="bg-[#2a2a2a] border border-[#333] rounded-lg p-6">
        <NewsForm />
      </div>
    </div>
  )
}
