// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import RequireAuth from './utils/RequireAuth';
import Layout      from './components/Layout';
import Dashboard   from './pages/Dashboard';
import Users       from './pages/Users';
import Posts       from './pages/Posts';
import Guides      from './pages/Guides';
import Settings    from './pages/Settings';
import DockingSpots from './pages/DockingSpots';
// ← your feature‑based login page
import LoginPage   from './features/auth/LoginPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1) public login screen */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2) everything under "/" is protected AND wrapped in your Layout */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index        element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users"    element={<Users />} />
          <Route path="docking-spots" element={<DockingSpots />} />
          <Route path="posts"    element={<Posts />} />
          <Route path="guides"   element={<Guides />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 3) catch any unknown URL and send to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
