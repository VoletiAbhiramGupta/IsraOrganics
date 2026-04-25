import { useEffect, useState } from 'react';
import api from '../utils/api';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLOUR = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#16a34a', cancelled: '#ef4444' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    api.get('/admin/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/admin/orders/${orderId}/status`, { status });
    load();
  };

  return (
    <div>
      <h1 className="page-title">Orders</h1>
      <p className="page-sub">{orders.length} orders total</p>

      {loading ? <div className="spinner" /> : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <>
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700 }}>#{o.id}</td>
                    <td>{o.first_name} {o.last_name}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{o.email}</td>
                    <td style={{ fontWeight: 600 }}>£{parseFloat(o.total).toFixed(2)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{ width: 'auto', padding: '.3rem .6rem', fontSize: '.8rem', color: STATUS_COLOUR[o.status], fontWeight: 600, border: `1.5px solid ${STATUS_COLOUR[o.status]}` }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>
                      {new Date(o.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      >
                        {expanded === o.id ? 'Hide' : 'View'} items
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr key={`${o.id}-items`}>
                      <td colSpan={7} style={{ background: '#faf6f2', padding: '1rem 1.5rem' }}>
                        {o.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.35rem 0', fontSize: '.875rem', borderBottom: '1px solid var(--border)' }}>
                            <span>{item.name} ×{item.quantity}</span>
                            <span>£{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
