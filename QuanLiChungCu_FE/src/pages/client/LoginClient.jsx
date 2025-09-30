import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/client-login.css";

export default function LoginClient() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login-resident", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="client-login-root">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Cổng thông tin cư dân</h2>
        <div className="input-group">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            className="input"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}