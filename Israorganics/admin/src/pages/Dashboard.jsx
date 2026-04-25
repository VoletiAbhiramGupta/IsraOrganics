import { useEffect, useState } from 'react';
import api from '../utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/orders')])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const statusColour = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#16a34a', cancelled: '#ef4444' };

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Welcome to the IsraOrganics admin panel.</p>

      <div className="stats-grid">
        {[
          { label: 'Total Users',    value: stats.total_users,    icon: '👥' },
          { label: 'Total Products', value: stats.total_products, icon: '🧴' },
          { label: 'Total Orders',   value: stats.total_orders,   icon: '📦' },
          { label: 'Revenue',        value: `£${parseFloat(stats.revenue).toFixed(2)}`, icon: '💷' },
        ].map((s) => (
          <div key={s.label} className="stat-card card">
            <div className="stat-card__icon">{s.icon}</div>
            <div>
              <p className="stat-card__label">{s.label}</p>
              <p className="stat-card__value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1rem' }}>Recent Orders</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.first_name} {o.last_name}</td>
                <td>£{parseFloat(o.total).toFixed(2)}</td>
                <td>
                  <span className="badge" style={{ background: statusColour[o.status] + '22', color: statusColour[o.status] }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>
                  {new Date(o.created_at).toLocaleDateString('en-GB')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
