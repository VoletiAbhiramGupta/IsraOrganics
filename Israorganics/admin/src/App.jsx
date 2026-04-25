import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';

function AdminRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="spinner" />;
  return admin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { admin } = useAdminAuth();

  if (!admin) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', overflowX: 'auto' }}>
        <Routes>
          <Route path="/"         element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/products" element={<AdminRoute><Products /></AdminRoute>} />
          <Route path="/orders"   element={<AdminRoute><Orders /></AdminRoute>} />
          <Route path="/users"    element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
