import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import UserStores from './pages/user/UserStores';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ChangePassword from './pages/ChangePassword';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;

  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'store_owner') return '/owner/dashboard';
    return '/stores';
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={getDefaultRoute()} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={getDefaultRoute()} /> : <Register />} />

      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Layout><AdminUsers /></Layout></ProtectedRoute>} />
      <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><Layout><AdminStores /></Layout></ProtectedRoute>} />
      <Route path="/admin/change-password" element={<ProtectedRoute roles={['admin']}><Layout><ChangePassword /></Layout></ProtectedRoute>} />

      <Route path="/stores" element={<ProtectedRoute roles={['user']}><Layout><UserStores /></Layout></ProtectedRoute>} />
      <Route path="/user/change-password" element={<ProtectedRoute roles={['user']}><Layout><ChangePassword /></Layout></ProtectedRoute>} />

      <Route path="/owner/dashboard" element={<ProtectedRoute roles={['store_owner']}><Layout><OwnerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/owner/change-password" element={<ProtectedRoute roles={['store_owner']}><Layout><ChangePassword /></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a2e', color: '#eaeaea', border: '1px solid #2a2a40' },
        success: { iconTheme: { primary: '#00d68f', secondary: '#1a1a2e' } },
        error: { iconTheme: { primary: '#ff4757', secondary: '#1a1a2e' } },
      }} />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
