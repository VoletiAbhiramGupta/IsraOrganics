import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateItem, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="cart__title">Your Basket</h1>
        <div className="cart__layout">
          {/* ── Items ── */}
          <div className="cart__items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item card">
                <img
                  src={item.image_url || 'https://via.placeholder.com/100?text=Img'}
                  alt={item.name}
                  className="cart-item__img"
                />
                <div className="cart-item__info">
                  <Link to={`/products/${item.product_id}`} className="cart-item__name">
                    {item.name}
                  </Link>
                  <p className="cart-item__price">£{parseFloat(item.price).toFixed(2)} each</p>
                </div>
                <div className="cart-item__qty">
                  <button onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                </div>
                <div className="cart-item__subtotal">
                  £{(item.price * item.quantity).toFixed(2)}
                </div>
                <button className="cart-item__remove" onClick={() => removeItem(item.id)} title="Remove">✕</button>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <div className="cart__summary card">
            <h2>Order Summary</h2>
            <div className="cart__summary-row">
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>£{cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart__summary-row cart__summary-row--total">
              <strong>Total</strong>
              <strong>£{cartTotal.toFixed(2)}</strong>
            </div>
            <p className="cart__notice">
              This is a demo store — no payment details will be collected.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', marginTop: '.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
