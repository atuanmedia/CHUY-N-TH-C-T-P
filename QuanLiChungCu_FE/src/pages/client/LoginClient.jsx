import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "client");
      navigate("/client/dashboard");
    } catch (err) {
      alert("Client login failed");
    }
  };

  return (
    <div className="center" style={{ minHeight: '80vh', padding: 24 }}>
      <form onSubmit={handleLogin} className="card" style={{ width: 420 }}>
        <h1 style={{ marginBottom: 12, fontSize: 18, fontWeight: 700 }}>Client Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          style={{ marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          style={{ marginBottom: 10 }}
        />
        <button className="button" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
}

export default LoginClient;
