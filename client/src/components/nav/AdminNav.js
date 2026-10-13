import { useState } from "react";
import {
  AppstoreOutlined,
  GiftOutlined,
  MenuOutlined,
  PlusOutlined,
  ShoppingOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  { to: "/admin/dashboard", label: "Overview", icon: <AppstoreOutlined />, end: true },
  { to: "/admin/products", label: "Products", icon: <ShoppingOutlined /> },
  { to: "/admin/product", label: "Add product", icon: <PlusOutlined /> },
  { to: "/admin/category", label: "Categories", icon: <TagOutlined /> },
  { to: "/admin/sub", label: "Sub-categories", icon: <AppstoreOutlined /> },
  { to: "/admin/coupon", label: "Coupons", icon: <GiftOutlined /> },
];

const AdminNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className={`admin-sidebar${mobileOpen ? " is-open" : ""}`}>
      <div className="admin-sidebar-heading">
        <div>
          <span className="admin-sidebar-kicker">INNTERIOR</span>
          <strong>Workspace</strong>
        </div>
        <button
          className="admin-mobile-toggle"
          type="button"
          aria-label="Toggle admin navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <MenuOutlined />
        </button>
      </div>
      <nav className="admin-navigation" aria-label="Admin navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <LinkToStore />
      </div>
    </aside>
  );
};

const LinkToStore = () => (
  <Link to="/" className="admin-store-link">
    <span>←</span> Back to storefront
  </Link>
);

export default AdminNav;
