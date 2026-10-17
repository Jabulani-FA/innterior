import React, { useEffect, useState } from "react";
import HelpNav from "../../../components/nav/HelpNav";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const userdeets = {
    fullName: "",
    email: "",
    address: "",
    nickName: "",
    mobileNo: "",
  };
  const { user } = useSelector((state) => ({ ...state }));
  const [uservalues, setuservalues] = useState(userdeets);
  const { fullName, email, address, nickName, mobileNo } = uservalues;
  useEffect(() => {
    if (user !== null) {
      setuservalues((current) => ({
        ...current,
        fullName: user.name,
        email: user.email,
        address: user.address,
        nickName: user.NickName,
        mobileNo: user.mobileNo,
      }));
    }
  }, [user]);
  const handleChange = (e) => {
    const value = e.target.value;
    setuservalues({ ...uservalues, [e.target.name]: value });
  };
  return (
    <div className="row container mt-2">
      <div className="col-md-3">
        <HelpNav />
      </div>
      <div className="col-md-9 montserrat-complementary-ss">
        <form className="form-group pt-3 mb-5">
          <h3>User Details</h3>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="form-control mb-3"
            value={fullName}
            disabled
          />
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control mb-3"
            value={email}
            disabled
          />
          <label htmlFor="mobileNo">Mobile Number</label>
          <input
            type="text"
            id="mobileNo"
            name="mobileNo"
            className="form-control mb-3"
            accept="1234567890+"
            value={mobileNo}
            inputMode="tel"
            pattern="^\+?\d{0,14}$"
            maxLength="15"
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and optional leading +
              if (/^\+?\d*$/.test(value)) {
                setuservalues({ ...uservalues, mobileNo: value });
              }
            }}
            placeholder="+234 701 2345 678"
          />
          <label htmlFor="nickName">Nickname</label>
          <input
            type="text"
            id="nickName"
            name="nickName"
            className="form-control mb-3"
            value={nickName}
            placeholder="Enter a Nickname"
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="address">Home Address</label>
          <textarea
            type="text"
            id="address"
            name="address"
            cols={3}
            className="form-control mb-3"
            value={address}
            placeholder="Enter Home Address"
            onChange={(e) => handleChange(e)}
          />
          <div className="d-grid">
            <button className="btn btn-raised btn-success">
              Update User Record
            </button>
          </div>
          {/* Debugging only */}
          {/* <pre>{JSON.stringify(uservalues, null, 2)}</pre> */}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
