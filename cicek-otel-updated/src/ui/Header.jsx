import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ lang = "tr" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();

    // Dropdown dışına tıklandığında kapat
    const handleClickOutside = (event) => {
      if (isAccountDropdownOpen && !event.target.closest(".account-dropdown")) {
        setIsAccountDropdownOpen(false);
      }
    };

    // Session storage değişikliklerini dinle
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", checkLoginStatus);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", checkLoginStatus);
    };
  }, [isAccountDropdownOpen]);

  const checkLoginStatus = () => {
    const userLogged = sessionStorage.getItem("user_logged");
    const userId = sessionStorage.getItem("user_id");
    const username = sessionStorage.getItem("user_username");

    if (userLogged && userId) {
      setIsLoggedIn(true);
      setUserInfo({ id: userId, username });
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsAccountDropdownOpen(false);
    navigate("/");
  };

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

  const handleAboutClick = () => {
    navigate("/hakkimizda");
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleLogoClick = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const translations = {
    tr: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      rooms: "Odalarımız",
      amenities: "Olanaklarımız",
      contact: "İletişim",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      myAccount: "Hesabım",
      myReservations: "Rezervasyonlarım",
      myInfo: "Bilgilerim",
      logout: "Çıkış Yap",
      language: "Dil",
    },
    en: {
      home: "Home",
      about: "About",
      rooms: "Our Rooms",
      amenities: "Amenities",
      contact: "Contact",
      login: "Login",
      register: "Register",
      myAccount: "My Account",
      myReservations: "My Reservations",
      myInfo: "My Info",
      logout: "Logout",
      language: "Language",
    },
  };

  const t = translations[lang] || translations.tr;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <button onClick={handleLogoClick} className="logo">
            <span className="logo-text">Çiçek Otel</span>
          </button>

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <button
              onClick={handleAboutClick}
              className="nav-link section-link"
            >
              {t.about}
            </button>
            <button
              onClick={() => handleSectionClick("rooms")}
              className="nav-link section-link"
            >
              {t.rooms}
            </button>
            <button
              onClick={() => handleSectionClick("amenities")}
              className="nav-link section-link"
            >
              {t.amenities}
            </button>
            <button
              onClick={() => handleSectionClick("contact")}
              className="nav-link section-link"
            >
              {t.contact}
            </button>
          </nav>

          <div className="header-actions">
            <div className="language-switcher">
              <Link to="/" className={lang === "tr" ? "active" : ""}>
                TR
              </Link>
              <Link to="/home-en" className={lang === "en" ? "active" : ""}>
                EN
              </Link>
            </div>

            {isLoggedIn ? (
              <div className="account-dropdown">
                <button onClick={toggleAccountDropdown} className="account-btn">
                  👤 {userInfo?.username || t.myAccount}
                  <span className="dropdown-arrow">▼</span>
                </button>
                {isAccountDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/my-reservations"
                      className="dropdown-item"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      📋 {t.myReservations}
                    </Link>
                    <Link
                      to="/my-info"
                      className="dropdown-item"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      👤 {t.myInfo}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      🚪 {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/user-login" className="login-btn">
                {t.login}
              </Link>
            )}

            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
