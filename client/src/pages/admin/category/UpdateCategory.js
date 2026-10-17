import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCategory, updateCategory } from "../../../functions/category";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCategory = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = useParams();
  const [name, setName] = useState();
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setloading(true);
    getCategory(slug).then((c) => {
      setName(c.data.category.name);
    }).finally(() => {
      setloading(false);
    });
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setloading(true);
    updateCategory(slug, { name }, user.token)
      .then((res) => {
        setloading(false);
        setName("");
        toast.success(`${res.data.name} category Updated`);
        navigate("/admin/category");
      })
      .catch((err) => {
        // console.log(err);
        setloading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const UpdateCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <br />
        <label>Update Category</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
          disabled={loading}
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
        <div className="col">{UpdateCategoryForm()}</div>
      </div>
    </div>
  );
};

export default UpdateCategory;
