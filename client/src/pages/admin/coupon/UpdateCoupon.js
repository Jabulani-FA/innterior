import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCoupon, updateCoupon } from "../../../functions/coupon";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import { useParams } from "react-router-dom";

const UpdateCoupon = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  const { slug } = useParams();
  const couponScheme = {
    name: "",
    couponValue: "",
    minAmount: "",
    maxAmount: "",
    expiry: "",
  };
  const [coupon, setcoupon] = useState(couponScheme);
  const { name, couponValue, minAmount, maxAmount, expiry } = coupon;
  const [loading, setloading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [enforcedDate, setenforcedDate] = useState("");

  useEffect(() => {
    getCoupon(slug).then((c) => {
      console.log(c.data);
      setcoupon(c.data);
    });
  }, [slug]);

  useEffect(() => {
    setenforcedDate(expiry ? new Date(expiry).toISOString().split("T")[0] : "");
  }, [expiry]);

  const handleChange = (e) => {
    setcoupon({
      ...coupon,
      [e.target.name]:
        e.target.type === "number"
          ? e.target.value > 0
            ? e.target.value
            : 0
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setloading(true);
    updateCoupon(slug, coupon, user.token)
      .then((res) => {
        setloading(false);
        setcoupon(couponScheme);
        toast.success(`${res.data.name} category updated`);
        navigate("/admin/coupon");
      })
      .catch((err) => {
        // console.log(err);
        setloading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const couponForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <br />
        <label>Coupon Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          onChange={(e) => handleChange(e)}
          value={name}
          autoFocus
          required
        />
        <label>Discount Amount</label>
        <input
          type="number"
          className="form-control"
          name="couponValue"
          min={0}
          onChange={(e) => handleChange(e)}
          value={couponValue}
          autoFocus
          required
        />
        <label>Minimum Amount</label>
        <input
          type="number"
          className="form-control"
          name="minAmount"
          min={0}
          onChange={(e) => handleChange(e)}
          value={minAmount}
          autoFocus
        />
        <label>Maximum Amount</label>
        <input
          type="number"
          className="form-control"
          name="maxAmount"
          min={0}
          onChange={(e) => handleChange(e)}
          value={maxAmount}
          autoFocus
        />
        <label>Expiry Date</label>
        <input
          type="date"
          className="form-control"
          name="expiry"
          min={today}
          onChange={(e) => handleChange(e)}
          value={enforcedDate}
          autoFocus
          required
        />

        {loading ? (
          <button className="btn btn-outlined-primary" disabled>
            Loading...
          </button>
        ) : (
          <button className="btn btn-outlined-primary">Update Coupon</button>
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
        <div className="col">{couponForm()}</div>
      </div>
    </div>
  );
};

export default UpdateCoupon;
