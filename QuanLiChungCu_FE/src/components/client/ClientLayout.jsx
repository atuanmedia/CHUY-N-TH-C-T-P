import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../styles/ClientLayout.css";
import { FaTachometerAlt, FaFileInvoice, FaBell, FaTicketAlt, FaSignOutAlt } from "react-icons/fa";

export default function ClientLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="client-layout">
      <aside className="client-sidebar">
        <div className="client-sidebar-header">
          <h1 className="client-sidebar-title">Cư dân</h1>
          <p className="client-sidebar-user">Chào, {user?.fullName || "Khách"}</p>
        </div>
        <nav className="client-nav">
          <NavLink to="/dashboard" className="client-nav-link"><FaTachometerAlt /> Bảng điều khiển</NavLink>
          <NavLink to="my-invoices" className="client-nav-link"><FaFileInvoice /> Hóa đơn của tôi</NavLink>
          <NavLink to="my-notices" className="client-nav-link"><FaBell /> Thông báo</NavLink>
          <NavLink to="my-tickets" className="client-nav-link"><FaTicketAlt /> Yêu cầu</NavLink>
        </nav>
        <button onClick={handleLogout} className="client-logout-button">
          <FaSignOutAlt /> Đăng xuất
        </button>
      </aside>
      <main className="client-main">
        <Outlet />
      </main>
    </div>
  );
}