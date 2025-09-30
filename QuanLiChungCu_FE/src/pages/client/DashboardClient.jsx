import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/DashboardClient.css";
import { FaUser, FaBuilding, FaFileInvoice, FaBell, FaTicketAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Thg 1', 'Chưa thanh toán': 4000, 'Đã thanh toán': 2400 },
  { name: 'Thg 2', 'Chưa thanh toán': 3000, 'Đã thanh toán': 1398 },
  { name: 'Thg 3', 'Chưa thanh toán': 2000, 'Đã thanh toán': 9800 },
  { name: 'Thg 4', 'Chưa thanh toán': 2780, 'Đã thanh toán': 3908 },
  { name: 'Thg 5', 'Chưa thanh toán': 1890, 'Đã thanh toán': 4800 },
  { name: 'Thg 6', 'Chưa thanh toán': 2390, 'Đã thanh toán': 3800 },
  { name: 'Thg 7', 'Chưa thanh toán': 3490, 'Đã thanh toán': 4300 },
  { name: 'Thg 8', 'Chưa thanh toán': 2000, 'Đã thanh toán': 9800 },
  { name: 'Thg 9', 'Chưa thanh toán': 2780, 'Đã thanh toán': 3908 },
  { name: 'Thg 10', 'Chưa thanh toán': 1890, 'Đã thanh toán': 4800 },
  { name: 'Thg 11', 'Chưa thanh toán': 2390, 'Đã thanh toán': 3800 },
  { name: 'Thg 12', 'Chưa thanh toán': 3490, 'Đã thanh toán': 4300 },
];

export default function DashboardClient() {
  const [apartment, setApartment] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const res = await api.get(`/apartments/${user.apartment}`);
        setApartment(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.apartment) {
      fetchApartment();
    }
  }, [user?.apartment]);

  return (
    <div className="dashboard-client">
      <div className="dashboard-grid-top">
        <div className="dashboard-card">
          <div className="card-header">
            <FaUser className="card-icon" />
            Thông Tin Cư Dân
          </div>
          <div className="card-content">
            <p>
              <strong>Họ và tên:</strong> {user?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {user?.phone}
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <FaBuilding className="card-icon" />
            Chi Tiết Căn Hộ
          </div>
          <div className="card-content">
            {apartment ? (
              <div>
                <p>
                  <strong>Mã căn hộ:</strong> {apartment.code}
                </p>
                <p>
                  <strong>Tòa nhà:</strong> {apartment.building?.name}
                </p>
                <p>
                  <strong>Tầng:</strong> {apartment.floor}
                </p>
                <p>
                  <strong>Diện tích:</strong> {apartment.area} m²
                </p>
              </div>
            ) : (
              <p>Đang tải thông tin căn hộ...</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <FaFileInvoice className="card-icon" />
            Truy Cập Nhanh
          </div>
          <div className="quick-links">
            <Link to="/my-invoices" className="quick-link">
              <FaFileInvoice /> Hóa đơn
            </Link>
            <Link to="/my-notices" className="quick-link">
              <FaBell /> Thông báo
            </Link>
            <Link to="/my-tickets" className="quick-link">
              <FaTicketAlt /> Yêu cầu
            </Link>
          </div>
        </div>
      </div>
      <div className="dashboard-grid-bottom">
        <div className="dashboard-card-full">
            <div className="card-header">
                <h3>Thống Kê Hóa Đơn</h3>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Đã thanh toán" fill="#82ca9d" />
                        <Bar dataKey="Chưa thanh toán" fill="#ff7300" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}