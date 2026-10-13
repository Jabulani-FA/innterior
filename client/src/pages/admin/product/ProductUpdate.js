import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateProduct, getProduct } from "../../../functions/product";
import { getCategorySubs, getCategories } from "../../../functions/category";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import { Select } from "antd";
import FileUpload from "../../../components/forms/FileUpload";
import { useNavigate, useParams } from "react-router-dom";

const ProductUpdate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { Option } = Select;
  const { slug } = useParams();
  const navigate = useNavigate();

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
  const [arrayOfSubsId, setArrayOfSubsId] = useState([]);
  const [values, setvalues] = useState(initialState);
  const {
    title,
    description,
    price,
    categories,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    color,
    brand,
  } = values;

  const loadCategories = () => {
    getCategories().then((c) => setvalues({ ...values, categories: c.data }));
  };
  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      setvalues({ ...values, ...p.data });
      // console.log("data",p);
      getCategorySubs(p.data.category._id).then((res) => {
        setsubOptions(res.data);
      });
      let arr = [];
      p.data.subs.map((s) => {
        arr.push(s._id);
      });
      setArrayOfSubsId((prev) => arr);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(slug);
    console.log(values);
    values.subs = arrayOfSubsId;
    updateProduct(slug, values, user.token)
      .then((res) => {
        console.log(res);
        toast.success(`${res.data.title} has been updated`);
        navigate("/admin/products");
      })
      .catch((err) => {
        console.log(err);
        // if(err.response.status === 400) toast.error(err.response.data)
        toast.error(err.response.data.err);
      });
  };
  const [subOptions, setsubOptions] = useState([]);
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    setvalues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("Clicked category", e.target.value);
    setArrayOfSubsId([]);
    setvalues({ ...values, subs: [], category: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      setsubOptions(res.data);
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-sm-4">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product Update</h4>
          <hr />
          <form onSubmit={handleSubmit}>
            <FileUpload
              values={values}
              setvalues={setvalues}
              setloading={setloading}
            />
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
                value={shipping === "Yes" ? "Yes" : "No"}
                name="shipping"
                className="form-control"
                onChange={handleChange}
              >
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
                value={color}
                name="color"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please Select</option>
                {colors.map((c) => (
                  <option value={c}>{c}</option>
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
                <option>
                  {category ? category.name : "Please Select a category"}
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <br />
            {category && (
              <div className="form-group">
                <label>Sub Categories</label>
                <Select
                  mode="multiple"
                  className="form-control seLect"
                  placeholder="Please Select"
                  value={arrayOfSubsId}
                  onChange={(value) => setArrayOfSubsId(value)}
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

export default ProductUpdate;
