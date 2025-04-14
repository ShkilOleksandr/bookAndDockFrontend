import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <main>
          <Outlet /> {/* ✅ This renders your nested routes (Dashboard, Users, etc.) */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
