import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/orders');
      navigate(`/order-confirmation/${data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container checkout">
        <h1 className="checkout__title">Checkout</h1>

        <div className="checkout__layout">
          {/* ── Left: Delivery & Payment placeholder ── */}
          <div className="checkout__left">
            <div className="checkout__section card">
              <h2>Delivery Details</h2>
              <p className="checkout__demo-note">
                This is a demonstration store. No real delivery will occur.
              </p>
              <div className="form-group">
                <label>Full Name</label>
                <input defaultValue={`${user?.first_name} ${user?.last_name}`} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input defaultValue={user?.email} readOnly />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <input placeholder="123 Example Street, Birmingham, B1 1AA" readOnly />
              </div>
            </div>

            <div className="checkout__section card">
              <h2>Payment</h2>
              <div className="checkout__payment-placeholder">
                <div className="checkout__payment-icon">🔒</div>
                <p><strong>No payment details required</strong></p>
                <p>This is a personal project demo. Clicking "Place Order" will record your order without processing any payment.</p>
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="checkout__right">
            <div className="card checkout__summary">
              <h2>Your Order</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="checkout__item">
                  <span className="checkout__item-name">
                    {item.name} <span className="checkout__item-qty">×{item.quantity}</span>
                  </span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout__divider" />
              <div className="checkout__total">
                <strong>Total</strong>
                <strong>£{cartTotal.toFixed(2)}</strong>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
