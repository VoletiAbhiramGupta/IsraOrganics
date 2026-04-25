import { useEffect, useState } from 'react';
import api from '../utils/api';
import './Products.css';

const PRODUCT_TYPES = ['shampoo','conditioner','treatment','relaxer','moisturizer','oil','gel','other'];
const BLANK = { name: '', description: '', price: '', stock: '', image_url: '', product_type: 'shampoo', hair_type_codes: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/admin/products').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setForm(BLANK); setEditingId(null); setError(''); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, image_url: p.image_url || '', product_type: p.product_type, hair_type_codes: p.hair_type_codes || '' });
    setEditingId(p.id);
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, form);
      } else {
        await api.post('/admin/products', form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.delete(`/admin/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">{products.length} products in catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* ── Form Modal ── */}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSave} className="product-form">
              <div className="product-form__row">
                <div>
                  <label>Product Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label>Product Type *</label>
                  <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })}>
                    {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="product-form__row">
                <div>
                  <label>Price (£) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div>
                  <label>Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div>
                <label>Image URL</label>
                <input placeholder="https://..." value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <div>
                <label>Hair Type Codes (comma-separated, e.g. 3a,3b,4c)</label>
                <input placeholder="1a,2b,3c" value={form.hair_type_codes} onChange={(e) => setForm({ ...form, hair_type_codes: e.target.value })} />
              </div>
              {error && <p style={{ color: 'var(--error)', fontSize: '.85rem' }}>{error}</p>}
              <div className="product-form__actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="spinner" /> : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Hair Types</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      {p.image_url && <img src={p.image_url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="badge" style={{ background: '#ede9fe', color: '#4C1D95', textTransform: 'capitalize' }}>{p.product_type}</span></td>
                  <td style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{p.hair_type_codes || '—'}</td>
                  <td>£{parseFloat(p.price).toFixed(2)}</td>
                  <td style={{ color: p.stock < 5 ? 'var(--error)' : 'inherit' }}>{p.stock}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
