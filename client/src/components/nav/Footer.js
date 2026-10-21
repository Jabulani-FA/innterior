import { ArrowRightOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const Footer = ({ isComingSoon }) => {
  const { pathname } = useLocation();
  const isWorkspace = /^\/(admin|vendor|talent)(\/|$)/.test(pathname);

  if (isComingSoon || isWorkspace) return null;

  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link className="site-footer-logo" to="/" aria-label="Innterior home">
            <img src="/Innterior_logo.png" alt="Innterior" />
          </Link>
          <p>Considered pieces and thoughtful people for a home that feels like yours.</p>
        </div>
        <nav className="site-footer-links" aria-label="Explore Innterior">
          <span className="site-footer-label">Explore</span>
          <Link to="/shop">Shop the collection</Link>
          <Link to="/makers">Meet the makers</Link>
          <Link to="/design-studio">Room Studio</Link>
        </nav>
        <div className="site-footer-contact">
          <span className="site-footer-label">Here to help</span>
          <a href="mailto:support@innteriorsdesigns.com">
            support@innteriorsdesigns.com <ArrowRightOutlined />
          </a>
          <p>Questions about an order or finding the right piece? Write to our team.</p>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Innterior</span>
        <Link to="/user/terms-and-conditions">Terms &amp; Conditions</Link>
        <span>Made for living, across Nigeria</span>
      </div>
    </footer>
  );
};

export default Footer;