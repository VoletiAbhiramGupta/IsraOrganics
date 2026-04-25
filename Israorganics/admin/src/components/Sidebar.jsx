import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Sidebar.css';

const NAV = [
  { to: '/',         label: 'Dashboard',   icon: '📊' },
  { to: '/products', label: 'Products',    icon: '🧴' },
  { to: '/orders',   label: 'Orders',      icon: '📦' },
  { to: '/users',    label: 'Users',       icon: '👥' },
];

export default function Sidebar() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span>Isra</span>Organics
        <small>Admin</small>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            <span>{icon}</span> {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p className="sidebar__admin-email">{admin?.email}</p>
        <button className="btn btn-ghost btn-sm sidebar__logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
