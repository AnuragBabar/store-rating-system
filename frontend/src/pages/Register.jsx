import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerAPI } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 20) errs.name = 'Name must be at least 20 characters';
    else if (form.name.length > 60) errs.name = 'Name must not exceed 60 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (form.password.length > 16) errs.password = 'Password must not exceed 16 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Password must contain at least one uppercase letter';
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) errs.password = 'Password must contain at least one special character';
    if (!form.address) errs.address = 'Address is required';
    else if (form.address.length > 400) errs.address = 'Address must not exceed 400 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registerAPI(form);
      login(res.data.token, res.data.user);
      toast.success('Registration successful!');
      navigate('/stores');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">RateHub</h1>
        <p className="auth-tagline">Create your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input id="register-name" className={`form-input ${errors.name ? 'error' : ''}`} type="text" placeholder="Enter your full name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
            <div className="char-count">{form.name.length}/60 (min 20)</div>
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input id="register-email" className={`form-input ${errors.email ? 'error' : ''}`} type="email" placeholder="Enter your email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="register-password" className={`form-input ${errors.password ? 'error' : ''}`} type="password" placeholder="8-16 chars, 1 uppercase, 1 special" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
            <div className="char-count">{form.password.length}/16 (min 8)</div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea id="register-address" className={`form-textarea ${errors.address ? 'error' : ''}`} placeholder="Enter your address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
            <div className="char-count">{form.address.length}/400</div>
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
          <button id="register-submit" type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
