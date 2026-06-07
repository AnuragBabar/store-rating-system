import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlineShoppingBag, HiOutlineStar, HiOutlineKey, HiOutlineLogout } from 'react-icons/hi';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (user.role === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> },
        { path: '/admin/users', label: 'Users', icon: <HiOutlineUsers /> },
        { path: '/admin/stores', label: 'Stores', icon: <HiOutlineShoppingBag /> },
        { path: '/admin/change-password', label: 'Change Password', icon: <HiOutlineKey /> },
      ];
    }
    if (user.role === 'store_owner') {
      return [
        { path: '/owner/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> },
        { path: '/owner/change-password', label: 'Change Password', icon: <HiOutlineKey /> },
      ];
    }
    return [
      { path: '/stores', label: 'Stores', icon: <HiOutlineShoppingBag /> },
      { path: '/user/change-password', label: 'Change Password', icon: <HiOutlineKey /> },
    ];
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">RateHub</div>
        <div className="sidebar-subtitle">Store Rating Platform</div>
        <nav className="sidebar-nav">
          {getNavItems().map((item) => (
            <button
              key={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role?.replace('_', ' ')}</div>
            </div>
          </div>
          <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <HiOutlineLogout /> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
