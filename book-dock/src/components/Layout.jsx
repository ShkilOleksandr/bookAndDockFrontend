<<<<<<< HEAD
// src/components/Layout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar  from './Navbar';
=======
import Navbar from './Navbar';
>>>>>>> 0983f53 (for pulling)
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
<<<<<<< HEAD
        <div className={styles.outlet}>
          <Outlet />
        </div>
=======
        <main>{children}</main> 
>>>>>>> 0983f53 (for pulling)
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
