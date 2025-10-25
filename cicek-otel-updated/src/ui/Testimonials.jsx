import React from "react";
import "./Testimonials.css";

export default function Testimonials({ lang = "tr" }) {
  const t = (tr, en) => (lang === "tr" ? tr : en);
  const people = [
    {
      name: "Ahmet Yılmaz",
      city: "İstanbul",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      text: t(
        "Çiçek Otel'de harika bir konaklama deneyimi yaşadık. Odalar çok temiz ve konforlu, personel çok ilgili ve yardımsever. Kesinlikle tekrar geleceğiz!",
        "We had a wonderful stay at Flower Hotel. The rooms were very clean and comfortable, the staff was very attentive and helpful. We will definitely come again!"
      ),
    },
    {
      name: "Ayşe Demir",
      city: "Ankara",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
      text: t(
        "Spa hizmetleri gerçekten mükemmeldi. Masaj terapistleri çok profesyonel, ortam çok huzurlu. Kendimi çok dinlenmiş hissettim.",
        "The spa services were truly excellent. The massage therapists were very professional, the atmosphere was very peaceful. I felt very refreshed."
      ),
    },
    {
      name: "Mehmet Kaya",
      city: "İzmir",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      text: t(
        "Restoranın lezzetleri harika! Özellikle Türk mutfağı yemekleri çok lezzetliydi. Kahvaltı çeşitliliği de çok iyiydi.",
        "The restaurant's flavors were amazing! Especially the Turkish cuisine dishes were very delicious. The breakfast variety was also very good."
      ),
    },
  ];
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <h2 className="section-title">
          {t("Müşteri Yorumları", "Customer Reviews")}
        </h2>
        <div className="testimonials-grid">
          {people.map((p, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-content">
                <p>{`"${p.text}"`}</p>
              </div>
              <div className="testimonial-author">
                <img className="author-photo" alt={p.name} src={p.img} />
                <div className="author-info">
                  <h4>{p.name}</h4>
                  <span>{p.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
