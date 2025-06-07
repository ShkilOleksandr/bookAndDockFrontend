// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar  from './Navbar';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
}
