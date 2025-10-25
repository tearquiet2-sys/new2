import React, { useState, useEffect } from "react";
// saveReservation artık kullanılmıyor - veriler backend'e kaydediliyor
import { reservationAPI } from "../store/api.js";
import { useNavigate } from "react-router-dom";
import "./ReservationForm.css";

export default function ReservationForm({ lang = "tr" }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkin: "",
    checkout: "",
    guests: "",
    roomType: "standard",
    specialRequests: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const userLogged = sessionStorage.getItem("user_logged");
      const userId = sessionStorage.getItem("user_id");
      const username = sessionStorage.getItem("user_username");
      const userEmail = sessionStorage.getItem("user_email");

      if (userLogged && userId) {
        setIsLoggedIn(true);
        setUserInfo({ id: userId, username });

        // Kullanıcı giriş yapmışsa form verilerini doldur
        setFormData((prev) => ({
          ...prev,
          name: username || "",
          email: userEmail || "",
        }));
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
        // Giriş yapmamışsa formu temizle
        setFormData({
          name: "",
          email: "",
          checkin: "",
          checkout: "",
          guests: "",
          roomType: "standard",
          specialRequests: "",
        });
      }
    };

    checkLoginStatus();

    // Session storage değişikliklerini dinle
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // Sayfa yüklendiğinde de kontrol et
    window.addEventListener("focus", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", checkLoginStatus);
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (!data.checkin || !data.checkout) {
      alert(lang === "tr" ? "Lütfen tarihleri seçin." : "Please select dates.");
      return;
    }

    if (new Date(data.checkin) >= new Date(data.checkout)) {
      alert(
        lang === "tr"
          ? "Çıkış tarihi girişten sonra olmalı."
          : "Checkout must be after check-in."
      );
      return;
    }

    const reservationData = {
      name: data.name,
      email: data.email,
      checkIn: data.checkin,
      checkOut: data.checkout,
      guests: parseInt(data.guests),
      roomType: data.roomType || "standard",
      specialRequests: data.specialRequests || "",
      source: lang === "tr" ? "TR" : "EN",
      createdAt: new Date().toISOString(),
    };

    // Kullanıcı giriş yapmışsa API'ye kaydet
    if (isLoggedIn && userInfo) {
      try {
        reservationData.userId = userInfo.id;
        await reservationAPI.createReservation(reservationData);
        alert(
          lang === "tr"
            ? "Rezervasyon başarıyla oluşturuldu! Rezervasyonlarınızı görüntülemek için yönlendiriliyorsunuz."
            : "Reservation created successfully! You are being redirected to view your reservations."
        );
        navigate("/my-reservations");
      } catch (error) {
        console.error("Rezervasyon oluşturma hatası:", error);
        alert(
          lang === "tr"
            ? "Rezervasyon oluşturulurken hata oluştu: " + error.message
            : "Error creating reservation: " + error.message
        );
      }
    } else {
      // Giriş yapmamışsa giriş sayfasına yönlendir
      alert(
        lang === "tr"
          ? "Rezervasyon yapmak için giriş yapmanız gerekiyor."
          : "You need to login to make a reservation."
      );
      navigate("/user-login");
    }

    form.reset();
  }

  return (
    <form onSubmit={onSubmit}>
      {isLoggedIn && (
        <div className="logged-in-info">
          <p>
            ✅ Giriş yapmış durumdasınız. Rezervasyon bilgileriniz otomatik
            olarak dolduruldu.
          </p>
        </div>
      )}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="checkin">
            {lang === "tr" ? "Giriş Tarihi" : "Check-in"}
          </label>
          <input
            type="date"
            id="checkin"
            name="checkin"
            value={formData.checkin}
            onChange={(e) =>
              setFormData({ ...formData, checkin: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkout">
            {lang === "tr" ? "Çıkış Tarihi" : "Check-out"}
          </label>
          <input
            type="date"
            id="checkout"
            name="checkout"
            value={formData.checkout}
            onChange={(e) =>
              setFormData({ ...formData, checkout: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guests">
            {lang === "tr" ? "Misafir Sayısı" : "Guests"}
          </label>
          <input
            type="number"
            id="guests"
            name="guests"
            min="1"
            max="10"
            value={formData.guests}
            onChange={(e) =>
              setFormData({ ...formData, guests: e.target.value })
            }
            placeholder={lang === "tr" ? "Kaç kişi?" : "How many?"}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomType">
            {lang === "tr" ? "İstenilen Oda" : "Desired Room"}
          </label>
          <select
            id="roomType"
            name="roomType"
            value={formData.roomType}
            onChange={(e) =>
              setFormData({ ...formData, roomType: e.target.value })
            }
            required
          >
            <option value="standard">
              {lang === "tr" ? "Standart Oda" : "Standard Room"}
            </option>
            <option value="deluxe">
              {lang === "tr" ? "Deluxe Oda" : "Deluxe Room"}
            </option>
            <option value="suite">
              {lang === "tr" ? "Suit Oda" : "Suite"}
            </option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">
            {lang === "tr" ? "Ad Soyad" : "Full Name"}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={lang === "tr" ? "Adınızı girin" : "Your name"}
            required
            disabled={isLoggedIn}
            className={isLoggedIn ? "disabled-input" : ""}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">
            {lang === "tr" ? "E-posta Adresi" : "Email"}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder={lang === "tr" ? "E-posta adresiniz" : "Your email"}
            required
            disabled={isLoggedIn}
            className={isLoggedIn ? "disabled-input" : ""}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="specialRequests">
          {lang === "tr" ? "Özel İstekler" : "Special Requests"}
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          rows="3"
          value={formData.specialRequests}
          onChange={(e) =>
            setFormData({ ...formData, specialRequests: e.target.value })
          }
          placeholder={
            lang === "tr"
              ? "Özel isteklerinizi yazın..."
              : "Write your special requests..."
          }
        />
      </div>

      {isLoggedIn && (
        <div className="login-info">
          <p>
            {lang === "tr"
              ? `Giriş yapmış olarak rezervasyon yapıyorsunuz: ${userInfo.username}`
              : `Making reservation as logged in user: ${userInfo.username}`}
          </p>
        </div>
      )}

      <button type="submit" className="btn-reserve">
        {lang === "tr" ? "Rezervasyon Oluştur" : "Create Reservation"}
      </button>
    </form>
  );
}
