'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';

type RadioRequest = {
  id: string;
  sender_name: string;
  message: string;
  song_request: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminRadioRequestsPage() {
  const [requests, setRequests] = useState<RadioRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
    
    // Subscribe to real-time new requests
    const channel = supabase.channel('realtime:public:radio_requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'radio_requests' }, payload => {
        setRequests(prev => [payload.new as RadioRequest, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'radio_requests' }, payload => {
        setRequests(prev => prev.map(req => req.id === payload.new.id ? payload.new as RadioRequest : req));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'radio_requests' }, payload => {
        setRequests(prev => prev.filter(req => req.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('radio_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('radio_requests')
      .update({ is_read: !currentStatus })
      .eq('id', id);

    if (error) {
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu isteği silmek istediğinize emin misiniz?')) return;
    
    const { error } = await supabase.from('radio_requests').delete().eq('id', id);
    if (error) {
      alert('İstek silinirken bir hata oluştu.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Radyo İstekleri</h2>
          <p className="text-white/60">Canlı yayına gelen son istekleri ve mesajları takip edin.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-4xl text-primary">⚙</div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-sm uppercase tracking-wider text-white/60">
                  <th className="p-4 font-bold w-12">Durum</th>
                  <th className="p-4 font-bold">Gönderen</th>
                  <th className="p-4 font-bold">İstediği Şarkı</th>
                  <th className="p-4 font-bold">Mesaj</th>
                  <th className="p-4 font-bold">Tarih</th>
                  <th className="p-4 font-bold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/50">
                      Henüz hiç radyo isteği yok.
                    </td>
                  </tr>
                ) : (
                  requests.map((item) => (
                    <tr key={item.id} className={`transition-colors ${item.is_read ? 'bg-transparent opacity-60' : 'bg-white/5 hover:bg-white/10'}`}>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => toggleReadStatus(item.id, item.is_read)}
                          className={`transition-colors ${item.is_read ? 'text-green-500' : 'text-white/30 hover:text-white/80'}`}
                          title={item.is_read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                        >
                          {item.is_read ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{item.sender_name}</div>
                      </td>
                      <td className="p-4 text-sm font-medium text-primary">
                        {item.song_request || '-'}
                      </td>
                      <td className="p-4 text-sm text-white/80 max-w-xs break-words">
                        {item.message}
                      </td>
                      <td className="p-4 text-sm text-white/60 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString('tr-TR')}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="inline-flex p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="İsteği Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
