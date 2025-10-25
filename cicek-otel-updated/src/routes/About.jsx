import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../ui/Header.jsx";
import Footer from "../ui/Footer.jsx";
import "../styles/about.css";

export default function About() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // Ana sayfaya yönlendir ve sonra bölüme scroll yap
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      <Header lang="tr" />
      <section className="about-hero">
        <h1>Hakkımızda</h1>
      </section>
      <main className="about-container">
        <section className="about-section">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=600&fit=crop"
            alt="Çiçek Otel"
          />
          <div>
            <h2>Çiçek Otel'e Hoşgeldiniz</h2>
            <p>
              Çiçek Otel, zarif çiçek teması ve misafirperverliği ile
              misafirlerine sıcak bir konaklama deneyimi sunar. 2010 yılından
              beri İstanbul'un kalbinde hizmet veren otelimiz, modern konforu
              geleneksel Türk misafirperverliği ile buluşturuyor.
            </p>
          </div>
        </section>
        <section className="about-section">
          <div>
            <h2>Misyonumuz</h2>
            <p>
              Misafirlerimize her zaman samimi, konforlu ve güvenli bir ortam
              sunmak. Her detayda mükemmellik arayışımız ve misafir
              memnuniyetini ön planda tutan yaklaşımımızla, unutulmaz anılar
              yaratmayı hedefliyoruz.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1559599101-f09722fb4948?w=900&h=600&fit=crop"
            alt="Misyonumuz"
          />
        </section>
        <section className="about-section">
          <img
            src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=600&fit=crop"
            alt="Vizyonumuz"
          />
          <div>
            <h2>Vizyonumuz</h2>
            <p>
              Konaklama deneyimini estetik ve doğa ile buluşturarak, bölgenin en
              sevilen butik otellerinden biri olmak. Sürdürülebilir turizm
              anlayışı ile çevreye saygılı, sosyal sorumluluk bilinci yüksek bir
              işletme olmayı amaçlıyoruz.
            </p>
          </div>
        </section>
      </main>
      <Footer lang="tr" />
    </>
  );
}
