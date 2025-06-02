import React, { useState, useEffect } from 'react';
import styles from './styling/Dashboard.module.css';

// Base URL for ASP.NET server (override via VITE_API_URL in .env)
const apiBase = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

export default function Dashboard() {
  const [rolesCount, setRolesCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserCounts() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBase}/admin/users/counts`, {
          headers:      {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setRolesCount(data);
      } catch (err) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }

    fetchUserCounts();
  }, []);

  if (loading) {
    return <div className={styles.dashboard}>Loading roles...</div>;
  }

  if (error) {
    return <div className={styles.dashboard}>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.cards}>
        {Object.entries(rolesCount).map(([role, count]) => (
          <div key={role} className={styles.card}>
            <div className={styles.cardTitle}>{role}</div>
            <div className={styles.cardValue}>{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
