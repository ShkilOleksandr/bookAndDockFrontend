// src/pages/Dashboard.jsx
import React from 'react';
import styles from './styling/Dashboard.module.css';

export default function Dashboard() {
  // you can replace these with real data from hooks/services
  const stats = [
    { title: 'Total Users', value: 124 },
    { title: 'Total Posts', value: 76 },
    { title: 'Total Guides', value: 15 },
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.cards}>
        {stats.map((s) => (
          <div key={s.title} className={styles.card}>
            <div className={styles.cardTitle}>{s.title}</div>
            <div className={styles.cardValue}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
