import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <div className="app-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">Admin Panel</div>
        <nav className="nav-links">
          <Link to="/admin/dashboard">🏠 Dashboard</Link>
          <Link to="/admin/residents">👥 Cư dân</Link>
          <Link to="/admin/apartments">🏢 Căn hộ</Link>
          <Link to="/admin/invoices">📑 Hóa đơn</Link>
          <Link to="/admin/tickets">📬 Phản ánh</Link>
          <Link to="/admin/notices">📢 Thông báo</Link>
          <Link to="/admin/reports">📊 Báo cáo</Link>
        </nav>
        <button onClick={handleLogout} className="button logout-btn">🚪 Đăng xuất</button>
      </aside>

      <div className="content-area">
        <header className="card" style={{ margin: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Hệ thống quản lý chung cư</h1>
          <div className="muted">Xin chào, Admin 👋</div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
