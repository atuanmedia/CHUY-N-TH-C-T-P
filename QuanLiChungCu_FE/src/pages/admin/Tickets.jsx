import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/residents.css";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [editForm, setEditForm] = useState({ status: '', assignee: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTickets();
    fetchApartments();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('fetchTickets', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Lỗi khi tải yêu cầu';
      alert(msg);
    }
  };

  const fetchApartments = async () => {
    try {
      const res = await api.get('/apartments');
      setApartments(res.data.apartments || []);
    } catch (err) {
      console.error('fetchApartments', err);
    }
  };

  const startEdit = (t) => {
    setEditForm({ status: t.status || 'open', assignee: t.assignee || '' });
    setEditingId(t._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditForm({ status: '', assignee: '' }); setEditingId(null); };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xoá yêu cầu này?')) return;
    try {
      await api.delete(`/tickets/${id}`);
      fetchTickets();
    } catch (err) {
      console.error('delete ticket', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Xoá thất bại';
      alert(msg);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/tickets/${id}`, { status });
      fetchTickets();
    } catch (err) {
      console.error('change status', err);
      alert(err?.response?.data?.message || 'Không thể thay đổi trạng thái');
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await api.put(`/tickets/${editingId}`, { status: editForm.status, assignee: editForm.assignee });
      cancelEdit();
      fetchTickets();
    } catch (err) {
      console.error('save edit', err);
      alert(err?.response?.data?.message || 'Không thể lưu thay đổi');
    }
  };

  return (
    <div className="residents-root">
      <div className="residents-card">
        <h2 className="residents-title">Phản ánh / Yêu cầu</h2>

        {/* Admin UI: inline editor for status/assignee (no create form) */}
        {editingId && (
          <div style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center' }}>
            <select className="input" value={editForm.status} onChange={e=>setEditForm({...editForm, status: e.target.value})}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <input className="input" placeholder="Assignee (user id)" value={editForm.assignee} onChange={e=>setEditForm({...editForm, assignee: e.target.value})} />
            <div style={{ display:'flex', gap:8 }}>
              <button type="button" className="button secondary" onClick={cancelEdit}>Huỷ</button>
              <button type="button" className="button" onClick={saveEdit}>Lưu</button>
            </div>
          </div>
        )}

        <table className="residents-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Căn hộ</th>
              <th>Tiêu đề</th>
              <th>Ưu tiên</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t._id}>
                <td>{t._id}</td>
                <td>{t.apartment ? `${t.apartment.building} - ${t.apartment.code}` : '-'}</td>
                <td>{t.title}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td style={{ display:'flex', gap:8 }}>
                  <button type="button" className="button secondary" onClick={()=>handleEdit(t)}>Sửa</button>
                  <button type="button" className="button" style={{ background:'transparent', color:'var(--danger)', boxShadow:'none', border:'1px solid rgba(239,68,68,0.12)'}} onClick={()=>handleDelete(t._id)}>Xoá</button>
                  <select value={t.status} onChange={(e)=>changeStatus(t._id, e.target.value)} className="input" style={{ minWidth:120 }}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tickets;