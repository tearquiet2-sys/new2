import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reservationAPI, adminAPI } from "../store/api";
import "../styles/admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // Admin giriş kontrolü
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("admin_logged");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  // Verileri yükle
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [reservationsRes, dashboardRes] = await Promise.all([
        reservationAPI.getReservations(),
        adminAPI.getDashboard(),
      ]);

      setReservations(reservationsRes.data);
      setDashboard(dashboardRes.data);
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  const handleClearAll = async () => {
    if (
      window.confirm("Tüm rezervasyonları silmek istediğinizden emin misiniz?")
    ) {
      try {
        await adminAPI.clearReservations();
        setReservations([]);
        alert("Tüm rezervasyonlar temizlendi!");
      } catch (error) {
        console.error("Temizleme hatası:", error);
        alert("Rezervasyonlar temizlenirken hata oluştu!");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu rezervasyonu silmek istediğinizden emin misiniz?")) {
      try {
        await reservationAPI.deleteReservation(id);
        setReservations(reservations.filter((res) => res.id !== id));
        alert("Rezervasyon silindi!");
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Rezervasyon silinirken hata oluştu!");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged");
    sessionStorage.removeItem("admin_username");
    navigate("/login");
  };

  // Rezervasyon onaylama
  const handleApproveReservation = async (reservationId) => {
    try {
      await adminAPI.approveReservation(reservationId);
      // Rezervasyon durumunu güncelle
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: "confirmed" } : res
        )
      );
      alert("Rezervasyon onaylandı!");
    } catch (err) {
      console.error("Onaylama hatası:", err);
      alert("Rezervasyon onaylanırken bir hata oluştu!");
    }
  };

  // Rezervasyon reddetme
  const handleRejectReservation = async (reservationId) => {
    if (
      window.confirm("Bu rezervasyonu reddetmek istediğinizden emin misiniz?")
    ) {
      try {
        await adminAPI.rejectReservation(reservationId);
        // Rezervasyon durumunu güncelle
        setReservations((prev) =>
          prev.map((res) =>
            res.id === reservationId ? { ...res, status: "cancelled" } : res
          )
        );
        alert("Rezervasyon reddedildi!");
      } catch (err) {
        console.error("Reddetme hatası:", err);
        alert("Rezervasyon reddedilirken bir hata oluştu!");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "🔴";
      case "pending":
        return "🟡";
      case "cancelled":
        return "⚫";
      default:
        return "🟡";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Onaylandı";
      case "pending":
        return "Beklemede";
      case "cancelled":
        return "İptal";
      default:
        return "Beklemede";
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Admin Paneli</h1>
        </div>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Paneli</h1>
        <div className="admin-actions">
          <button onClick={handleRefresh} className="action-btn refresh-btn">
            🔄 Yenile
          </button>
          <button onClick={handleClearAll} className="action-btn clear-btn">
            🗑️ Tümünü Temizle
          </button>
          <button onClick={handleLogout} className="action-btn logout-btn">
            🚪 Çıkış
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>Toplam Rezervasyon: {reservations.length}</p>
      </div>

      <table className="reservation-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Müşteri Adı</th>
            <th>E-posta</th>
            <th>Giriş Tarihi</th>
            <th>Çıkış Tarihi</th>
            <th>Misafir Sayısı</th>
            <th>Oda Tipi</th>
            <th>Durum</th>
            <th>Kayıt Tarihi</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                Henüz rezervasyon bulunmuyor.
              </td>
            </tr>
          ) : (
            reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.name}</td>
                <td>{res.email}</td>
                <td>{res.check_in}</td>
                <td>{res.check_out}</td>
                <td>{res.guests}</td>
                <td>
                  {res.room_type === "standard"
                    ? "Standart"
                    : res.room_type === "deluxe"
                    ? "Deluxe"
                    : res.room_type === "suite"
                    ? "Suit"
                    : res.room_type === "family"
                    ? "Aile Odası"
                    : res.room_type}
                </td>
                <td>
                  <div className="status-container">
                    <span className="status-icon">
                      {getStatusIcon(res.status)}
                    </span>
                    <span className="status-text" data-status={res.status}>
                      {getStatusText(res.status)}
                    </span>
                  </div>
                </td>
                <td>{new Date(res.created_at).toLocaleDateString("tr-TR")}</td>
                <td>
                  <div className="action-buttons">
                    {res.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApproveReservation(res.id)}
                          className="action-btn approve-btn"
                          title="Onayla"
                        >
                          ✅ Onayla
                        </button>
                        <button
                          onClick={() => handleRejectReservation(res.id)}
                          className="action-btn reject-btn"
                          title="Reddet"
                        >
                          ❌ Reddet
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="action-btn delete-btn"
                      title="Sil"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
