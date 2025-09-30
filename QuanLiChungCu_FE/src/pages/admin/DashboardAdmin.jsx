import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/dashboard.css";

function DashboardAdmin() {
  const [stats, setStats] = useState([
    { id: 1, label: "Căn hộ", value: 0 },
    { id: 2, label: "Cư dân", value: 0 },
    { id: 3, label: "Dịch vụ", value: 1 },
    { id: 4, label: "Phản ánh", value: 0 },
  ]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apartmentsRes, residentsRes, invoicesRes, ticketsRes] = await Promise.all([
          api.get('/apartments'),
          api.get('/residents'),
          api.get('/invoices'),
          api.get('/tickets')
        ]);

        setStats([
          { id: 1, label: "Căn hộ", value: apartmentsRes.data?.length || 0 },
          { id: 2, label: "Cư dân", value: residentsRes.data?.length || 0 },
          { id: 3, label: "Dịch vụ", value: 1 }, // Tạm thời
          { id: 4, label: "Phản ánh", value: ticketsRes.data?.length || 0 },
        ]);

        // Lấy 5 hóa đơn mới nhất
        const invoices = Array.isArray(invoicesRes.data) 
          ? invoicesRes.data 
          : invoicesRes.data?.invoices || [];
        setRecentInvoices(invoices.slice(0, 5));

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-layout-content">
      <h2 className="card-title">Tổng quan</h2>

      <div className="dashboard-cards">
        {stats.map((s) => (
          <div className="card" key={s.id}>
            <div className="dashboard-card-left">
              <div className="dashboard-value">{s.value}</div>
              <div className="dashboard-label">{s.label}</div>
            </div>
            <div className="dashboard-avatar">{s.label.charAt(0)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="card-title">Hóa đơn gần đây</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Căn hộ</th>
                <th>Kỳ</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv._id}>
                  <td>{inv.apartment?.code}</td>
                  <td>{inv.periodMonth}/{inv.periodYear}</td>
                  <td>{inv.total?.toLocaleString()}</td>
                  <td><span className={`tag ${inv.status}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;