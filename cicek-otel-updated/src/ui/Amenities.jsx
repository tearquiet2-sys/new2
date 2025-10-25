import React from "react";
import "./Amenities.css";

export default function Amenities({ lang = "tr" }) {
  const t = (tr, en) => (lang === "tr" ? tr : en);
  return (
    <section className="amenities">
      <div className="container">
        <div id="rooms">
          <h2 className="section-title">{t("Odalarımız", "Rooms")}</h2>
        </div>
        <div className="amenities-grid" style={{ marginBottom: "3rem" }}>
          <div className="amenity-card">
            <img
              className="amenity-image"
              alt="Standard"
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop"
            />
            <div className="amenity-icon">🛏️</div>
            <h3>{t("Normal Oda", "Standard Room")}</h3>
            <p>
              {t(
                "Konforlu yatak ve temel olanaklarla ekonomik konaklama.",
                "Comfortable bed and essential amenities for an economic stay."
              )}
            </p>
            <p className="room-price" data-price-tl="1200" data-price-eur="40">
              {lang === "tr" ? "₺1,200 / gece" : "€40 / night"}
            </p>
          </div>
          <div className="amenity-card">
            <img
              className="amenity-image"
              alt="Family"
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop"
            />
            <div className="amenity-icon">👨‍👩‍👧‍👦</div>
            <h3>{t("Aile Odası", "Family Room")}</h3>
            <p>
              {t(
                "Geniş metrekare ve çocuk dostu alanlarla aileler için ideal.",
                "Spacious and child-friendly layout ideal for families."
              )}
            </p>
            <p className="room-price" data-price-tl="2200" data-price-eur="75">
              {lang === "tr" ? "₺2,200 / gece" : "€75 / night"}
            </p>
          </div>
          <div className="amenity-card">
            <img
              className="amenity-image"
              alt="Suite"
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop"
            />
            <div className="amenity-icon">✨</div>
            <h3>{t("Suit Odası", "Suite")}</h3>
            <p>
              {t(
                "Ayrı oturma alanı ve premium olanaklarla lüks deneyim.",
                "Separate living area and premium amenities for a luxury experience."
              )}
            </p>
            <p className="room-price" data-price-tl="3500" data-price-eur="120">
              {lang === "tr" ? "₺3,500 / gece" : "€120 / night"}
            </p>
          </div>
        </div>

        <div id="amenities">
          <h2 className="section-title">{t("Olanaklarımız", "Amenities")}</h2>
        </div>
        <div className="amenities-grid">
          <AmenCard
            icon="🍽️"
            title={t("Gurme Restoran", "Gourmet Restaurant")}
            desc={t(
              "Dünya mutfağından lezzetler sunan uzman şeflerimizle unutulmaz bir gastronomi deneyimi yaşayın.",
              "World cuisine by expert chefs."
            )}
            img="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop"
          />
          <AmenCard
            icon="🧖‍♀️"
            title="Spa & Hammam"
            desc={t(
              "Geleneksel Türk hamamı ve modern spa hizmetleriyle tamamen rahatlayın ve yenilenin.",
              "Relax and rejuvenate with traditional Turkish bath."
            )}
            img="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=200&fit=crop"
          />
          <AmenCard
            icon="🏋️‍♂️"
            title={t("Spor Salonu", "Gym")}
            desc={t(
              "Modern ekipmanlarla donatılmış fitness merkezimizde sağlıklı yaşamınızı sürdürün.",
              "Keep fit with modern equipment."
            )}
            img="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
          />
          <AmenCard
            icon="🚗"
            title={t("Valet Park", "Valet Parking")}
            desc={t(
              "Ücretsiz valet park hizmetimizle aracınızın güvenliğini biz sağlıyoruz.",
              "Complimentary valet parking service."
            )}
            img="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop"
          />
          <AmenCard
            icon="📶"
            title="WiFi"
            desc={t(
              "Tüm otel genelinde hızlı ve güvenli internet bağlantısından ücretsiz yararlanın.",
              "Fast and secure internet throughout the hotel."
            )}
            img="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop"
          />
          <AmenCard
            icon="🏊‍♂️"
            title={t("Yüzme Havuzu", "Swimming Pool")}
            desc={t(
              "Yıl boyunca kullanabileceğiniz kapalı ve açık yüzme havuzlarımızda serinleyin.",
              "Indoor and outdoor pools all year round."
            )}
            img="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop"
          />
        </div>
      </div>
    </section>
  );
}

function AmenCard({ icon, title, desc, img }) {
  return (
    <div className="amenity-card">
      <img className="amenity-image" alt={title} src={img} />
      <div className="amenity-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
