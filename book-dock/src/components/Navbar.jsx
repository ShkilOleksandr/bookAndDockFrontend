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

  const handleNavChange = e => {
    navigate(e.target.value);
  };

  return (
    <header className={styles.navbar}>
      <Sidebar />
      <div className={styles.brand}>Admin Panel</div>

      {/* only show this on small screens, hide on wide screens via CSS */}
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
    </header>
  );
}
