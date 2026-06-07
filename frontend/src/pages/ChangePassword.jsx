import { useState } from 'react';
import { updatePasswordAPI } from '../services/api';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (!form.newPassword || form.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters';
    else if (form.newPassword.length > 16) errs.newPassword = 'Password must not exceed 16 characters';
    else if (!/[A-Z]/.test(form.newPassword)) errs.newPassword = 'Must contain at least one uppercase letter';
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.newPassword)) errs.newPassword = 'Must contain at least one special character';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await updatePasswordAPI({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Change Password</h1>
        <p className="page-subtitle">Update your account password</p>
      </div>
      <div className="password-section">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input id="current-password" className={`form-input ${errors.currentPassword ? 'error' : ''}`} type="password" placeholder="Enter current password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
              {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input id="new-password" className={`form-input ${errors.newPassword ? 'error' : ''}`} type="password" placeholder="8-16 chars, 1 uppercase, 1 special" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
              <div className="char-count">{form.newPassword.length}/16 (min 8)</div>
              {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input id="confirm-password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
            <button id="update-password-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
