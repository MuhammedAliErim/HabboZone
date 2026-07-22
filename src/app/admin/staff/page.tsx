'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Edit, Save, X, Plus } from 'lucide-react';
import HabboAvatar from '@/components/HabboAvatar';

type Profile = {
  id: string;
  username: string;
  habbo_username: string;
  role: string;
};

type StaffMember = {
  id: string;
  user_id: string;
  position: string;
  order_index: number;
  profiles: Profile;
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add new state
  const [isAdding, setIsAdding] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newOrder, setNewOrder] = useState(0);
  const [newRole, setNewRole] = useState('Member');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPosition, setEditPosition] = useState('');
  const [editOrder, setEditOrder] = useState(0);
  const [editRole, setEditRole] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchStaffAndProfiles();
  }, []);

  const fetchStaffAndProfiles = async () => {
    setLoading(true);
    
    // Fetch current staff
    const { data: staffData } = await supabase
      .from('staff')
      .select(`
        id,
        user_id,
        position,
        order_index,
        profiles:user_id (id, username, habbo_username, role)
      `)
      .order('order_index', { ascending: true });

    if (staffData) setStaff(staffData as any);
    
    // Fetch all profiles for the select dropdown (to add new staff)
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username, habbo_username, role')
      .order('username', { ascending: true });

    if (profilesData) setProfiles(profilesData);
    
    setLoading(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId || !newPosition) return alert('Lütfen kullanıcı ve pozisyon seçin.');

    // Add to staff table
    const { error: staffError } = await supabase
      .from('staff')
      .insert([{ user_id: newUserId, position: newPosition, order_index: newOrder }]);

    if (staffError) return alert('Hata: ' + staffError.message);

    // Update profile role if necessary
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', newUserId);

    if (roleError) console.error('Rol güncellenemedi:', roleError);

    setIsAdding(false);
    setNewUserId('');
    setNewPosition('');
    setNewOrder(0);
    setNewRole('Member');
    fetchStaffAndProfiles();
  };

  const handleEditClick = (member: StaffMember) => {
    setEditingId(member.id);
    setEditPosition(member.position);
    setEditOrder(member.order_index || 0);
    setEditRole(member.profiles.role);
  };

  const handleEditSave = async (id: string, userId: string) => {
    // Update staff table
    const { error: staffError } = await supabase
      .from('staff')
      .update({ position: editPosition, order_index: editOrder })
      .eq('id', id);

    if (staffError) return alert('Hata: ' + staffError.message);

    // Update profile role
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: editRole })
      .eq('id', userId);

    if (roleError) console.error('Rol güncellenemedi:', roleError);

    setEditingId(null);
    fetchStaffAndProfiles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kişiyi ekipten çıkarmak istediğinize emin misiniz?')) return;
    
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (!error) {
      setStaff(staff.filter(s => s.id !== id));
    } else {
      alert(error.message);
    }
  };

  // Filter profiles that are not already in staff
  const availableProfiles = profiles.filter(p => !staff.find(s => s.user_id === p.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black mb-1 uppercase tracking-widest">Kadro Yönetimi</h2>
          <p className="text-white/60">Sitede görünecek ekip üyelerini ve yetkilerini belirleyin.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-black font-bold uppercase tracking-widest px-6 py-3 rounded-lg pixel-borders hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {isAdding ? <><X size={18} /> İptal</> : <><Plus size={18} /> Ekip Üyesi Ekle</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/10 border border-white/20 p-6 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4 uppercase">Yeni Ekip Üyesi</h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold mb-1 opacity-70 uppercase">Kullanıcı Seçin</label>
              <select 
                required
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                <option value="">Seçiniz...</option>
                {availableProfiles.map(p => (
                  <option key={p.id} value={p.id}>{p.username}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold mb-1 opacity-70 uppercase">Ekip Pozisyonu</label>
              <input 
                type="text" 
                required
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Örn: Baş Editör"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold mb-1 opacity-70 uppercase">Sistem Rolü</label>
              <select 
                required
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                <option value="Member">Normal Üye</option>
                <option value="Journalist">Haberci</option>
                <option value="Editor">Editör</option>
                <option value="Moderator">Moderatör</option>
                <option value="Administrator">Yönetici</option>
                <option value="Developer">Geliştirici</option>
                <option value="Owner">Kurucu</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold mb-1 opacity-70 uppercase">Sıra</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={newOrder}
                  onChange={(e) => setNewOrder(parseInt(e.target.value))}
                  className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-white text-center focus:outline-none focus:border-primary"
                />
                <button type="submit" className="flex-1 bg-primary text-black font-bold py-2 rounded-lg hover:scale-105 transition-transform">
                  Ekle
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

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
                  <th className="p-4 font-bold w-16 text-center">Sıra</th>
                  <th className="p-4 font-bold">Kullanıcı</th>
                  <th className="p-4 font-bold">Pozisyon / Rol</th>
                  <th className="p-4 font-bold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/50">
                      Henüz ekibe eklenmiş kimse yok.
                    </td>
                  </tr>
                ) : (
                  staff.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center">
                        {editingId === item.id ? (
                          <input 
                            type="number" 
                            value={editOrder}
                            onChange={(e) => setEditOrder(parseInt(e.target.value))}
                            className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-center"
                          />
                        ) : (
                          <span className="font-bold text-white/50">{item.order_index}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black/20 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            <HabboAvatar username={item.profiles?.habbo_username || 'Habbo'} size="s" headDirection={2} direction={2} className="w-12 h-12 -mt-2" />
                          </div>
                          <div>
                            <div className="font-bold">{item.profiles?.username}</div>
                            <div className="text-xs text-white/40">{item.profiles?.habbo_username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editPosition}
                              onChange={(e) => setEditPosition(e.target.value)}
                              className="bg-black/40 border border-white/10 rounded px-3 py-1 text-sm flex-1"
                            />
                            <select 
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm w-32"
                            >
                              <option value="Member">Normal Üye</option>
                              <option value="Journalist">Haberci</option>
                              <option value="Editor">Editör</option>
                              <option value="Moderator">Moderatör</option>
                              <option value="Administrator">Yönetici</option>
                              <option value="Developer">Geliştirici</option>
                              <option value="Owner">Kurucu</option>
                            </select>
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-primary">{item.position}</div>
                            <div className="text-xs inline-block bg-white/10 px-2 rounded-full mt-1">{item.profiles?.role}</div>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {editingId === item.id ? (
                          <>
                            <button onClick={() => handleEditSave(item.id, item.user_id)} className="inline-flex p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors">
                              <Save size={18} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="inline-flex p-2 text-white/50 hover:bg-white/10 rounded-lg transition-colors">
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEditClick(item)} className="inline-flex p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="inline-flex p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
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
