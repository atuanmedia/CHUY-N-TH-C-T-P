import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/residents.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', audienceScope: 'all', publishAt: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{ fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data || []);
    } catch (err) {
      console.error('fetchNotices', err);
      alert(err?.response?.data?.message || 'Lỗi khi tải thông báo');
    }
  };

  const resetForm = () => setForm({ title: '', content: '', audienceScope: 'all', publishAt: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (payload.publishAt === '') delete payload.publishAt;
      if (editingId) await api.put(`/notices/${editingId}`, payload);
      else await api.post('/notices', payload);
      resetForm();
      setEditingId(null);
      fetchNotices();
    } catch (err) {
      console.error('save notice', err);
      alert(err?.response?.data?.message || 'Lỗi khi lưu thông báo');
    }
  };

  const handleEdit = (n) => {
    setForm({ title: n.title || '', content: n.content || '', audienceScope: n.audienceScope || 'all', publishAt: n.publishAt ? new Date(n.publishAt).toISOString().slice(0,10) : '' });
    setEditingId(n._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xoá thông báo này?')) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error('delete notice', err);
      alert(err?.response?.data?.message || 'Xoá thất bại');
    }
  };

  return (
    <div className="residents-root">
      <div className="residents-card">
        <h2 className="residents-title">Quản lý Thông Báo</h2>

        <form onSubmit={handleSubmit} className="residents-form">
          <input className="input" placeholder="Tiêu đề" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
          <textarea className="input" placeholder="Nội dung" value={form.content} onChange={e=>setForm({...form, content: e.target.value})} />
          <select className="input" value={form.audienceScope} onChange={e=>setForm({...form, audienceScope: e.target.value})}>
            <option value="all">Toàn hệ thống</option>
            <option value="building">Theo tòa</option>
            <option value="apartment">Theo căn hộ</option>
          </select>
          <input className="input" type="date" placeholder="Ngày phát hành" value={form.publishAt} onChange={e=>setForm({...form, publishAt: e.target.value})} />

          <div style={{ display:'flex', gap:8, justifySelf:'end' }}>
            {editingId ? (
              <>
                <button type="button" className="button secondary" onClick={()=>{ resetForm(); setEditingId(null); }}>Huỷ</button>
                <button className="button">Lưu</button>
              </>
            ) : (
              <button className="button">Tạo</button>
            )}
          </div>
        </form>

        <table className="residents-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Phạm vi</th>
              <th>Ngày phát hành</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notices.map(n => (
              <tr key={n._id}>
                <td>{n.title}</td>
                <td>{n.audienceScope}</td>
                <td>{n.publishAt ? new Date(n.publishAt).toLocaleDateString() : ''}</td>
                <td style={{ display:'flex', gap:8 }}>
                  <button className="button secondary" onClick={()=>handleEdit(n)}>Sửa</button>
                  <button className="button" style={{ background:'transparent', color:'var(--danger)', boxShadow:'none', border:'1px solid rgba(239,68,68,0.12)'}} onClick={()=>handleDelete(n._id)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Notices;
