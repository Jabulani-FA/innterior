import { React, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import AdminNav from '../nav/AdminNav';
import LoadingToRedirect from './LoadingToRedirect';
import { currentAdmin } from '../../functions/auth';

const AdminRoute = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    setChecking(true);
    if (user && user.token) {
      currentAdmin(user.token)
        .then(() => active && setOk(true))
        .catch(() => active && setOk(false))
        .finally(() => active && setChecking(false));
    } else {
      setOk(false);
      setChecking(false);
    }
    return () => { active = false; };
  }, [user]);

  if (checking) return <LoadingToRedirect />;
  if (!ok) return <LoadingToRedirect />;

  return (
    <div className="admin-workspace">
      <AdminNav />
      <main className="admin-route-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRoute