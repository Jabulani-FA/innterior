import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MarketplaceNav from '../nav/MarketplaceNav';

const MarketplaceRoute = ({ role }) => {
  const user = useSelector((state) => state.user);
  if (!user?.token) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/user/role-application" replace />;

  return (
    <div className="marketplace-workspace">
      <MarketplaceNav role={role} />
      <main className="marketplace-route-content"><Outlet /></main>
    </div>
  );
};

export default MarketplaceRoute;
