import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Posts from './pages/Posts';
import Guides from './pages/Guides';
import Login from './pages/LoginPage';
import RequireAuth from './utils/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Dashboard />} /> {/* Renders at '/' */}
          <Route path="users" element={<Users />} />
          <Route path="posts" element={<Posts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="guides" element={<Guides />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
