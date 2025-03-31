import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul className="space-y-4">
          <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/users" className="hover:text-gray-300">Users</Link></li>
          <li><Link to="/posts" className="hover:text-gray-300">Posts</Link></li>
          <li><Link to="/guides" className="hover:text-gray-300">Guides</Link></li>
          <li><Link to="/settings" className="hover:text-gray-300">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
