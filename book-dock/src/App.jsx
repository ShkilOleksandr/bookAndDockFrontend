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
import Guides      from './pages/Guides';
import Settings    from './pages/Settings';
import DockingSpots from './pages/DockingSpots';
import Reviews from './pages/Reviews';
import Ports from './pages/Ports';
import Comments from './pages/Comments';
import Bookings from './pages/Bookings';
import Services  from './pages/Services';
import Locations from './pages/Locations';
import GuideDetail from './pages/GuideDetail';
import GuideEdit   from './pages/GuideEdit';
import Images from './pages/Images';
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
          <Route path="reviews"  element={<Reviews />} />
          <Route path="docking-spots" element={<DockingSpots />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="ports"    element={<Ports />} />
          <Route path="guides"   element={<Guides />} />
          <Route path="/guides/:id" element={<GuideDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="comments" element={<Comments />} />
          <Route path="services" element={<Services />} />
          <Route path="locations" element={<Locations />} />
          <Route path="guides/:id/edit" element={<GuideEdit />} />
          <Route path="images" element={<Images />} />
        </Route>

        {/* 3) catch any unknown URL and send to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
