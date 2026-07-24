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
        className="habbo-button blue flex items-center justify-center gap-2 px-4 py-2 text-sm"
      >
        <Upload size={16} /> Resim Yükle
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Galeriye Resim Gönder</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Başlık</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Resmi kısaca tanımlayın"
                  maxLength={50}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Açıklama (İsteğe Bağlı)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none h-20"
                  placeholder="Resim hakkında daha fazla detay verebilirsiniz..."
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Resim Seç</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, GIF (Max: 5MB)</p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                  disabled={loading}
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  disabled={loading || !file || !title}
                  className="habbo-button green px-4 py-2 text-sm flex items-center gap-2"
                >
                  {loading ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
