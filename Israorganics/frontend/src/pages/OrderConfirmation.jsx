import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page container">
      <div className="confirm">
        <div className="confirm__icon">✓</div>
        <h1>Order Placed!</h1>
        <p className="confirm__sub">
          Thank you for your order. This is a demonstration store, so no real order has been fulfilled.
        </p>

        {order && (
          <div className="confirm__summary card">
            <div className="confirm__meta">
              <span>Order #{order.id}</span>
              <span className="badge">{order.status}</span>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="confirm__item">
                <span>{item.name} ×{item.quantity}</span>
                <span>£{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="confirm__total">
              <strong>Total Paid</strong>
              <strong>£{parseFloat(order.total).toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div className="confirm__ctas">
          <Link to="/account" className="btn btn-outline">View My Orders</Link>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
