import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/apartments.css";

function Apartments() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ building: "", code: "", floor: "", area: "", status: "vacant" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/apartments');
      setItems(res.data || []);
    } catch (err) { console.error('fetch apartments', err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // prepare payload and coerce numeric fields
  const payload = { ...form };
  // ensure buildingRef not empty string
  if (payload.buildingRef === "") payload.buildingRef = null;
      if (payload.floor !== undefined && payload.floor !== null && payload.floor !== '') payload.floor = Number(payload.floor);
      if (payload.area !== undefined && payload.area !== null && payload.area !== '') payload.area = Number(payload.area);

      if (editingId) await api.put(`/apartments/${editingId}`, payload);
      else await api.post('/apartments', payload);
      setForm({ building: "", code: "", floor: "", area: "", status: "vacant" });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error('save apartment', err);
      const msg = err?.response?.data?.message || err.message || 'Lỗi khi lưu căn hộ';
      alert(msg);
    }
  };

  const handleEdit = (a) => { setForm({ building: a.building || '', code: a.code || '', floor: a.floor || '', area: a.area || '', status: a.status || 'vacant' }); setEditingId(a._id); window.scrollTo({ top:0, behavior:'smooth'}); };
  const handleCancel = () => { setForm({ building: "", code: "", floor: "", area: "", status: "vacant" }); setEditingId(null); };
  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xoá?')) return;
    try {
      await api.delete(`/apartments/${id}`);
      fetchItems();
    } catch (err) {
      console.error('delete apartment', err);
      const msg = err?.response?.data?.message || err.message || 'Xoá thất bại';
      alert(msg);
    }
  };

  const openDetails = async (id) => {
    try {
      const r = await api.get(`/apartments/${id}`);
      setSelected(r.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('openDetails', err);
      alert('Không thể lấy chi tiết căn hộ');
    }
  };

  const closeDetails = () => setSelected(null);

  return (
    <div className="apartments-root">
      <div className="apartments-card">
        <h2 className="apartments-title">Quản lý căn hộ</h2>

        <form onSubmit={handleSubmit} className="apartments-form">
          <input className="input" placeholder="Tòa / block" value={form.building} onChange={e=>setForm({...form, building:e.target.value})} required />
          <input className="input" placeholder="Mã căn hộ" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} required />
          <input className="input" placeholder="Tầng" value={form.floor} onChange={e=>setForm({...form, floor:e.target.value})} />
          <input className="input" placeholder="Diện tích (m2)" value={form.area} onChange={e=>setForm({...form, area:e.target.value})} />
          <select className="input" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
          </select>
          <div style={{ display:'flex', gap:8, justifySelf:'end' }}>
            {editingId ? (
              <>
                <button type="button" className="button secondary" onClick={handleCancel}>Huỷ</button>
                <button className="button">Lưu</button>
              </>
            ) : (
              <button className="button">Thêm</button>
            )}
          </div>
        </form>

        <table className="apartments-table">
          <thead>
            <tr>
              <th>Tòa</th>
              <th>Mã</th>
              <th>Tầng</th>
              <th>Diện tích</th>
              <th>Trạng thái</th>
              <th>#Cư dân</th>
              <th>#Phản ánh</th>
              <th>#Chưa trả</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a._id}>
                <td>{a.building}</td>
                <td>{a.code}</td>
                <td>{a.floor}</td>
                <td>{a.area}</td>
                <td>{a.status}</td>
                <td style={{ textAlign: 'center' }}>{a.residentsCount ?? 0}</td>
                <td style={{ textAlign: 'center' }}>{a.openTicketsCount ?? 0}</td>
                <td style={{ textAlign: 'center' }}>{a.unpaidInvoicesCount ?? 0}</td>
                <td style={{ display:'flex', gap:8 }}>
                  <button type="button" className="button secondary" onClick={()=>handleEdit(a)}>Sửa</button>
                  <button type="button" className="button" style={{ background:'transparent', color:'var(--danger)', boxShadow:'none', border:'1px solid rgba(239,68,68,0.12)'}} onClick={()=>handleDelete(a._id)}>Xoá</button>
                  <button type="button" className="button" onClick={()=>openDetails(a._id)}>Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selected && (
          <div className="apartments-details">
            <h3>Chi tiết căn hộ {selected.building} - {selected.code}</h3>
            <p>Trạng thái: <strong>{selected.status}</strong></p>
            <p>Số cư dân: {selected.residents?.length ?? selected.residentsCount ?? 0}</p>
            <p>Phản ánh đang mở: {selected.openTicketsCount}</p>
            <p>Hoá đơn chưa trả: {selected.unpaidInvoicesCount}</p>
            <h4>Danh sách cư dân</h4>
            <ul>
              {(selected.residents || []).map(r => (
                <li key={r._id}>{r.fullName} — {r.phone || r.email || '-'}</li>
              ))}
            </ul>
            <div style={{ marginTop: 8 }}>
              <button className="button" onClick={closeDetails}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Apartments;