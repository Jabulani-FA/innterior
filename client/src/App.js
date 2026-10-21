import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import Footer from "./components/nav/Footer";
import RegisterComplete from "./pages/auth/RegisterComplete";
import ForgotPassword from "./pages/auth/ForgotPassword";

import UserRoute from "./components/routes/UserRoute";
import History from "./pages/user/History";
import Password from "./pages/user/Password";
import Wishlist from "./pages/user/Wishlist";

import AdminRoute from "./components/routes/AdminRoute";
import MarketplaceRoute from "./components/routes/MarketplaceRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryCreate from "./pages/admin/category/CategoryCreate";
import ProductCreate from "./pages/admin/product/ProductCreate";
import ProductUpdate from "./pages/admin/product/ProductUpdate";
import AllProducts from "./pages/admin/product/AllProducts";
import ProductDetails from "./pages/admin/product/ProductDetails";
import UpdateCategory from "./pages/admin/category/UpdateCategory";
import RoleApplicationPage from "./pages/admin/RoleManagement/RoleApplication";
import AdminApplications from "./pages/admin/RoleManagement/AdminApplications";
import CouponCreate from "./pages/admin/coupon/CreateCoupon";
import UpdateCoupon from "./pages/admin/coupon/UpdateCoupon";
import CreateSub from "./pages/admin/sub/CreateSub";
import UpdateSub from "./pages/admin/sub/UpdateSub";

import CategoryHome from "./pages/category/CategoryHome";
import SubHome from "./pages/sub/SubHome";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import RoomStudio from "./pages/RoomStudio";

import { auth } from "./pages/auth/Firebase";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { currentUser } from "./functions/auth";
import ComingSoon from "./components/wildcards/ComingSoon";
import TermsAndConditions from "./pages/user/UserManagement/TermsAndConditions";
import PaymentManagement from "./pages/user/UserManagement/PaymentManagement";
import UserProfile from "./pages/user/UserManagement/UserProfile";
import MarketplaceDashboard from "./pages/MarketplaceDashboard";
import MarketplaceDirectory from "./pages/MarketplaceDirectory";

const App = () => {
  const dispatch = useDispatch();
  const isComingSoon = process.env.COMING_SOON || false;

  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => console.log("Caught ", error));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Header isComingSoon={isComingSoon} />
      <ToastContainer />
      <main className="app-main">
        <Routes>
          {isComingSoon ? (
            <Route path="*" element={<ComingSoon />} />
          ) : (
            <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/complete" element={<RegisterComplete />} />
            <Route path="/forgot/password" element={<ForgotPassword />} />
            <Route path="/product-details/:slug" element={<ProductDetails />} />
            <Route path="/category/:slug" element={<CategoryHome />} />
            <Route path="/sub/:slug" element={<SubHome />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/design-studio" element={<RoomStudio />} />
            <Route path="/makers" element={<MarketplaceDirectory />} />
            <Route
              path="/user/terms-and-conditions"
              element={<TermsAndConditions />}
            />

            {/* admin route*/}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/category" element={<CategoryCreate />} />
              <Route
                path="/admin/category/:slug"
                element={<UpdateCategory />}
              />
              <Route path="/admin/sub" element={<CreateSub />} />
              <Route path="/admin/sub/:slug" element={<UpdateSub />} />
              <Route path="/admin/coupon" element={<CouponCreate />} />
              <Route path="/admin/coupon/:slug" element={<UpdateCoupon />} />
              <Route path="/admin/product" element={<ProductCreate />} />
              <Route path="/admin/product/:slug" element={<ProductUpdate />} />
              <Route path="/admin/products" element={<AllProducts />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
            </Route>

            <Route element={<MarketplaceRoute role="vendor" />}>
              <Route path="/vendor/dashboard" element={<MarketplaceDashboard role="vendor" />} />
              <Route path="/vendor/products/new" element={<ProductCreate />} />
              <Route path="/vendor/products/:slug" element={<ProductUpdate />} />
            </Route>

            <Route element={<MarketplaceRoute role="talent" />}>
              <Route path="/talent/dashboard" element={<MarketplaceDashboard role="talent" />} />
            </Route>

            <Route element={<UserRoute />}>
              <Route path="/user/history" element={<History />} />
              <Route path="/user/wishlist" element={<Wishlist />} />
              <Route path="/user/password" element={<Password />} />
              <Route path="/user/role-application" element={<RoleApplicationPage/>}/>
              <Route
                path="/user/payment-management"
                element={<PaymentManagement />}
              />
              <Route
                path="/user/profile"
                element={<UserProfile />}
              />
            </Route>
            </>
          )}
        </Routes>
      </main>
      <Footer isComingSoon={isComingSoon} />
    </>
  );
};

export default App;
