import { useState, useEffect } from 'react';
import { getDashboardAPI } from '../../services/api';
import { HiOutlineUsers, HiOutlineShoppingBag, HiOutlineStar } from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardAPI()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of the RateHub platform</p>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon users"><HiOutlineUsers /></div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stores"><HiOutlineShoppingBag /></div>
          <div className="stat-value">{stats.totalStores}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon ratings"><HiOutlineStar /></div>
          <div className="stat-value">{stats.totalRatings}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
