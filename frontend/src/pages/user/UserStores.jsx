import { useState, useEffect } from 'react';
import { getStoresAPI, rateStoreAPI } from '../../services/api';
import { HiStar, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [ratingLoading, setRatingLoading] = useState(null);

  const fetchStores = () => {
    setLoading(true);
    getStoresAPI(search)
      .then((res) => setStores(res.data.stores))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStores(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (storeId, rating) => {
    setRatingLoading(storeId);
    try {
      const res = await rateStoreAPI(storeId, { rating });
      toast.success(res.data.message);
      
      // Update store locally
      setStores(stores.map(s => {
        if (s.id === storeId) {
          return {
            ...s,
            userRating: rating,
            averageRating: res.data.averageRating,
            totalRatings: res.data.totalRatings
          };
        }
        return s;
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingLoading(null);
    }
  };

  const StarRating = ({ rating, onChange, disabled }) => {
    const [hover, setHover] = useState(0);
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (hover || rating || 0) ? 'active' : ''}`}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => !disabled && setHover(0)}
            disabled={disabled}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1 }}
          >
            <HiStar />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Stores</h1>
        <p className="page-subtitle">Discover and rate stores</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input className="search-input" placeholder="Search by store name..." value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
        <input className="search-input" placeholder="Search by address..." value={search.address} onChange={(e) => setSearch({ ...search, address: e.target.value })} />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading ? <div className="spinner" /> : (
        <div className="store-grid">
          {stores.map((s) => (
            <div key={s.id} className="store-card">
              <h3 className="store-card-name">{s.name}</h3>
              <div className="store-card-address"><HiLocationMarker style={{ marginTop: 3, color: 'var(--text-muted)' }} /> {s.address}</div>
              
              <div className="store-card-rating">
                <div className="store-card-avg">
                  <span className="store-card-avg-value">{s.averageRating ? parseFloat(s.averageRating).toFixed(1) : '-'}</span>
                  <div>
                    <div style={{ display: 'flex', color: 'var(--star-active)' }}><HiStar /></div>
                    <div className="store-card-avg-label">{s.totalRatings || 0} Ratings</div>
                  </div>
                </div>
              </div>

              <div className="your-rating-section">
                <div className="your-rating-label">
                  {s.userRating ? 'Your Rating (Click to change)' : 'Rate this store'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <StarRating 
                    rating={s.userRating} 
                    onChange={(val) => handleRate(s.id, val)} 
                    disabled={ratingLoading === s.id}
                  />
                  {ratingLoading === s.id && <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Saving...</span>}
                </div>
              </div>
            </div>
          ))}
          {stores.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
              No stores found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserStores;
