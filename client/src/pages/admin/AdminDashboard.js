import { React, useState, useEffect } from "react";
import AdminNav from "../../components/nav/AdminNav";
import { getProductsByCount } from "../../functions/product";
import AdminProductCard from "../../components/cards/AdminProductCard";

const AdminDashboard = () => {
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchFilter, setsearchFilter] = useState("");
  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setloading(true);
    getProductsByCount(100)
      .then((res) => {
        setproducts(res.data);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
      });
  };

  const filtered = (searchFilter) => (product) =>
    product.title.toLowerCase().includes(searchFilter.toLowerCase());

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-sm-4">
          <AdminNav />
        </div>
        <div className="col">
          <h4 className="mt-4">All Products</h4>
          <label htmlFor="search-bar">Filter Box</label>
          <input
            type="text"
            id="search-bar"
            className="form-control mb-4"
            value={searchFilter}
            onChange={(e) => setsearchFilter(e.target.value)}
            placeholder="Search to filter Products"
          />
          <div className="row">
            {loading ? <p>Loading products...</p> : products.filter(filtered(searchFilter)).map((product) => (
              <div key={product._id} className="col-md-4 col-sm-6">
                <AdminProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
