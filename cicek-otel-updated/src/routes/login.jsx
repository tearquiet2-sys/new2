import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../store/api";
import "../styles/admin.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await authAPI.login(username, password);

      // Session storage'a admin bilgisini kaydet
      sessionStorage.setItem("admin_logged", "true");
      sessionStorage.setItem("admin_username", response.user.username);
      sessionStorage.setItem("auth_token", response.token);

      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      alert(`Giriş hatası: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Admin Girişi (Demo)</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Demo: admin / admin123
        </p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
