import React, { useEffect } from "react";
import ReservationForm from "./ReservationForm.jsx";
import "./Hero.css";

export default function Hero({ title, subtitle, lang = "tr" }) {
  useEffect(() => {
    const handler = (e) => {
      const currency = e.detail?.currency || "TL";
      document.querySelectorAll(".room-price")?.forEach((el) => {
        const tl = el.getAttribute("data-price-tl");
        const eur = el.getAttribute("data-price-eur");

        if (currency === "EUR") {
          el.textContent = `€${Number(eur).toLocaleString("de-DE")} / night`;
        } else {
          el.textContent = `₺${Number(tl).toLocaleString("tr-TR")} / gece`;
        }
      });
    };
    window.addEventListener("currency:toggle", handler);
    return () => window.removeEventListener("currency:toggle", handler);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="reservation-form" id="reservation">
          <ReservationForm lang={lang} />
        </div>
      </div>
    </section>
  );
}
