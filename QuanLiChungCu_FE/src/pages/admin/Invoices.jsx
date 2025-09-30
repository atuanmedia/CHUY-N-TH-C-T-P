import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/residents.css";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [form, setForm] = useState({ apartment: "", periodMonth: "", periodYear: "", total: "", dueAt: "", status: "unpaid" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchInvoices(); fetchApartments(); }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      if (res.data && Array.isArray(res.data.invoices)) {
        setInvoices(res.data.invoices);
      } else {
        console.warn('Expected array for invoices but got:', res.data);
        setInvoices([]);
      }
    } catch (err) {
      console.error('fetchInvoices', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Lỗi khi tải danh sách hoá đơn';
      alert(msg);
    }
  };

  const fetchApartments = async () => {
    try {
      const res = await api.get('/apartments');
      setApartments(res.data || []);
    } catch (err) { console.error('fetchApartments', err); }
  };

  const resetForm = () => setForm({ apartment: "", periodMonth: "", periodYear: "", total: "", dueAt: "", status: "unpaid" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      // coerce numbers
      payload.periodMonth = Number(payload.periodMonth);
      payload.periodYear = Number(payload.periodYear);
      if (payload.total !== '') payload.total = Number(payload.total);

      if (editingId) await api.put(`/invoices/${editingId}`, payload);
      else await api.post('/invoices', payload);

      resetForm();
      setEditingId(null);
      fetchInvoices();
    } catch (err) {
      console.error('save invoice', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Lỗi khi lưu hoá đơn';
      alert(msg);
    }
  };

  const handleEdit = (inv) => {
    setForm({ apartment: inv.apartment?._id || '', periodMonth: inv.periodMonth || '', periodYear: inv.periodYear || '', total: inv.total || '', dueAt: inv.dueAt ? new Date(inv.dueAt).toISOString().slice(0, 10) : '', status: inv.status || 'unpaid' });
    setEditingId(inv._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { resetForm(); setEditingId(null); };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xoá hoá đơn này?')) return;
    try {
      await api.delete(`/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      console.error('delete invoice', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Xoá thất bại';
      alert(msg);
    }
  };

  const handleAddPayment = async (id) => {
    const amountStr = prompt('Số tiền thanh toán:');
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (!Number.isFinite(amount)) { alert('Số tiền không hợp lệ'); return; }
    const method = prompt('Phương thức thanh toán (ví dụ: cash, card):', 'cash') || 'cash';
    try {
      await api.post(`/invoices/${id}/payments`, { amount, method });
      alert('Thanh toán đã được ghi nhận');
      fetchInvoices();
    } catch (err) {
      console.error('add payment', err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Lỗi khi ghi nhận thanh toán';
      alert(msg);
    }
  };

  return (
    <div className="residents-root">
      <div className="residents-card">
        <h2 className="residents-title">Quản lý Hoá Đơn</h2>

        <form onSubmit={handleSubmit} className="residents-form">
          <select className="input" value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} required>
            <option value="">-- Chọn căn hộ --</option>
            {apartments.map(a => (
              <option key={a._id} value={a._id}>{a.building} - {a.code}</option>
            ))}
          </select>
          <input className="input" placeholder="Tháng" value={form.periodMonth} onChange={e => setForm({ ...form, periodMonth: e.target.value })} required />
          <input className="input" placeholder="Năm" value={form.periodYear} onChange={e => setForm({ ...form, periodYear: e.target.value })} required />
          <input className="input" placeholder="Tổng (VND)" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} />
          <input className="input" type="date" placeholder="Hạn nộp" value={form.dueAt} onChange={e => setForm({ ...form, dueAt: e.target.value })} />
          <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <div style={{ display: 'flex', gap: 8, justifySelf: 'end' }}>
            {editingId ? (
              <>
                <button type="button" className="button secondary" onClick={handleCancel}>Huỷ</button>
                <button className="button">Lưu</button>
              </>
            ) : (
              <button className="button">Tạo hoá đơn</button>
            )}
          </div>
        </form>

        <table className="residents-table">
          <thead>
            <tr>
              <th>Căn hộ</th>
              <th>Kỳ</th>
              <th>Tổng</th>
              <th>Hạn nộp</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id}>
                <td>
                  {inv.apartment
                    ? `${inv.apartment.code || 'Không có mã'}`
                    : 'Chưa gán căn hộ'}
                </td>

                <td>{inv.periodMonth}/{inv.periodYear}</td>
                <td>{inv.total?.toLocaleString?.() ?? inv.total}</td>
                <td>{inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : ''}</td>
                <td>{inv.status}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="button secondary" onClick={() => handleEdit(inv)}>Sửa</button>
                  <button type="button" className="button" style={{ background: 'transparent', color: 'var(--danger)', boxShadow: 'none', border: '1px solid rgba(239,68,68,0.12)' }} onClick={() => handleDelete(inv._id)}>Xoá</button>
                  <button type="button" className="button" style={{ background: 'transparent', color: 'var(--accent)', boxShadow: 'none', border: '1px solid rgba(6,182,212,0.12)' }} onClick={() => handleAddPayment(inv._id)}>Thanh toán</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Invoices;
