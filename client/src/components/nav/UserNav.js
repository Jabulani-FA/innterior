import React from 'react';
import { ClockCircleOutlined, HeartOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/user/history', label: 'Order history', icon: <ClockCircleOutlined /> },
  { to: '/user/wishlist', label: 'Wishlist', icon: <HeartOutlined /> },
  { to: '/user/password', label: 'Password', icon: <LockOutlined /> },
  { to: '/user/profile', label: 'Profile', icon: <UserOutlined /> },
];

const UserNav = () => (
  <aside className="account-sidebar">
    <p className="section-kicker">ACCOUNT</p>
    <nav aria-label="Account navigation">
      {links.map((item) => (
        <NavLink key={item.to} to={item.to}>
          {item.icon}<span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default UserNav;