import NewsForm from '../_components/NewsForm'

export default function NewNewsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-black text-white uppercase tracking-wider">YENİ HABER EKLE</h1>
      <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[2px] p-6 shadow-lg">
        <NewsForm />
      </div>
    </div>
  )
}
