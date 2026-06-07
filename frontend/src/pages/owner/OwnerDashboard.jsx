import { useState, useEffect } from 'react';
import { getOwnerDashboardAPI } from '../../services/api';
import { HiStar, HiOutlineUser, HiOutlineCalendar } from 'react-icons/hi';

const OwnerDashboard = () => {
  const [data, setData] = useState({ stores: [], overallAverageRating: 0, totalRatingsReceived: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnerDashboardAPI()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Owner Dashboard</h1>
        <p className="page-subtitle">View your stores and their ratings</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon stores"><HiStar style={{ color: 'var(--accent)' }} /></div>
          <div className="stat-value">{data.overallAverageRating}</div>
          <div className="stat-label">Overall Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon ratings"><HiOutlineUser style={{ color: 'var(--warning)' }} /></div>
          <div className="stat-value">{data.totalRatingsReceived}</div>
          <div className="stat-label">Total Ratings Received</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20, marginTop: 40 }}>Your Stores</h2>
      
      {data.stores.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          You do not own any stores yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {data.stores.map(store => (
            <div key={store.id} className="card owner-store-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>{store.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>{store.address}</p>
                </div>
                
                <div className="owner-avg-rating">
                  <div>
                    <div className="owner-avg-label">Average Rating</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--star-active)' }}>
                      {[1, 2, 3, 4, 5].map(s => <HiStar key={s} />)}
                    </div>
                  </div>
                  <div className="owner-avg-value">{store.averageRating || '-'}</div>
                </div>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                Recent Ratings ({store.totalRatings})
              </h4>
              
              {store.ratingUsers && store.ratingUsers.length > 0 ? (
                <div className="table-container" style={{ margin: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Rating</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.ratingUsers.map((r, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{r.name}</td>
                          <td>{r.email}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <HiStar style={{ color: 'var(--star-active)' }} /> 
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.rating}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <HiOutlineCalendar />
                              {new Date(r.ratedAt).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  No ratings received yet.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
