import React, { useEffect, useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import LoadingCard from "../cards/LoadingCard";
import ProductCard from "../cards/ProductCard";
import { getProducts, getProductsCount } from "../../functions/product";

const BestSellers = () => {
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(false);
  const [productsCount, setproductsCount] = useState(0);
  const [page, setpage] = useState(1);

  useEffect(() => {
    setloading(true);
    getProducts('sold', 'desc', page)
      .then((res) => setproducts(res.data))
      .finally(() => setloading(false));
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setproductsCount(res.data));
  }, []);

  return (
    <section className="container product-shelf">
      <div className="shelf-heading">
        <div>
          <p className="section-kicker">CUSTOMER FAVOURITES</p>
          <h2>Most loved</h2>
        </div>
        <Link className="shelf-link" to="/shop">
          View all <ArrowRightOutlined />
        </Link>
      </div>
      {loading ? (
        <LoadingCard count={5} />
      ) : (
        <ScrollMenu>
          {products.map((product) => (
            <div key={product._id} className="shelf-product">
              <ProductCard product={product} />
            </div>
          ))}
        </ScrollMenu>
      )}
      <div className="shelf-pagination">
        <Pagination
          current={page}
          total={(productsCount / 5) * 10}
          onChange={(value) => setpage(value)}
        />
      </div>
    </section>
  );
};

export default BestSellers;
