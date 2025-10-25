import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reservationAPI, authAPI } from "../store/api";
import "../styles/admin.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editForm, setEditForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
    roomType: "",
    specialRequests: "",
  });
  const navigate = useNavigate();

  // Oda fiyatları (TL cinsinden)
  const roomPrices = {
    standard: 500,
    deluxe: 800,
    suite: 1200,
    family: 1000,
  };

  useEffect(() => {
    checkAuth();
    fetchReservations();
  }, []);

  const checkAuth = () => {
    const isLoggedIn = sessionStorage.getItem("user_logged");
    if (!isLoggedIn) {
      navigate("/user-login");
    }
  };

  const fetchReservations = async () => {
    try {
      const userId = sessionStorage.getItem("user_id");
      const response = await reservationAPI.getUserReservations(userId);
      setReservations(response.reservations || []);
    } catch (error) {
      console.error("Rezervasyonları getirme hatası:", error);
      alert("Rezervasyonlar yüklenirken hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Gece sayısını hesapla
  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Rezervasyon fiyatını hesapla
  const calculateReservationPrice = (reservation) => {
    const nights = calculateNights(reservation.checkIn, reservation.checkOut);
    const roomPrice = roomPrices[reservation.roomType] || 500;
    const basePrice = nights * roomPrice;

    // Misafir sayısına göre ek ücret (2'den fazla misafir için gecelik fiyatın %20'si)
    const extraGuests = Math.max(0, reservation.guests - 2);
    const extraGuestFee = extraGuests * (roomPrice * 0.2) * nights;

    return Math.round(basePrice + extraGuestFee);
  };

  // Toplam fiyatı hesapla
  const calculateTotalPrice = () => {
    return reservations.reduce((total, reservation) => {
      return total + calculateReservationPrice(reservation);
    }, 0);
  };

  // Oda tipi Türkçe çevirisi
  const getRoomTypeName = (roomType) => {
    const roomTypes = {
      standard: "Standart Oda",
      deluxe: "Deluxe Oda",
      suite: "Süit Oda",
      family: "Aile Odası",
    };
    return roomTypes[roomType] || roomType;
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation.id);
    setEditForm({
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guests: reservation.guests,
      roomType: reservation.roomType,
      specialRequests: reservation.specialRequests || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await reservationAPI.updateReservation(editingReservation, editForm);
      alert("Rezervasyon başarıyla güncellendi");
      setEditingReservation(null);
      fetchReservations();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Rezervasyon güncellenirken hata oluştu");
    }
  };

  const handleCancelEdit = () => {
    setEditingReservation(null);
    setEditForm({
      checkIn: "",
      checkOut: "",
      guests: "",
      roomType: "",
      specialRequests: "",
    });
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm("Bu rezervasyonu silmek istediğinizden emin misiniz?")) {
      try {
        await reservationAPI.deleteReservation(reservationId);
        alert("Rezervasyon başarıyla silindi");
        fetchReservations();
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Rezervasyon silinirken hata oluştu");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Onaylandı";
      case "pending":
        return "Beklemede";
      case "cancelled":
        return "İptal Edildi";
      default:
        return "Bilinmiyor";
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <h2>Rezervasyonlarım</h2>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Rezervasyonlarınız yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-reservations-page">
      <div className="reservations-container">
        {/* Modern Header */}
        <div className="modern-reservations-header">
          <div className="header-content">
            <div className="header-left">
              <div className="page-icon">
                <span className="icon">📋</span>
              </div>
              <div className="page-title">
                <h1>Rezervasyonlarım</h1>
                <p className="page-subtitle">
                  Hoş geldiniz,{" "}
                  <strong>{sessionStorage.getItem("user_username")}</strong>!
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="modern-btn primary"
                onClick={() => navigate("/")}
              >
                <span className="btn-icon">🏨</span>
                Yeni Rezervasyon
              </button>
              <button className="modern-btn secondary" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="modern-empty-state">
            <div className="empty-icon">📅</div>
            <h3>Henüz rezervasyonunuz bulunmuyor</h3>
            <p>
              İlk rezervasyonunuzu yaparak unutulmaz bir tatil deneyimi yaşayın!
            </p>
            <button
              className="modern-btn primary large"
              onClick={() => navigate("/")}
            >
              <span className="btn-icon">🏨</span>
              Rezervasyon Yap
            </button>
          </div>
        ) : (
          <>
            {/* Modern Fiyat Özeti */}
            <div className="modern-price-summary">
              <div className="summary-card">
                <div className="summary-header">
                  <div className="summary-icon">💰</div>
                  <h3>Fiyat Özeti</h3>
                </div>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="item-icon">📋</div>
                    <div className="item-content">
                      <span className="item-label">Toplam Rezervasyon</span>
                      <span className="item-value">
                        {reservations.length} adet
                      </span>
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="item-icon">🌙</div>
                    <div className="item-content">
                      <span className="item-label">Toplam Gece</span>
                      <span className="item-value">
                        {reservations.reduce(
                          (total, reservation) =>
                            total +
                            calculateNights(
                              reservation.checkIn,
                              reservation.checkOut
                            ),
                          0
                        )}{" "}
                        gece
                      </span>
                    </div>
                  </div>
                  <div className="summary-item total">
                    <div className="item-icon">💎</div>
                    <div className="item-content">
                      <span className="item-label">Toplam Tutar</span>
                      <span className="item-value">
                        ₺{calculateTotalPrice().toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Modern Rezervasyon Listesi */}
            <div className="modern-reservations-grid">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="modern-reservation-card">
                  {editingReservation === reservation.id ? (
                    <div className="modern-edit-form">
                      <div className="edit-header">
                        <h4>✏️ Rezervasyon Düzenle</h4>
                      </div>
                      <div className="edit-form-grid">
                        <div className="form-group">
                          <label className="modern-label">
                            <span className="label-icon">📅</span>
                            Giriş Tarihi
                          </label>
                          <input
                            type="date"
                            value={editForm.checkIn}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                checkIn: e.target.value,
                              })
                            }
                            className="modern-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="modern-label">
                            <span className="label-icon">📅</span>
                            Çıkış Tarihi
                          </label>
                          <input
                            type="date"
                            value={editForm.checkOut}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                checkOut: e.target.value,
                              })
                            }
                            className="modern-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="modern-label">
                            <span className="label-icon">👥</span>
                            Misafir Sayısı
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.guests}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                guests: e.target.value,
                              })
                            }
                            className="modern-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="modern-label">
                            <span className="label-icon">🏨</span>
                            Oda Tipi
                          </label>
                          <select
                            value={editForm.roomType}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                roomType: e.target.value,
                              })
                            }
                            className="modern-input"
                          >
                            <option value="standard">Standart Oda</option>
                            <option value="deluxe">Deluxe Oda</option>
                            <option value="suite">Süit Oda</option>
                            <option value="family">Aile Odası</option>
                          </select>
                        </div>
                        <div className="form-group full-width">
                          <label className="modern-label">
                            <span className="label-icon">💬</span>
                            Özel İstekler
                          </label>
                          <textarea
                            value={editForm.specialRequests}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                specialRequests: e.target.value,
                              })
                            }
                            rows="3"
                            className="modern-input"
                            placeholder="Özel isteklerinizi yazın..."
                          />
                        </div>
                      </div>
                      <div className="edit-actions">
                        <button
                          className="modern-btn success"
                          onClick={handleSaveEdit}
                        >
                          <span className="btn-icon">💾</span>
                          Kaydet
                        </button>
                        <button
                          className="modern-btn cancel"
                          onClick={handleCancelEdit}
                        >
                          <span className="btn-icon">❌</span>
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="card-content">
                      {/* Card Header */}
                      <div className="card-header">
                        <div className="reservation-info">
                          <div className="reservation-number">
                            <span className="number-icon">#</span>
                            <span className="number">{reservation.id}</span>
                          </div>
                          <div className="reservation-status">
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: getStatusColor(
                                  reservation.status
                                ),
                              }}
                            >
                              {getStatusText(reservation.status)}
                            </span>
                          </div>
                        </div>
                        <div className="reservation-price">
                          <span className="price-amount">
                            ₺
                            {calculateReservationPrice(
                              reservation
                            ).toLocaleString("tr-TR")}
                          </span>
                          <span className="price-label">Toplam</span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="card-details">
                        <div className="detail-grid">
                          <div className="detail-item">
                            <div className="detail-icon">📅</div>
                            <div className="detail-content">
                              <span className="detail-label">Giriş</span>
                              <span className="detail-value">
                                {formatDate(reservation.checkIn)}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">📅</div>
                            <div className="detail-content">
                              <span className="detail-label">Çıkış</span>
                              <span className="detail-value">
                                {formatDate(reservation.checkOut)}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">👥</div>
                            <div className="detail-content">
                              <span className="detail-label">Misafir</span>
                              <span className="detail-value">
                                {reservation.guests} kişi
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">🏨</div>
                            <div className="detail-content">
                              <span className="detail-label">Oda</span>
                              <span className="detail-value">
                                {getRoomTypeName(reservation.roomType)}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">🌙</div>
                            <div className="detail-content">
                              <span className="detail-label">Gece</span>
                              <span className="detail-value">
                                {calculateNights(
                                  reservation.checkIn,
                                  reservation.checkOut
                                )}{" "}
                                gece
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">💰</div>
                            <div className="detail-content">
                              <span className="detail-label">Gecelik</span>
                              <span className="detail-value">
                                ₺{roomPrices[reservation.roomType] || 500}
                              </span>
                            </div>
                          </div>
                        </div>

                        {reservation.specialRequests && (
                          <div className="special-requests">
                            <div className="requests-header">
                              <span className="requests-icon">💬</span>
                              <span className="requests-label">
                                Özel İstekler
                              </span>
                            </div>
                            <p className="requests-text">
                              {reservation.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="card-actions">
                        <button
                          className="modern-btn primary"
                          onClick={() => handleEdit(reservation)}
                        >
                          <span className="btn-icon">✏️</span>
                          Düzenle
                        </button>
                        <button
                          className="modern-btn danger"
                          onClick={() => handleDelete(reservation.id)}
                        >
                          <span className="btn-icon">🗑️</span>
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
