import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/residents.css";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function toCSV(rows) {
  if (!rows || !rows.length) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const lines = rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','));
  return [header, ...lines].join('\n');
}

export default function Reports(){
  const [tab, setTab] = useState('revenue');
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [revenue, setRevenue] = useState(null);
  const [aging, setAging] = useState([]);

  const fetchRevenue = async () => {
    try{
      const res = await api.get(`/reports/revenue?month=${month}&year=${year}`);
      setRevenue(res.data);
    }catch(err){ console.error('fetchRevenue', err); alert(err?.response?.data?.error || err.message || 'Lỗi'); }
  }

  const fetchAging = async () => {
    try{ const res = await api.get('/reports/aging'); setAging(res.data || []); } catch(err){ console.error('fetchAging', err); alert('Lỗi'); }
  }

  useEffect(()=>{ if(tab==='revenue') fetchRevenue(); else fetchAging(); }, [tab]);

  return (
    <div className="residents-root">
      <div className="residents-card">
        <h2 className="residents-title">Báo cáo</h2>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <button className={`button ${tab==='revenue'?'':'secondary'}`} onClick={()=>setTab('revenue')}>Doanh thu</button>
          <button className={`button ${tab==='aging'?'':'secondary'}`} onClick={()=>setTab('aging')}>Aging (Quá hạn)</button>
        </div>

        {tab==='revenue' ? (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              <input className="input" value={month} onChange={e=>setMonth(e.target.value)} style={{ width:120 }} />
              <input className="input" value={year} onChange={e=>setYear(e.target.value)} style={{ width:120 }} />
              <button className="button" onClick={fetchRevenue}>Tải</button>
              {revenue && <button className="button" onClick={()=>{ const csv = toCSV([revenue]); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `revenue_${month}_${year}.csv`; a.click(); URL.revokeObjectURL(url); }}>Export CSV</button>}
            </div>
            {revenue ? (
              <div>
                    <p>Tháng: {revenue.month}/{revenue.year}</p>
                    <p>Tổng doanh thu: {revenue.totalRevenue?.toLocaleString?.()}</p>
                    <p>Đã thu: {revenue.totalPaid?.toLocaleString?.()}</p>
                    <p>Chưa thu: {revenue.totalUnpaid?.toLocaleString?.()}</p>
                    <div style={{ maxWidth: 700, marginTop: 18 }}>
                      <Bar
                        data={{
                          labels: ['Tổng doanh thu', 'Đã thu', 'Chưa thu'],
                          datasets: [{
                            label: `Doanh thu ${revenue.month}/${revenue.year}`,
                            data: [revenue.totalRevenue || 0, revenue.totalPaid || 0, revenue.totalUnpaid || 0],
                            backgroundColor: ['#4f46e5', '#06b6d4', '#ef4444']
                          }]
                        }}
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } }
                        }}
                      />
                    </div>
              </div>
            ) : <p>Chưa có dữ liệu</p>}
          </div>
        ) : (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              <button className="button" onClick={fetchAging}>Tải</button>
              <button className="button" onClick={()=>{ const csv = toCSV(aging); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `aging.csv`; a.click(); URL.revokeObjectURL(url); }}>Export CSV</button>
            </div>
            <table className="residents-table">
              <thead>
                <tr>
                  <th>Căn hộ</th>
                  <th>Kỳ</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                  <th>Ngày quá hạn</th>
                </tr>
              </thead>
              <tbody>
                {aging.map((a, i)=> (
                  <tr key={i}>
                    <td>{a.apartment}</td>
                    <td>{a.month}/{a.year}</td>
                    <td>{a.total?.toLocaleString?.()}</td>
                    <td>{a.status}</td>
                    <td>{a.daysOverdue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
