import React from "react";
import Header from "../ui/Header.jsx";
import Hero from "../ui/Hero.jsx";
import Amenities from "../ui/Amenities.jsx";
import Testimonials from "../ui/Testimonials.jsx";
import Contact from "../ui/Contact.jsx";
import Footer from "../ui/Footer.jsx";
import "../styles/home.css";

export default function HomeEN() {
  return (
    <>
      <Header lang="en" />
      <main>
        <Hero
          title="Welcome to Our Family"
          subtitle="Ready for Unforgettable Memories?"
          lang="en"
        />
        <Amenities lang="en" />
        <Testimonials lang="en" />
        <Contact />
      </main>
      <Footer lang="en" />
    </>
  );
}
