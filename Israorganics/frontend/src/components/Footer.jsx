import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo"><span>Isra</span>Organics</span>
          <p>Hair care products for every texture — 1a to 4c.</p>
        </div>
        <div className="footer__links">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?product_type=shampoo">Shampoos</Link>
          <Link to="/products?product_type=conditioner">Conditioners</Link>
          <Link to="/products?product_type=treatment">Treatments</Link>
        </div>
        <div className="footer__links">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/account">My Orders</Link>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} IsraOrganics. All rights reserved.</p>
      </div>
    </footer>
  );
}
