import {
  DownOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Search from "../cards/Search";

const Header = ({ isComingSoon }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }));

  const accountItems = user
    ? [
        user.role === "admin"
          ? { key: "/admin/dashboard", label: "Admin dashboard" }
          : { key: "/user/profile", label: "My profile" },
        { key: "logout", label: "Log out", icon: <LogoutOutlined /> },
      ]
    : [
        { key: "/login", label: "Log in" },
        { key: "/register", label: "Create account" },
      ];

  const handleAccountAction = ({ key }) => {
    if (key === "logout") {
      signOut(getAuth())
        .then(() => {
          dispatch({ type: "LOGOUT", payload: null });
          navigate("/");
        })
        .catch((error) => toast.error(error.message));
      return;
    }
    navigate(key);
  };

  return (
    <header className="site-header">
      {!isComingSoon && (
        <div className="store-announcement">
          <span>Considered pieces for a home that feels like yours</span>
        </div>
      )}
      <div className="site-header-inner">
        <Link className="brand-lockup" to="/" aria-label="Innterior home">
          <img src="/Innterior_logo.png" alt="Innterior" />
        </Link>
        {!isComingSoon && (
          <>
            <nav className="primary-navigation" aria-label="Main navigation">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/design-studio">Room Studio</Link>
              <Link to="/profile">Design services</Link>
            </nav>
            <div className="header-search">
              <Search />
            </div>
            <div className="header-actions">
              <Dropdown
                menu={{ items: accountItems, onClick: handleAccountAction }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <button className="header-action" type="button" aria-label="Account menu">
                  <UserOutlined />
                  <span>{user ? user.name : "Account"}</span>
                  <DownOutlined className="account-chevron" />
                </button>
              </Dropdown>
              <Link
                className="header-action cart-action"
                to="/cart"
                aria-label={`Shopping bag with ${cart.length} items`}
              >
                <ShoppingCartOutlined />
                <span>Bag</span>
                <span className="cart-count">{cart.length}</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
