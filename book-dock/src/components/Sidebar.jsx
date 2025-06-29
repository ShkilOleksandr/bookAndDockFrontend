// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const routes = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Users',     path: '/users'     }, 
  { label: 'Reviews',   path: '/reviews'   },
  { label: 'Ports',     path: '/ports'     },
  { label: 'Comments', path: '/comments' },
  { label: 'Bookings',  path: '/bookings'  },
  { label: 'Guides',    path: '/guides'    },
  { label: 'Docking Spots', path: '/docking-spots' },
  { label: 'Services',  path: '/services'  },
  { label: 'Locations', path: '/locations' },
  { label: 'Images',    path: '/images'    },
  //{ label: 'Settings',  path: '/settings'  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleChange = e => {
    navigate(e.target.value);
  };

  return (
    <div className={styles.sidebar}>
      <select
        className={styles.dropdown}
        onChange={handleChange}
        value={pathname}
      >
        {routes.map(r => (
          <option key={r.path} value={r.path}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
