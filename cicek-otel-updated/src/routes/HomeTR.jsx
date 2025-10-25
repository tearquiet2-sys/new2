import React from "react";
import Header from "../ui/Header.jsx";
import Hero from "../ui/Hero.jsx";
import Amenities from "../ui/Amenities.jsx";
import Testimonials from "../ui/Testimonials.jsx";
import Contact from "../ui/Contact.jsx";
import Footer from "../ui/Footer.jsx";
import "../styles/home.css";

export default function HomeTR() {
  return (
    <>
      <Header lang="tr" />
      <main>
        <Hero
          title="Ailemize Hoşgeldiniz"
          subtitle="Unutulmaz Anılara Hazır mısınız?"
          lang="tr"
        />
        <Amenities lang="tr" />
        <Testimonials lang="tr" />
        <Contact />
      </main>
      <Footer lang="tr" />
    </>
  );
}
