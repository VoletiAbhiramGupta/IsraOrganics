import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './AuthForms.css';

const HAIR_TYPES = ['1a','1b','1c','2a','2b','2c','3a','3b','3c','4a','4b','4c'];

const HAIR_LABELS = {
  '1a': 'Bone straight, very fine',
  '1b': 'Straight with slight body',
  '1c': 'Straight, thick & coarse',
  '2a': 'Loose, tousled waves',
  '2b': 'Wavy, defined S-shape',
  '2c': 'Defined waves, prone to frizz',
  '3a': 'Loose, big curls',
  '3b': 'Springy, ringlet curls',
  '3c': 'Tight, corkscrew curls',
  '4a': 'Tight coils, S-pattern',
  '4b': 'Z-pattern coils, less definition',
  '4c': 'Very tight zigzag coils',
};

export default function Register() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', hair_type: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card auth-card--wide card">
        <h1 className="auth-card__title">Create Your Account</h1>
        <p className="auth-card__sub">Join IsraOrganics — hair care for every texture</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-card__row">
            <div className="form-group">
              <label>First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>What's your hair type? <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional — helps us recommend products)</span></label>
            <select name="hair_type" value={form.hair_type} onChange={handleChange}>
              <option value="">I'm not sure / skip for now</option>
              {HAIR_TYPES.map((ht) => (
                <option key={ht} value={ht}>{ht.toUpperCase()} — {HAIR_LABELS[ht]}</option>
              ))}
            </select>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-card__btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
