import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2>İletişim</h2>
      <div className="contact-container">
        <div className="contact-info">
          <p>
            <strong>Adres:</strong> Örnek Mah. Çiçek Sok. No:123, İstanbul
          </p>
          <p>
            <strong>Telefon:</strong> +90 212 123 45 67
          </p>
          <p>
            <strong>Email:</strong> info@cicekotel.com
          </p>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.373493979815!2d28.9748053153833!3d41.01513297929989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzU0LjUiTiAyOMKwNTgnMzcuMyJF!5e0!3m2!1str!2str!4v1678886400000!5m2!1str!2str&q=41.015133,28.977033(Çiçek+Otel)&markers=color:red%7Clabel:Çiçek+Otel%7C41.015133,28.977033"
            width="600"
            height="450"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Çiçek Otel Konumu"
          ></iframe>
          <div className="map-overlay">
            <div className="location-marker">
              <div className="marker-pin"></div>
              <div className="marker-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
