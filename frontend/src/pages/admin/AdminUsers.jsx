import { useState, useEffect } from 'react';
import { getAdminUsersAPI, createUserAPI, getAdminUserByIdAPI } from '../../services/api';
import { HiOutlinePlus, HiOutlineEye, HiChevronUp, HiChevronDown } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    getAdminUsersAPI({ ...filters, ...sort })
      .then((res) => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [sort]);

  const handleFilter = () => fetchUsers();

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
    if (!form.name || form.name.length < 20) errs.name = 'Name must be at least 20 characters';
    else if (form.name.length > 60) errs.name = 'Name must not exceed 60 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (form.password.length > 16) errs.password = 'Password must not exceed 16 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain at least one uppercase letter';
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) errs.password = 'Must contain at least one special character';
    if (!form.address) errs.address = 'Address is required';
    else if (form.address.length > 400) errs.address = 'Address must not exceed 400 characters';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      await createUserAPI(form);
      toast.success('User created successfully!');
      setShowModal(false);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
      setFormErrors({});
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await getAdminUserByIdAPI(id);
      setDetailData(res.data.user);
      setShowDetail(true);
    } catch (err) {
      toast.error('Failed to load user details');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage platform users</p>
        </div>
        <button id="add-user-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
          <HiOutlinePlus /> Add User
        </button>
      </div>

      <div className="table-container">
        <div className="filter-bar">
          <input className="filter-input" placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <input className="filter-input" placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
          <input className="filter-input" placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          <select className="filter-select" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <button className="btn btn-secondary btn-sm" onClick={handleFilter}>Apply</button>
        </div>

        {loading ? <div className="spinner" /> : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name <SortIcon field="name" /></th>
                <th onClick={() => handleSort('email')}>Email <SortIcon field="email" /></th>
                <th>Address</th>
                <th onClick={() => handleSort('role')}>Role <SortIcon field="role" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role.replace('_', ' ')}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleViewUser(u.id)}>
                      <HiOutlineEye /> View
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New User</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className={`form-input ${formErrors.name ? 'error' : ''}`} type="text" placeholder="Full name (min 20 chars)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <div className="char-count">{form.name.length}/60</div>
                {formErrors.name && <div className="form-error">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className={`form-input ${formErrors.email ? 'error' : ''}`} type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {formErrors.email && <div className="form-error">{formErrors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className={`form-input ${formErrors.password ? 'error' : ''}`} type="password" placeholder="8-16 chars, 1 uppercase, 1 special" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <div className="char-count">{form.password.length}/16</div>
                {formErrors.password && <div className="form-error">{formErrors.password}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className={`form-textarea ${formErrors.address ? 'error' : ''}`} placeholder="Address (max 400 chars)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <div className="char-count">{form.address.length}/400</div>
                {formErrors.address && <div className="form-error">{formErrors.address}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>{formLoading ? 'Creating...' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetail && detailData && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">User Details</h2>
            <div className="detail-row"><span className="detail-label">Name</span><span className="detail-value">{detailData.name}</span></div>
            <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{detailData.email}</span></div>
            <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{detailData.address}</span></div>
            <div className="detail-row"><span className="detail-label">Role</span><span className="detail-value"><span className={`role-badge ${detailData.role}`}>{detailData.role.replace('_', ' ')}</span></span></div>
            {detailData.role === 'store_owner' && detailData.stores && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Owned Stores</h3>
                {detailData.stores.map((s) => (
                  <div key={s.id} className="card" style={{ marginBottom: 8, padding: 16 }}>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rating: {s.averageRating ? parseFloat(s.averageRating).toFixed(1) : 'N/A'} ({s.totalRatings} ratings)</div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDetail(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
