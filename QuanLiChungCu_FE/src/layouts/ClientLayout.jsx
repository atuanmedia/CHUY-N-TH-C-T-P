import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/client/Footer';
import { FaBell, FaFileInvoice, FaTicketAlt, FaUser, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import '../styles/ClientLayout.css';

const ClientLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? 'client-nav-link active' : 'client-nav-link';
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="client-layout">
      <header className="client-topbar">
        <a href="/dashboard" className="client-topbar-brand">Cư Dân</a>
        <nav className="client-nav">
          <NavLink to="/dashboard" className={getNavLinkClass}>
            <FaTachometerAlt />
            <span>Bảng điều khiển</span>
          </NavLink>
          <NavLink to="/my-notices" className={getNavLinkClass}>
            <FaBell />
            <span>Thông báo</span>
          </NavLink>
          <NavLink to="/my-invoices" className={getNavLinkClass}>
            <FaFileInvoice />
            <span>Hóa đơn</span>
          </NavLink>
          <NavLink to="/my-tickets" className={getNavLinkClass}>
            <FaTicketAlt />
            <span>Yêu cầu</span>
          </NavLink>
        </nav>
        <div className="client-header-right">
          <div className="welcome-message">Chào mừng, {user?.fullName}!</div>
          <div className="user-profile">
            <FaUser />
            <span>{user?.fullName}</span>
          </div>
          <button onClick={handleLogout} className="client-logout-button">
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      <main className="client-main">
        <Outlet />
      </main>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ClientLayout;