import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete account for "${name}"? This cannot be undone.`)) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  const filtered = users.filter(
    (u) =>
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">{users.length} registered customers</p>
        </div>
        <input
          style={{ width: '260px' }}
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Hair Type</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.first_name} {u.last_name}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>{u.email}</td>
                  <td>
                    {u.hair_type
                      ? <span className="badge" style={{ background: '#ede9fe', color: '#4C1D95' }}>{u.hair_type.toUpperCase()}</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>Not set</span>}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>
                    {new Date(u.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id, `${u.first_name} ${u.last_name}`)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
