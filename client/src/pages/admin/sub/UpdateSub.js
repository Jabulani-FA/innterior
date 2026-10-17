import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSub, updateSub } from "../../../functions/sub";
import { getCategories } from "../../../functions/category";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import { useParams } from "react-router-dom";

const UpdateSub = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  const { slug } = useParams();
  const [name, setName] = useState("");
  const [loading, setloading] = useState(false);
  const [categories, setcategories] = useState([]);
  const [category, setcategory] = useState("");

  useEffect(() => {
    getSub(slug).then((c) => {
      setcategory(c.data.sub.parent);
      setName(c.data.sub.name);
    });
    getCategories().then((c) => setcategories(c.data));
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setloading(true);
    updateSub(slug, { name, parent: category }, user.token)
      .then((res) => {
        setloading(false);
        setName("");
        toast.success(`${res.data.name} category updated`);
        navigate("/admin/sub");
      })
      .catch((err) => {
        // console.log(err);
        setloading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const subForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <br />
        <label>Category</label>
        <select
          className="form-control"
          name="category"
          onChange={(e) => setcategory(e.target.value)}
        >
          <option value={""}>Please Select a Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id} selected={c._id === category}>
              {c.name}
            </option>
          ))}
        </select>
        <br />
        <label>Sub-Category Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
          autoFocus
          required
        />
        {loading ? (
          <button className="btn btn-outlined-primary" disabled>
            Loading...
          </button>
        ) : (
          <button className="btn btn-outlined-primary">Save</button>
        )}
      </div>
    </form>
  );
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-sm-4">
          <AdminNav />
        </div>
        <div className="col">{subForm()}</div>
      </div>
    </div>
  );
};

export default UpdateSub;
