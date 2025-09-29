import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/residents.css";

function Residents() {
  const [residents, setResidents] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", apartment: null });
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách residents
  useEffect(() => {
    fetchResidents();
    fetchApartments();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await api.get("/residents");
      setResidents(res.data || []);
    } catch (err) {
      console.error('fetchResidents error', err?.response || err);
      if (err?.response?.status === 401) {
        alert('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.');
        // optional: redirect to login page here
      } else {
        alert('Lỗi khi tải danh sách cư dân');
      }
    }
  };

  const fetchApartments = async () => {
    try {
      const r = await api.get('/apartments');
      setApartments(r.data || []);
    } catch (err) { console.error('fetchApartments', err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { alert('Bạn chưa đăng nhập'); return; }
    try {
      const payload = { ...form };
      if (editingId) {
        // update
        await api.put(`/residents/${editingId}`, payload);
      } else {
        // create
        const r = await api.post("/residents", payload);
        console.log('create response', r);
      }
    } catch (err) {
      console.error('handleSubmit error', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Lỗi khi lưu cư dân';
      alert(msg);
      return;
    }
  setForm({ fullName: "", email: "", phone: "", apartment: null });
    setEditingId(null);
    fetchResidents();
  };

  const handleEdit = (resident) => {
    setForm({ fullName: resident.fullName || "", email: resident.email || "", phone: resident.phone || "", apartment: resident.apartment?._id || null });
    setEditingId(resident._id);
    // scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm({ fullName: "", email: "", phone: "", apartment: null });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xoá mục này?')) return;
    try {
  const token = localStorage.getItem('token');
  if (!token) { alert('Bạn chưa đăng nhập'); return; }
  const r = await api.delete(`/residents/${id}`);
      console.log('delete response', r);
      fetchResidents();
    } catch (err) {
      console.error(err);
      alert('Xoá thất bại');
    }
  };

  return (
    <div className="residents-root">
      <div className="residents-card">
        <h2 className="residents-title">Quản lý cư dân</h2>

  <form onSubmit={handleSubmit} className="residents-form">
          <input
            type="text"
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input"
            required
          />
          <select className="input" value={form.apartment || ""} onChange={e=>setForm({...form, apartment: e.target.value || null})}>
            <option value="">-- Chọn căn hộ (nếu có) --</option>
            {apartments.map(a => {
              const buildingName = a.buildingRef ? a.buildingRef.name : (a.building || '');
              return <option key={a._id} value={a._id}>{buildingName} - {a.code}</option>
            })}
          </select>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="SĐT"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
          />
          <div style={{ display: 'flex', gap: 8, justifySelf: 'end' }}>
            {editingId ? (
              <>
                <button type="button" className="button secondary" onClick={handleCancelEdit}>Huỷ</button>
                <button className="button">Lưu</button>
              </>
            ) : (
              <button className="button">Thêm</button>
            )}
          </div>
        </form>

        <table className="residents-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Căn hộ</th>
              <th>Email</th>
              <th>SĐT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {residents.map((r) => {
              const buildingName = r.apartment ? (r.apartment.buildingRef ? r.apartment.buildingRef.name : (r.apartment.building || '')) : '';
              return (
                <tr key={r._id}>
                  <td>{r.fullName}</td>
                  <td>{r.apartment ? `${buildingName} - ${r.apartment.code}` : '-'}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="button secondary" onClick={() => handleEdit(r)}>Sửa</button>
                      <button type="button" className="button" style={{ background: 'transparent', color: 'var(--danger)', boxShadow: 'none', border: '1px solid rgba(239,68,68,0.12)' }} onClick={() => handleDelete(r._id)}>Xoá</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Residents;