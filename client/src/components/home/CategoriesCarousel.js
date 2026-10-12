import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const CategoriesCarousel = () => (
  <section className="feature-banner">
    <div className="feature-banner-content">
      <p className="section-kicker">DESIGNED AROUND YOU</p>
      <h2>Make your space work beautifully.</h2>
      <p>
        Find considered pieces for the places where you work, gather, and
        recharge.
      </p>
      <Link className="store-button store-button-light" to="/shop">
        Find your next piece <ArrowRightOutlined />
      </Link>
    </div>
    <div
      className="feature-banner-image"
      role="img"
      aria-label="A calm, contemporary living room"
    />
  </section>
);

export default CategoriesCarousel;
