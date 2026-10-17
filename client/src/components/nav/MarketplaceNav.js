import React from 'react';
import { AppstoreOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const MarketplaceNav = ({ role }) => (
  <aside className="marketplace-sidebar">
    <p className="section-kicker">{role === 'vendor' ? 'VENDOR STUDIO' : 'TALENT STUDIO'}</p>
    <nav aria-label="Marketplace navigation">
      <NavLink to={`/${role}/dashboard`} end><AppstoreOutlined /> Overview</NavLink>
      {role === 'vendor' && <NavLink to="/vendor/products/new"><PlusOutlined /> Add product</NavLink>}
      <NavLink to="/user/profile"><UserOutlined /> Account profile</NavLink>
      <NavLink to="/user/role-application">Verification status</NavLink>
    </nav>
  </aside>
);

export default MarketplaceNav;
