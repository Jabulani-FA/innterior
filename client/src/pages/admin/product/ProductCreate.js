import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import { Select } from "antd";
import FileUpload from "../../../components/forms/FileUpload";

const ProductCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { Option } = Select;

  const initialState = {
    title: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Red", "Green", "Orange", "Grey", "Blue", "white"],
    color: "",
    brand: "",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        console.log(res);
        window.alert(`Product: "${res.data.title}" has been created`);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };
  const [subOptions, setsubOptions] = useState([]);
  const [showSub, setshowSub] = useState(false);
  const [loading, setloading] = useState(false);
  const [values, setvalues] = useState(initialState);
  useEffect(() => {
    getCategories().then((c) => setvalues((current) => ({ ...current, categories: c.data })));
  }, []);

  const {
    title,
    description,
    price,
    categories,
    subs,
    quantity,
    colors,
    brand,
  } = values;

  const handleChange = (e) => {
    setvalues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("Clicked category", e.target.value);
    setvalues({ ...values, subs: [], category: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      setsubOptions(res.data);
    });
    setshowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {user?.role === "admin" && <div className="col-md-3 col-sm-4"><AdminNav /></div>}
        <div className="col-md-10 mt-4">
          <h4>Product Create</h4>
          <hr />
          <form onSubmit={handleSubmit}>
            <FileUpload
              values={values}
              setvalues={setvalues}
              setloading={setloading}
            />
            {loading && <p role="status">Uploading images...</p>}
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                onChange={handleChange}
                value={title}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                className="form-control"
                onChange={handleChange}
                value={description}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                min={0}
                name="price"
                className="form-control"
                onChange={handleChange}
                value={price}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Shipping</label>
              <select
                name="shipping"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please Select</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <br />
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min={0}
                name="quantity"
                className="form-control"
                onChange={handleChange}
                value={quantity}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Color</label>
              <select
                name="color"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please Select</option>
                {colors.map((color) => (
                  <option value={color}>{color}</option>
                ))}
              </select>
            </div>
            <br />
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                className="form-control"
                onChange={handleChange}
                value={brand}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                name="category"
                onChange={handleCategoryChange}
              >
                <option value={""}>Please Select a Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <br />
            {showSub && (
              <div className="form-group">
                <label>Sub Categories</label>
                <Select
                  mode="multiple"
                  className="form-control seLect"
                  placeholder="Please Select"
                  value={subs}
                  onChange={(value) => setvalues({ ...values, subs: value })}
                >
                  {subOptions.length &&
                    subOptions.map((s) => (
                      <Option key={s._id} value={s._id}>
                        {s.name}
                      </Option>
                    ))}
                </Select>
              </div>
            )}
            <button className="btn btn-info">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
