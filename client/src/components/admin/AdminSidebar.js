import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/appointments', label: 'Appointments' },
  { to: '/admin/enquiries', label: 'Enquiries' },
];

const AdminSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/admin/login');
  };

  return (
    <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
      <div className="p-5 lg:p-6 border-b border-charcoal-700 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-xl truncate">VastuSoundarya</h1>
          <p className="text-charcoal-400 text-xs uppercase tracking-wider mt-1">Admin Panel</p>
        </div>
        <button
          type="button"
          className="admin-icon-btn lg:hidden text-white"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'is-active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-charcoal-700">
        <p className="text-sm text-charcoal-400 mb-2 truncate">{user?.email}</p>
        <button type="button" onClick={handleLogout} className="admin-logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
