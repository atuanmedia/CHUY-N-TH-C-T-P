import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/admin-login.css";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className="admin-login-root">
      <form onSubmit={handleLogin} className="admin-login-card">
        <div className="admin-login-icon">🔐</div>
        <h2 className="admin-login-title">Admin Login</h2>
        <p className="admin-login-subtitle">Quản lý hệ thống hiệu quả</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-login-input"
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-login-input"
          required
        />

        <button type="submit" className="admin-login-button">Đăng nhập</button>
        <p className="admin-login-note">Vui lòng đăng nhập để truy cập hệ thống quản trị.</p>
      </form>
    </div>
  );
}

export default LoginAdmin;
