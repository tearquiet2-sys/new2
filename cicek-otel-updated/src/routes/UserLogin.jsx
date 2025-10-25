import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../store/api";
import "../styles/admin.css";

const UserLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(
        formData.username,
        formData.password
      );

      // Kullanıcı bilgilerini session storage'a kaydet
      sessionStorage.setItem("user_logged", "true");
      sessionStorage.setItem("user_id", response.user.id);
      sessionStorage.setItem("user_username", response.user.username);
      sessionStorage.setItem("user_email", response.user.email);
      sessionStorage.setItem("auth_token", response.token);

      alert(`Hoş geldiniz, ${response.user.username}!`);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert(`Giriş hatası: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(
        formData.username,
        formData.email,
        formData.password
      );

      // Kullanıcı bilgilerini session storage'a kaydet
      sessionStorage.setItem("user_logged", "true");
      sessionStorage.setItem("user_id", response.user.id);
      sessionStorage.setItem("user_username", response.user.username);
      sessionStorage.setItem("user_email", response.user.email);
      sessionStorage.setItem("auth_token", response.token);

      alert(`Kayıt başarılı! Hoş geldiniz, ${response.user.username}!`);
      navigate("/");
    } catch (error) {
      console.error("Register error:", error);
      alert(`Kayıt hatası: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="auth-tabs">
          <button
            className={`tab-button ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Giriş Yap
          </button>
          <button
            className={`tab-button ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Kayıt Ol
          </button>
        </div>

        <h2>{isLogin ? "Giriş Yap" : "Kayıt Ol"}</h2>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>E-posta</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Şifre Tekrar</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "İşleniyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}
            <button
              type="button"
              className="link-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Kayıt olun" : "Giriş yapın"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
