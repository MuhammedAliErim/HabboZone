'use client'

import { useState } from 'react'
import { Check, X, Trash2, Eye, ExternalLink, Image as ImageIcon, ShieldCheck, Clock, User } from 'lucide-react'
import { approveGalleryImage, rejectGalleryImage } from '../actions'
import Image from 'next/image'
import Link from 'next/link'

type GalleryImage = {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  profiles: {
    username: string
    habbo_username?: string
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
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null)

  const handleApprove = async (id: string) => {
    setLoading(true)
    try {
      await approveGalleryImage(id)
    } catch (err: any) {
      alert(err.message || 'Onaylanırken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string, imageUrl: string, isDelete = false) => {
    if (!confirm(`Bu görseli kalıcı olarak ${isDelete ? 'silmek' : 'reddetmek'} istediğinize emin misiniz?`)) return
    
    setLoading(true)
    try {
      await rejectGalleryImage(id, imageUrl)
    } catch (err: any) {
      alert(err.message || 'İşlem sırasında hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#1e293b] pb-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`habbo-box px-6 py-2.5 rounded-[3px] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'pending' 
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/20 scale-105' 
              : 'bg-[#0a1325] text-gray-400 hover:text-white border border-[#1e293b]'
          }`}
        >
          <Clock size={16} className={activeTab === 'pending' ? 'text-black' : 'text-yellow-400'} />
          Onay Bekleyenler ({pendingImages.length})
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`habbo-box px-6 py-2.5 rounded-[3px] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'approved' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20 scale-105' 
              : 'bg-[#0a1325] text-gray-400 hover:text-white border border-[#1e293b]'
          }`}
        >
          <ShieldCheck size={16} className={activeTab === 'approved' ? 'text-black' : 'text-emerald-400'} />
          Yayında Olanlar ({(approvedImages ?? []).length})
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activeTab === 'pending' ? (
          (pendingImages ?? []).length > 0 ? (
            (pendingImages ?? []).map(img => (
              <div key={img.id} className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden group hover:border-yellow-400/50 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-[#050a14] border-b border-[#1e293b] overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity" onClick={() => setPreviewImage(img)}>
                    <Image 
                      src={img.image_url} 
                      alt={img.title || 'Galeri Görseli'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-[2px] text-[10px] font-bold text-yellow-400 border border-yellow-400/30 flex items-center gap-1">
                      <Clock size={10} /> Bekliyor
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-black text-white text-sm truncate">{img.title || 'Başlıksız Görsel'}</h3>
                    {img.description ? (
                      <p className="text-xs text-gray-400 line-clamp-2 italic">{img.description}</p>
                    ) : (
                      <p className="text-xs text-gray-600 italic">- açıklama yok -</p>
                    )}
                    
                    <div className="text-xs text-gray-400 pt-2 border-t border-[#1e293b] flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-blue-400">
                        <User size={12} /> {img.profiles?.username || 'Anonim'}
                      </span>
                      <button 
                        onClick={() => setPreviewImage(img)}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px] font-bold underline"
                      >
                        <Eye size={12} /> Büyüt
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-[#050a14] border-t border-[#1e293b] flex gap-2">
                  <button
                    onClick={() => handleApprove(img.id)}
                    disabled={loading}
                    className="habbo-button flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2 rounded-[3px] text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <Check size={16} /> ONAYLA
                  </button>
                  <button
                    onClick={() => handleReject(img.id, img.image_url)}
                    disabled={loading}
                    className="habbo-button flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-2 rounded-[3px] text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <X size={16} /> REDDET
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500 habbo-box bg-[#0a1325] rounded-[3px] border border-[#1e293b]">
              <ImageIcon size={40} className="mx-auto mb-3 text-gray-600 opacity-40" />
              <p className="font-bold text-base text-gray-400">Onay bekleyen yeni galeri fotoğrafı yok.</p>
              <p className="text-xs mt-1">Topluluk üyeleri fotoğraf yüklediğinde burada listelenecektir.</p>
            </div>
          )
        ) : (
          approvedImages.length > 0 ? (
            approvedImages.map(img => (
              <div key={img.id} className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-[#050a14] border-b border-[#1e293b] overflow-hidden cursor-pointer" onClick={() => setPreviewImage(img)}>
                    <Image 
                      src={img.image_url} 
                      alt={img.title || 'Galeri Görseli'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-[2px] text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck size={12} /> Yayında
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-black text-white text-sm truncate">{img.title || 'Başlıksız Görsel'}</h3>
                    {img.description ? (
                      <p className="text-xs text-gray-400 line-clamp-2 italic">{img.description}</p>
                    ) : (
                      <p className="text-xs text-gray-600 italic">- açıklama yok -</p>
                    )}
                    
                    <div className="text-xs text-gray-400 pt-2 border-t border-[#1e293b] flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <User size={12} /> {img.profiles?.username || 'Anonim'}
                      </span>
                      <button 
                        onClick={() => setPreviewImage(img)}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px] font-bold underline"
                      >
                        <Eye size={12} /> Büyüt
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#050a14] border-t border-[#1e293b]">
                  <button
                    onClick={() => handleReject(img.id, img.image_url, true)}
                    disabled={loading}
                    className="habbo-button w-full bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white py-2 rounded-[3px] text-xs font-black flex items-center justify-center gap-1.5 transition-all border border-red-500/20 disabled:opacity-50"
                  >
                    <Trash2 size={14} /> GALERİDEN KALDIR VE SİL
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500 habbo-box bg-[#0a1325] rounded-[3px] border border-[#1e293b]">
              <ImageIcon size={40} className="mx-auto mb-3 text-gray-600 opacity-40" />
              <p className="font-bold text-base text-gray-400">Onaylanmış hiç fotoğraf bulunamadı.</p>
            </div>
          )
        )}
      </div>

      {/* Lightbox / Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
          <div className="habbo-box bg-[#0a1325] border border-[#1e293b] rounded-[3px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 bg-[#050a14] border-b border-[#1e293b] flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-base">{previewImage.title || 'Galeri Fotoğrafı'}</h3>
                <span className="text-xs text-yellow-400 font-bold">Yükleyen: {previewImage.profiles?.username || 'Anonim'}</span>
              </div>
              <button 
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-[3px] bg-[#050a14] hover:bg-[#0a1325] text-white border border-[#1e293b] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative p-6 overflow-auto flex-1 flex items-center justify-center bg-black/50">
              <Image 
                src={previewImage.image_url} 
                alt={previewImage.title || 'Fotoğraf'} 
                fill
                className="object-contain rounded-[3px] border border-[#1e293b] shadow-2xl p-4"
                unoptimized
              />
            </div>

            {previewImage.description && (
              <div className="p-4 bg-[#050a14] border-t border-[#1e293b] text-xs text-gray-300 italic">
                "{previewImage.description}"
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
