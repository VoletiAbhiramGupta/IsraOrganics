import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={close}>
          <span className="navbar__logo-isra">Isra</span>Organics
        </Link>

        {/* ── Desktop links ── */}
        <div className="navbar__links navbar__links--desktop">
          <Link to="/products">Shop</Link>
          {user ? (
            <>
              <Link to="/account">My Account</Link>
              <Link to="/cart" className="navbar__cart">
                🛒
                {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* ── Mobile right side: cart + hamburger ── */}
        <div className="navbar__mobile-right">
          {user && (
            <Link to="/cart" className="navbar__cart" onClick={close}>
              🛒
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </Link>
          )}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/products" onClick={close}>Shop</Link>
          {user ? (
            <>
              <Link to="/account" onClick={close}>My Account</Link>
              <button className="navbar__mobile-signout" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close}>Sign In</Link>
              <Link to="/register" onClick={close} className="navbar__mobile-signup">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
