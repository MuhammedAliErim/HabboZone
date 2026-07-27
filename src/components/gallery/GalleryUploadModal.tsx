'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { submitGalleryImage } from '@/app/(main)/gallery/actions'

export default function GalleryUploadModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) {
      alert('Lütfen başlık ve resim ekleyin.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('title', title)
      formData.append('description', description)

      await submitGalleryImage(formData)
      alert('Resminiz başarıyla gönderildi! Yöneticiler onayladıktan sonra galeride yerini alacaktır.')
      setIsOpen(false)
      setTitle('')
      setDescription('')
      setFile(null)
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="habbo-button blue flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider"
      >
        <Upload size={16} /> RESİM YÜKLE
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-[#050a14] border-b border-[#1e293b] px-4 py-3 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-white">GALERİYE RESİM GÖNDER</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">BAŞLIK</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#3b82f6] shadow-inner transition-colors"
                  placeholder="Resmi kısaca tanımlayın"
                  maxLength={50}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">AÇIKLAMA (İSTEĞE BAĞLI)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#3b82f6] shadow-inner transition-colors resize-none h-20"
                  placeholder="Resim hakkında daha fazla detay verebilirsiniz..."
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">RESİM SEÇ</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#050a14] border border-[#1e293b] rounded-[2px] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#3b82f6] shadow-inner transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-[2px] file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#1e293b] file:text-white hover:file:bg-[#3b82f6]/20"
                  required
                />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1.5">PNG, JPG, GIF (MAX: 5MB)</p>
              </div>

              <div className="pt-4 border-t border-[#1e293b] flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="habbo-button bg-gray-700 hover:bg-gray-600 border-gray-800 px-4 py-2 text-xs font-black uppercase tracking-wider"
                  disabled={loading}
                >
                  İPTAL
                </button>
                <button 
                  type="submit"
                  disabled={loading || !file || !title}
                  className="habbo-button success px-6 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2"
                >
                  {loading ? 'GÖNDERİLİYOR...' : 'GÖNDER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
