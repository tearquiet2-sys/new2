import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const MyInfo = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadUserInfo();
  }, []);

  const checkAuth = () => {
    const isLoggedIn = sessionStorage.getItem("user_logged");
    if (!isLoggedIn) {
      navigate("/user-login");
    }
  };

  const loadUserInfo = () => {
    const username = sessionStorage.getItem("user_username");
    const email = sessionStorage.getItem("user_email") || "demo@cicekotel.com";

    setUserInfo({
      username: username || "",
      email: email,
      firstName: sessionStorage.getItem("user_firstName") || "",
      lastName: sessionStorage.getItem("user_lastName") || "",
      phone: sessionStorage.getItem("user_phone") || "",
      address: sessionStorage.getItem("user_address") || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Save to session storage
      sessionStorage.setItem("user_firstName", userInfo.firstName);
      sessionStorage.setItem("user_lastName", userInfo.lastName);
      sessionStorage.setItem("user_phone", userInfo.phone);
      sessionStorage.setItem("user_address", userInfo.address);
      sessionStorage.setItem("user_email", userInfo.email);

      setLoading(false);
      setIsEditing(false);
      alert("Bilgileriniz başarıyla güncellendi!");
    }, 1000);
  };

  const handleCancel = () => {
    loadUserInfo();
    setIsEditing(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="modern-profile-page">
      <div className="profile-container">
        {/* Modern Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">
                {userInfo.firstName
                  ? userInfo.firstName[0]
                  : userInfo.username[0] || "U"}
              </span>
            </div>
            <div className="profile-status">
              <span className="status-dot"></span>
              <span className="status-text">Aktif</span>
            </div>
          </div>
          <div className="profile-title">
            <h1>Hesap Bilgilerim</h1>
            <p className="profile-subtitle">
              Kişisel bilgilerinizi yönetin ve güncelleyin
            </p>
          </div>
          <div className="profile-actions">
            <button
              className="action-btn primary"
              onClick={() => navigate("/my-reservations")}
            >
              <span className="btn-icon">📋</span>
              Rezervasyonlarım
            </button>
            <button className="action-btn secondary" onClick={handleLogout}>
              <span className="btn-icon">🚪</span>
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Modern Content Area */}
        <div className="profile-content">
          {isEditing ? (
            <div className="modern-edit-form">
              <div className="form-header">
                <h2>Bilgilerinizi Düzenleyin</h2>
                <p>Kişisel bilgilerinizi güncelleyin</p>
              </div>

              <div className="form-sections">
                <div className="form-section">
                  <h3>Hesap Bilgileri</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="modern-label">
                        <span className="label-icon">👤</span>
                        Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={userInfo.username}
                        disabled
                        className="modern-input disabled"
                      />
                      <small className="form-hint">
                        Kullanıcı adı değiştirilemez
                      </small>
                    </div>
                    <div className="form-group">
                      <label className="modern-label">
                        <span className="label-icon">📧</span>
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        className="modern-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Kişisel Bilgiler</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="modern-label">
                        <span className="label-icon">👨</span>
                        Ad
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={userInfo.firstName}
                        onChange={handleInputChange}
                        className="modern-input"
                        placeholder="Adınızı girin"
                      />
                    </div>
                    <div className="form-group">
                      <label className="modern-label">
                        <span className="label-icon">👨‍👩‍👧‍👦</span>
                        Soyad
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={userInfo.lastName}
                        onChange={handleInputChange}
                        className="modern-input"
                        placeholder="Soyadınızı girin"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>İletişim Bilgileri</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="modern-label">
                        <span className="label-icon">📱</span>
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleInputChange}
                        className="modern-input"
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="modern-label">
                        <span className="label-icon">📍</span>
                        Adres
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={userInfo.address}
                        onChange={handleInputChange}
                        className="modern-input"
                        placeholder="Adresinizi girin"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="modern-btn success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <span className="btn-icon">{loading ? "⏳" : "💾"}</span>
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button className="modern-btn cancel" onClick={handleCancel}>
                  <span className="btn-icon">❌</span>
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div className="modern-info-display">
              <div className="info-cards">
                <div className="info-card">
                  <div className="card-header">
                    <div className="card-icon">👤</div>
                    <h3>Hesap Bilgileri</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-item">
                      <div className="info-label">
                        <span className="label-icon">👤</span>
                        Kullanıcı Adı
                      </div>
                      <div className="info-value">{userInfo.username}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <span className="label-icon">📧</span>
                        E-posta
                      </div>
                      <div className="info-value">{userInfo.email}</div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-header">
                    <div className="card-icon">👨‍👩‍👧‍👦</div>
                    <h3>Kişisel Bilgiler</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-item">
                      <div className="info-label">
                        <span className="label-icon">👨</span>
                        Ad Soyad
                      </div>
                      <div className="info-value">
                        {userInfo.firstName && userInfo.lastName
                          ? `${userInfo.firstName} ${userInfo.lastName}`
                          : "Belirtilmemiş"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-header">
                    <div className="card-icon">📱</div>
                    <h3>İletişim</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-item">
                      <div className="info-label">
                        <span className="label-icon">📱</span>
                        Telefon
                      </div>
                      <div className="info-value">
                        {userInfo.phone || "Belirtilmemiş"}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <span className="label-icon">📍</span>
                        Adres
                      </div>
                      <div className="info-value">
                        {userInfo.address || "Belirtilmemiş"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="edit-button-container">
                <button
                  className="modern-btn primary large"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="btn-icon">✏️</span>
                  Bilgileri Düzenle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
