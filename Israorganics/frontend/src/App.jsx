import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/products"          element={<Products />} />
          <Route path="/products/:id"      element={<ProductDetail />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/cart"              element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout"          element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/order-confirmation/:id" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
          <Route path="/account"           element={<PrivateRoute><Account /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
