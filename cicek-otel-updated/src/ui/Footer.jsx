import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer({ lang = "tr" }) {
  const t = (tr, en) => (lang === "tr" ? tr : en);
  const navigate = useNavigate();

  const handleSectionClick = (sectionId) => {
    // Ana sayfaya yönlendir
    navigate("/");
    // Sayfa yüklendikten sonra scroll yap
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Header yüksekliğini hesaba katarak scroll yap
        const headerHeight = 70;
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }, 200);
  };

  const handleReservationClick = () => {
    // Ana sayfaya yönlendir ve rezervasyon formuna scroll yap
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("reservation");
      if (element) {
        const headerHeight = 70;
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }, 200);
  };
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>{t("İletişim", "Contact")}</h3>
          <p>
            📍 Çiçek Mahallesi, Gül Sokak No:123
            <br />
            {t("Beşiktaş/İstanbul", "Besiktas/Istanbul")}
          </p>
          <p>📞 +90 212 555 0123</p>
          <p>✉️ info@cicekotel.com</p>
        </div>
        <div className="footer-section">
          <h3>{t("Hızlı Linkler", "Quick Links")}</h3>
          <p>
            <Link to="/hakkimizda">{t("Hakkımızda", "About")}</Link>
          </p>
          <p>
            <button
              onClick={() => handleSectionClick("rooms")}
              className="footer-link"
            >
              {t("Odalarımız", "Rooms")}
            </button>
          </p>
          <p>
            <button onClick={handleReservationClick} className="footer-link">
              {t("Rezervasyon", "Reservation")}
            </button>
          </p>
          <p>
            <button
              onClick={() => handleSectionClick("amenities")}
              className="footer-link"
            >
              {t("Olanaklarımız", "Amenities")}
            </button>
          </p>
          <p>
            <button
              onClick={() => handleSectionClick("contact")}
              className="footer-link"
            >
              {t("İletişim", "Contact")}
            </button>
          </p>
        </div>
        <div className="footer-section">
          <h3>{t("Sosyal Medya", "Social")}</h3>
          <p>
            <a href="#">Facebook</a>
          </p>
          <p>
            <a href="#">Twitter</a>
          </p>
          <p>
            <a href="#">Instagram</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2025 {t("Çiçek Otel", "Flower Hotel")}.{" "}
          {t("Tüm hakları saklıdır.", "All rights reserved.")}
        </p>
      </div>
    </footer>
  );
}
