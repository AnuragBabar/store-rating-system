import { useState, useEffect } from 'react';
import { getAdminStoresAPI, createStoreAPI, getAdminUsersAPI } from '../../services/api';
import { HiOutlinePlus, HiChevronUp, HiChevronDown, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [storeOwners, setStoreOwners] = useState([]);

  const fetchStores = () => {
    setLoading(true);
    getAdminStoresAPI({ ...filters, ...sort })
      .then((res) => setStores(res.data.stores))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStores(); }, [sort]);

  const fetchOwners = async () => {
    try {
      const res = await getAdminUsersAPI({ role: 'store_owner' });
      setStoreOwners(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = () => {
    fetchOwners();
    setShowModal(true);
  };

  const handleFilter = () => fetchStores();

  const handleSort = (field) => {
    setSort(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ field }) => {
    if (sort.sortBy !== field) return null;
    return sort.sortOrder === 'asc' ? <HiChevronUp className="sort-icon" /> : <HiChevronDown className="sort-icon" />;
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name || form.name.length < 20) errs.name = 'Store name must be at least 20 characters';
    else if (form.name.length > 60) errs.name = 'Store name must not exceed 60 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.address) errs.address = 'Address is required';
    else if (form.address.length > 400) errs.address = 'Address must not exceed 400 characters';
    if (!form.ownerId) errs.ownerId = 'Owner is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      await createStoreAPI(form);
      toast.success('Store created successfully!');
      setShowModal(false);
      setForm({ name: '', email: '', address: '', ownerId: '' });
      setFormErrors({});
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create store');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Stores</h1>
          <p className="page-subtitle">Manage platform stores</p>
        </div>
        <button id="add-store-btn" className="btn btn-primary" onClick={handleOpenModal}>
          <HiOutlinePlus /> Add Store
        </button>
      </div>

      <div className="table-container">
        <div className="filter-bar">
          <input className="filter-input" placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <input className="filter-input" placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
          <input className="filter-input" placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          <button className="btn btn-secondary btn-sm" onClick={handleFilter}>Apply Filters</button>
        </div>

        {loading ? <div className="spinner" /> : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Store Name <SortIcon field="name" /></th>
                <th onClick={() => handleSort('email')}>Email <SortIcon field="email" /></th>
                <th onClick={() => handleSort('address')}>Address <SortIcon field="address" /></th>
                <th onClick={() => handleSort('rating')}>Average Rating <SortIcon field="rating" /></th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.email}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <HiStar style={{ color: 'var(--star-active)' }} />
                      <span style={{ fontWeight: 600 }}>{s.averageRating ? parseFloat(s.averageRating).toFixed(1) : 'No rating'}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No stores found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Store Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New Store</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input className={`form-input ${formErrors.name ? 'error' : ''}`} type="text" placeholder="Store name (min 20 chars)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <div className="char-count">{form.name.length}/60</div>
                {formErrors.name && <div className="form-error">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className={`form-input ${formErrors.email ? 'error' : ''}`} type="email" placeholder="Store email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {formErrors.email && <div className="form-error">{formErrors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className={`form-textarea ${formErrors.address ? 'error' : ''}`} placeholder="Store address (max 400 chars)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <div className="char-count">{form.address.length}/400</div>
                {formErrors.address && <div className="form-error">{formErrors.address}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Store Owner</label>
                <select className={`form-select ${formErrors.ownerId ? 'error' : ''}`} value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
                  <option value="">Select an owner</option>
                  {storeOwners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
                </select>
                {formErrors.ownerId && <div className="form-error">{formErrors.ownerId}</div>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>{formLoading ? 'Creating...' : 'Create Store'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;
