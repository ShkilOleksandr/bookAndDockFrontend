// src/components/Layout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar  from './Navbar';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>

      <button
        className={styles.logoutButton}
        onClick={logout}
      >
        Log out
      </button>
    </div>
  );
}
