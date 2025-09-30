import { Link, Outlet, useNavigate } from "react-router-dom";
import "../../styles/AdminLayout.css";
import Footer from "../client/Footer";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="brand">Admin Panel</div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/residents">Cư dân</Link>
          <Link to="/admin/apartments">Căn hộ</Link>
          <Link to="/admin/invoices">Hóa đơn</Link>
          <Link to="/admin/tickets">Phản ánh</Link>
          <Link to="/admin/notices">Thông báo</Link>
          <Link to="/admin/reports">Báo cáo</Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AdminLayout;