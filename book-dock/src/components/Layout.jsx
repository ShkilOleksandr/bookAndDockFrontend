// src/components/Layout.jsx
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <main>{children}</main> {/* THIS LINE IS CRUCIAL */}
      </div>
    </div>
  );
};

export default Layout;
