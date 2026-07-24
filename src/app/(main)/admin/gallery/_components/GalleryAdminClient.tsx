'use client'

import { useState } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import { approveGalleryImage, rejectGalleryImage } from '../actions'
import Image from 'next/image'

type GalleryImage = {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  profiles: {
    username: string
    habbo_username: string
  }
}

export default function GalleryAdminClient({
  pendingImages,
  approvedImages
}: {
  pendingImages: GalleryImage[]
  approvedImages: GalleryImage[]
}) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending')

  const handleApprove = async (id: string) => {
    setLoading(true)
    try {
      await approveGalleryImage(id)
      alert('Görsel onaylandı!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string, imageUrl: string, isDelete = false) => {
    if (!confirm(`Bu görseli ${isDelete ? 'silmek' : 'reddetmek'} istediğinize emin misiniz?`)) return
    
    setLoading(true)
    try {
      await rejectGalleryImage(id, imageUrl)
      alert(isDelete ? 'Görsel silindi!' : 'Görsel reddedildi ve silindi!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#333]">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'pending' 
              ? 'border-yellow-400 text-white' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Onay Bekleyenler ({pendingImages.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'approved' 
              ? 'border-yellow-400 text-white' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Son Onaylananlar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeTab === 'pending' ? (
          pendingImages.length > 0 ? (
            pendingImages.map(img => (
              <div key={img.id} className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden group">
                <div className="relative aspect-video w-full bg-black/50">
                  <Image 
                    src={img.image_url} 
                    alt={img.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm truncate">{img.title}</h3>
                  {img.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">{img.description}</p>
                  )}
                  <div className="text-[10px] text-gray-500 pt-2 border-t border-[#333] mt-2">
                    Yükleyen: {img.profiles?.username}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(img.id)}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Check size={14} /> Onayla
                    </button>
                    <button
                      onClick={() => handleReject(img.id, img.image_url)}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <X size={14} /> Reddet
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-[#2a2a2a] rounded-lg border border-[#333]">
              Onay bekleyen görsel bulunmuyor.
            </div>
          )
        ) : (
          approvedImages.length > 0 ? (
            approvedImages.map(img => (
              <div key={img.id} className="bg-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden group">
                <div className="relative aspect-video w-full bg-black/50">
                  <Image 
                    src={img.image_url} 
                    alt={img.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm truncate">{img.title}</h3>
                  {img.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">{img.description}</p>
                  )}
                  <div className="text-[10px] text-gray-500 pt-2 border-t border-[#333] mt-2">
                    Yükleyen: {img.profiles?.username}
                  </div>
                  
                  <div className="pt-2">
                    <button
                      onClick={() => handleReject(img.id, img.image_url, true)}
                      disabled={loading}
                      className="w-full bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} /> Sil
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-[#2a2a2a] rounded-lg border border-[#333]">
              Onaylanmış görsel bulunmuyor.
            </div>
          )
        )}
      </div>
    </div>
  )
}
