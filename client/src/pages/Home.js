import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import NewProducts from "../components/home/NewProducts";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/cards/category/CategoryList";
import SubList from "../components/cards/sub/SubList";
import CategoriesCarousel from "../components/home/CategoriesCarousel";

const Home = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <img
          className="home-hero-photo"
          src="/pexels-heyho-5998120.jpg"
          alt="A considered living room with sculptural furniture and soft natural light"
        />
        <div className="home-hero-copy">
          <p className="eyebrow">A HOME, MORE YOU</p>
          <h1 className="text-white">
            Make room for <em>better living.</em>
          </h1>
          <p className="home-hero-description">
            Thoughtful furniture and finishing touches for the spaces you call
            your own.
          </p>
          <Link className="store-button store-button-light" to="/shop">
            Explore the collection <ArrowRightOutlined />
          </Link>
        </div>
        <span className="home-hero-caption">Spaces for living, made to last</span>
      </section>

      <div className="home-service-notes" aria-label="Store benefits">
        <span>Considered design</span>
        <span>Pieces for everyday living</span>
        <span>Delivery across Nigeria</span>
      </div>

      <div className="home-sections">
        <NewProducts />
        <CategoriesCarousel />
        <BestSellers />
        <div className="container pb-3">
          <CategoryList />
        </div>
        <div className="container pb-3">
          <SubList />
        </div>
      </div>
    </div>
  );
};

export default Home;
