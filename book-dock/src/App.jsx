import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Posts from './pages/Posts';
import Guides from './pages/Guides';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/guides" element={<Guides />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
