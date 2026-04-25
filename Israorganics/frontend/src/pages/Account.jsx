import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Account.css';

const HAIR_TYPES = ['1a','1b','1c','2a','2b','2c','3a','3b','3c','4a','4b','4c'];

export default function Account() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    hair_type: user?.hair_type || '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (tab === 'orders') {
      setOrdersLoading(true);
      api.get('/orders')
        .then(({ data }) => setOrders(data))
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/me', profileForm);
      updateUser(profileForm);
      setProfileMsg('Profile updated successfully.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch {
      setProfileMsg('Failed to update profile.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/account');
      logout();
      navigate('/');
    } catch {
      alert('Could not delete account. Please try again.');
    }
  };

  const statusColour = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };

  return (
    <div className="page">
      <div className="container">
        <h1 className="account__title">My Account</h1>
        <p className="account__welcome">Welcome back, {user?.first_name}!</p>

        <div className="account__layout">
          {/* ── Sidebar tabs ── */}
          <aside className="account__sidebar">
            {['profile', 'orders', 'danger'].map((t) => (
              <button
                key={t}
                className={`account__tab ${tab === t ? 'account__tab--active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'profile' ? '👤 Profile' : t === 'orders' ? '📦 My Orders' : '⚠️ Account Settings'}
              </button>
            ))}
          </aside>

          {/* ── Tab Content ── */}
          <div className="account__content">
            {/* Profile */}
            {tab === 'profile' && (
              <div className="card account__panel">
                <h2>Edit Profile</h2>
                <form onSubmit={handleProfileSave}>
                  <div className="auth-card__row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input value={profileForm.first_name} onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input value={profileForm.last_name} onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input value={user?.email} readOnly style={{ opacity: .6 }} />
                  </div>
                  <div className="form-group">
                    <label>Hair Type</label>
                    <select value={profileForm.hair_type} onChange={(e) => setProfileForm({ ...profileForm, hair_type: e.target.value })}>
                      <option value="">Not set</option>
                      {HAIR_TYPES.map((ht) => <option key={ht} value={ht}>{ht.toUpperCase()}</option>)}
                    </select>
                  </div>
                  {profileMsg && <p style={{ color: 'var(--success)', fontSize: '.9rem', marginBottom: '.75rem' }}>{profileMsg}</p>}
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div className="account__panel">
                <h2 style={{ marginBottom: '1.5rem' }}>Order History</h2>
                {ordersLoading ? <div className="spinner" /> : orders.length === 0 ? (
                  <div className="empty-state">
                    <h3>No orders yet</h3>
                    <p>Head to the shop and place your first order!</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="order-card card">
                      <div className="order-card__header">
                        <span className="order-card__id">Order #{order.id}</span>
                        <span className="badge" style={{ background: statusColour[order.status] + '22', color: statusColour[order.status] }}>
                          {order.status}
                        </span>
                        <span className="order-card__date">{new Date(order.created_at).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="order-card__items">
                        {order.items.map((item, i) => (
                          <span key={i} className="order-card__item">
                            {item.name} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                      <div className="order-card__footer">
                        <strong>Total: £{parseFloat(order.total).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Danger Zone */}
            {tab === 'danger' && (
              <div className="card account__panel">
                <h2>Account Settings</h2>
                <div className="danger-zone">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all associated data. This cannot be undone.</p>
                  {!deleteConfirm ? (
                    <button className="btn btn-danger" onClick={() => setDeleteConfirm(true)}>
                      Delete My Account
                    </button>
                  ) : (
                    <div className="danger-zone__confirm">
                      <p><strong>Are you absolutely sure?</strong> This will delete your account and all your orders.</p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-danger" onClick={handleDeleteAccount}>Yes, Delete My Account</button>
                        <button className="btn btn-outline" onClick={() => setDeleteConfirm(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
