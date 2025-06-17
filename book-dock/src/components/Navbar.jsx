// src/components/Navbar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import Sidebar from './Sidebar';

const routes = [
  { label: 'Dashboard', path: '/' },
  { label: 'Users',     path: '/users' },
  { label: 'Posts',     path: '/posts' },
  { label: 'Guides',    path: '/guides' },
  { label: 'Settings',  path: '/settings' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

 const logout = () => {
   localStorage.removeItem('token');
   navigate('/login', { replace: true });
 };

  const handleNavChange = e => {
    navigate(e.target.value);
  };

  return (
    <header className={styles.navbar}>
      <Sidebar />

      <select
        className={styles.dropdown}
        value={pathname}
        onChange={handleNavChange}
      >
        {routes.map(r => (
          <option key={r.path} value={r.path}>
            {r.label}
          </option>
        ))}
      </select>

      <h1 className={styles.title}>Admin Panel</h1>

      <button className={styles.logout} onClick={logout}>
        Log out
      </button>
    </header>
  );
}
