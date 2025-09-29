import { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../styles/apartments.css';

export default function Buildings(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{ fetchItems(); }, []);
  const fetchItems = async ()=>{
    try{ const r = await api.get('/buildings'); setItems(r.data || []); } catch(e){ console.error(e); }
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      if(editingId) await api.put(`/buildings/${editingId}`, form);
      else await api.post('/buildings', form);
      setForm({ name:'', code:'', address:'' }); setEditingId(null); fetchItems();
    }catch(err){ console.error(err); alert(err?.response?.data?.message || 'Lỗi'); }
  };

  const handleEdit = (b)=>{ setForm({ name:b.name||'', code:b.code||'', address:b.address||'' }); setEditingId(b._id); window.scrollTo({ top:0, behavior:'smooth' }); };
  const handleDelete = async (id)=>{ if(!confirm('Xác nhận?')) return; try{ await api.delete(`/buildings/${id}`); fetchItems(); }catch(e){ console.error(e); alert('Xoá thất bại'); } };

  return (
    <div className="apartments-root">
      <div className="apartments-card">
        <h2>Quản lý tòa</h2>
        <form onSubmit={handleSubmit} className="apartments-form">
          <input className="input" placeholder="Tên tòa" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="input" placeholder="Mã tòa" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} />
          <input className="input" placeholder="Địa chỉ" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
          <div style={{ display:'flex', gap:8, justifySelf:'end' }}>
            {editingId ? (
              <>
                <button type="button" className="button secondary" onClick={()=>{ setForm({ name:'', code:'', address:'' }); setEditingId(null); }}>Huỷ</button>
                <button className="button">Lưu</button>
              </>
            ) : (
              <button className="button">Thêm</button>
            )}
          </div>
        </form>

        <table className="apartments-table">
          <thead><tr><th>Tên</th><th>Mã</th><th>Địa chỉ</th><th></th></tr></thead>
          <tbody>
            {items.map(b=> (
              <tr key={b._id}><td>{b.name}</td><td>{b.code}</td><td>{b.address}</td><td style={{ display:'flex', gap:8 }}><button className="button secondary" onClick={()=>handleEdit(b)}>Sửa</button><button className="button" style={{ background:'transparent', color:'var(--danger)', boxShadow:'none', border:'1px solid rgba(239,68,68,0.12)'}} onClick={()=>handleDelete(b._id)}>Xoá</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
