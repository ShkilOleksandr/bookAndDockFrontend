// src/utils/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // if there is no token, redirect to /login
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // otherwise, render the protected UI
  return children;
}
