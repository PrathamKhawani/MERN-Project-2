import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// ─── Auth Context ───────────────────────────────────────────────────────────
const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const API = '/api/users';

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchMe = React.useCallback(async (t) => {
    try {
      const res = await fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (!res.ok) throw new Error('Invalid token');
      const data = await res.json();
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [API, logout]);

  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchMe]);

  const login = React.useCallback(async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorMessage || 'Login failed');
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await fetchMe(data.token);
  }, [API, fetchMe]);

  const register = React.useCallback(async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorMessage || 'Registration failed');
    return data;
  }, [API]);

  const updateProfile = React.useCallback(async (updateData) => {
    const res = await fetch(`${API}/update`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorMessage || 'Failed to update profile');
    setUser(data.user);
    return data;
  }, [API, token]);

  const changePassword = React.useCallback(async (currentPassword, newPassword) => {
    const res = await fetch(`${API}/change-password`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorMessage || 'Failed to change password');
    return data;
  }, [API, token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Router (no external deps) ──────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('login');

  if (loading) return <LoadingScreen />;
  if (user)    return <Dashboard />;
  if (page === 'login')    return <LoginPage    switchPage={setPage} />;
  if (page === 'register') return <RegisterPage switchPage={setPage} />;
  return null;
}

// ─── Loading Screen ──────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0f0f1a', flexDirection: 'column', gap: 20
    }}>
      <div style={{
        width: 56, height: 56,
        background: 'linear-gradient(135deg,#6c63ff,#00d4aa)',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, animation: 'float 2s ease-in-out infinite'
      }}>🚀</div>
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );
}

// ─── Login Page ──────────────────────────────────────────────────────────────
function LoginPage({ switchPage }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb1" />
      <div className="auth-bg-orb orb2" />
      <div className="auth-bg-orb orb3" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🚀</div>
          <span className="auth-logo-text">MERN Auth</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          {error && (
            <div className="error-banner">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <div className="form-input-wrap">
              <span className="form-input-icon">✉️</span>
              <input
                id="login-email"
                type="email"
                className={`form-input${error ? ' error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon">🔒</span>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className={`form-input${error ? ' error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="form-eye-btn"
                onClick={() => setShowPw(v => !v)}
                aria-label="Toggle password"
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: 24 }}>or</div>

        <p className="auth-link-row" style={{ marginTop: 16 }}>
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => switchPage('register')} id="go-register">
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── Register Page ───────────────────────────────────────────────────────────
function RegisterPage({ switchPage }) {
  const { register } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => switchPage('login'), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb1" />
      <div className="auth-bg-orb orb2" />
      <div className="auth-bg-orb orb3" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🚀</div>
          <span className="auth-logo-text">MERN Auth</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join us — it only takes a minute</p>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          {error   && <div className="error-banner"><span>⚠️</span> {error}</div>}
          {success && <div className="success-banner"><span>✅</span> {success}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full name</label>
            <div className="form-input-wrap">
              <span className="form-input-icon">👤</span>
              <input id="reg-name" type="text" className="form-input"
                placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <div className="form-input-wrap">
              <span className="form-input-icon">✉️</span>
              <input id="reg-email" type="email" className="form-input"
                placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon">🔒</span>
              <input id="reg-password" type={showPw ? 'text' : 'password'} className="form-input"
                placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="form-eye-btn" onClick={() => setShowPw(v => !v)} aria-label="Toggle pw">
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon">🔐</span>
              <input id="reg-confirm" type={showPw ? 'text' : 'password'} className="form-input"
                placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
          </div>

          <button id="register-submit-btn" type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating…</> : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: 24 }}>or</div>

        <p className="auth-link-row" style={{ marginTop: 16 }}>
          Already have an account?{' '}
          <span className="auth-link" onClick={() => switchPage('login')} id="go-login">Sign in</span>
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [activeNav, setActiveNav] = useState('overview');

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Settings State (Persisted)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [emailNotifs, setEmailNotifs] = useState(() => {
    const saved = localStorage.getItem('emailNotifs');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('emailNotifs', JSON.stringify(emailNotifs));
  }, [emailNotifs]);

  // Sync state if user data loads slightly after mount
  useEffect(() => {
    if (user?.name) setProfileName(user.name);
  }, [user]);

  // Sync dark mode to document body class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    if (!profileName) { setProfileMsg({ type: 'error', text: 'Name cannot be empty' }); return; }
    setProfileLoading(true);
    try {
      await updateProfile({ name: profileName });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleSecuritySubmit(e) {
    e.preventDefault();
    setSecurityMsg({ type: '', text: '' });
    if (!currentPassword || !newPassword) { setSecurityMsg({ type: 'error', text: 'Please fill all fields' }); return; }
    if (newPassword.length < 6) { setSecurityMsg({ type: 'error', text: 'New password must be min 6 characters' }); return; }
    setSecurityLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSecurityMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSecurityMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setSecurityMsg({ type: 'error', text: err.message });
    } finally {
      setSecurityLoading(false);
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Good morning' :
    now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const navItems = [
    { id: 'overview',  icon: '🏠', label: 'Overview'  },
    { id: 'profile',   icon: '👤', label: 'Profile'   },
    { id: 'security',  icon: '🔐', label: 'Security'  },
    { id: 'settings',  icon: '⚙️', label: 'Settings'  },
  ];

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🚀</div>
          <span className="sidebar-logo-text">MERN Auth</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user" onClick={logout} id="logout-btn" title="Click to log out">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role} · Log out</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-greeting">
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </div>
            <div className="dashboard-date">{dateStr}</div>
          </div>
          <button className="btn-logout" id="header-logout-btn" onClick={logout}>
            <span>🚪</span> Log out
          </button>
        </header>

        {activeNav === 'overview' && (
          <>
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">🛡️</div>
                <div>
                  <div className="stat-label">Account Status</div>
                  <div className="stat-value" style={{ fontSize: 18, color: '#06d6a0' }}>Active</div>
                  <div className="stat-sub">All systems go</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon teal">👑</div>
                <div>
                  <div className="stat-label">Role</div>
                  <div className="stat-value" style={{ fontSize: 18, textTransform: 'capitalize' }}>{user?.role}</div>
                  <div className="stat-sub">Access level</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon pink">📅</div>
                <div>
                  <div className="stat-label">Member Since</div>
                  <div className="stat-value" style={{ fontSize: 15 }}>{memberSince}</div>
                  <div className="stat-sub">Registration date</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon gold">🔑</div>
                <div>
                  <div className="stat-label">Auth Method</div>
                  <div className="stat-value" style={{ fontSize: 18 }}>JWT</div>
                  <div className="stat-sub">Token-based</div>
                </div>
              </div>
            </div>

            {/* Content grid */}
            <div className="content-grid">
              {/* Profile */}
              <div className="profile-card">
                <div className="profile-card-title">👤 Profile Information</div>

                <div className="profile-avatar-section">
                  <div className="profile-avatar-big">{initials}</div>
                  <div>
                    <div className="profile-name">{user?.name}</div>
                    <div className="profile-email">{user?.email}</div>
                    <div className="profile-badge">
                      <span>✓</span> Verified Account
                    </div>
                  </div>
                </div>

                <div className="profile-fields">
                  {[
                    { key: 'Full Name',       val: user?.name },
                    { key: 'Email',           val: user?.email },
                    { key: 'Role',            val: user?.role },
                    { key: 'Account Status',  val: user?.isActive ? 'Active' : 'Inactive' },
                    { key: 'User ID',         val: user?._id?.slice(-8).toUpperCase() },
                    { key: 'Member Since',    val: memberSince },
                  ].map(({ key, val }) => (
                    <div className="profile-field-row" key={key}>
                      <span className="pf-key">{key}</span>
                      <span className="pf-val">{val ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="activity-card">
                <div className="activity-card-title">⚡ Recent Activity</div>

                {[
                  { dot: 'green', text: 'Logged in successfully', time: 'Just now' },
                  { dot: 'blue',  text: 'JWT token issued', time: 'Just now' },
                  { dot: 'gold',  text: 'Account created', time: memberSince },
                ].map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-dot-wrap">
                      <div className={`activity-dot ${a.dot}`} />
                      {i < 2 && <div className="activity-line" />}
                    </div>
                    <div>
                      <div className="activity-text">{a.text}</div>
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </div>
                ))}

                {/* Info Box */}
                <div style={{
                  marginTop: 8, padding: '16px',
                  background: 'rgba(108,99,255,0.08)',
                  border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: 14
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#a5a0ff', marginBottom: 8 }}>
                    🔐 Security Tip
                  </div>
                  <div style={{ fontSize: 12.5, color: '#9999cc', lineHeight: 1.6 }}>
                    Your password is securely hashed with bcrypt. Never share your credentials with anyone.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeNav === 'profile' && (
          <div className="profile-card" style={{ maxWidth: '800px' }}>
            <div className="profile-card-title">📝 Edit Profile</div>
            <p style={{ color: '#9999cc', fontSize: '14px', marginBottom: '24px' }}>
              Manage your personal information and preferences.
            </p>

            {profileMsg.text && (
              <div className={profileMsg.type === 'error' ? 'error-banner' : 'success-banner'} style={{ marginBottom: '20px' }}>
                <span>{profileMsg.type === 'error' ? '⚠️' : '✅'}</span> {profileMsg.text}
              </div>
            )}

            <form className="auth-form" onSubmit={handleProfileSubmit} style={{ marginTop: '0' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">👤</span>
                  <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">✉️</span>
                  <input type="email" className="form-input" defaultValue={user?.email} disabled />
                </div>
                <span style={{ fontSize: '12px', color: '#666699', marginTop: '4px' }}>
                  Email addresses cannot be changed once registered.
                </span>
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }} disabled={profileLoading}>
                  {profileLoading ? <><span className="spinner" /> Saving…</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeNav === 'security' && (
          <div className="profile-card" style={{ maxWidth: '800px' }}>
            <div className="profile-card-title">🔐 Security Settings</div>
            <p style={{ color: '#9999cc', fontSize: '14px', marginBottom: '24px' }}>
              Update your password and secure your account.
            </p>

            {securityMsg.text && (
              <div className={securityMsg.type === 'error' ? 'error-banner' : 'success-banner'} style={{ marginBottom: '20px' }}>
                <span>{securityMsg.type === 'error' ? '⚠️' : '✅'}</span> {securityMsg.text}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSecuritySubmit} style={{ marginTop: '0' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔒</span>
                  <input type={showCurrentPw ? 'text' : 'password'} className="form-input" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                  <button type="button" className="form-eye-btn" onClick={() => setShowCurrentPw(v => !v)} aria-label="Toggle pw">
                    {showCurrentPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔑</span>
                  <input type={showNewPw ? 'text' : 'password'} className="form-input" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  <button type="button" className="form-eye-btn" onClick={() => setShowNewPw(v => !v)} aria-label="Toggle pw">
                    {showNewPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 24px', background: 'linear-gradient(135deg, #00d4aa, #00b893)' }} disabled={securityLoading}>
                  {securityLoading ? <><span className="spinner" /> Updating…</> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeNav === 'settings' && (
          <div className="profile-card" style={{ maxWidth: '800px' }}>
            <div className="profile-card-title">⚙️ App Settings</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Customize your application experience. These are saved to your local browser.
            </p>
            
            <div className="profile-fields">
              <div className="profile-field-row" style={{ padding: '16px 20px' }} onClick={() => setDarkMode(!darkMode)}>
                <div>
                  <div className="pf-key" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Dark Mode</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Toggle the dark theme across the application.</div>
                </div>
                <div style={{
                  width: '44px', height: '24px', background: darkMode ? 'var(--primary)' : 'var(--text-muted)', borderRadius: '12px',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
                }}>
                  <div style={{
                    width: '18px', height: '18px', background: '#fff', borderRadius: '50%',
                    position: 'absolute', top: '3px', transition: 'left 0.3s, right 0.3s',
                    ...(darkMode ? { right: '3px' } : { left: '3px' })
                  }} />
                </div>
              </div>

              <div className="profile-field-row" style={{ padding: '16px 20px' }} onClick={() => setEmailNotifs(!emailNotifs)}>
                <div>
                  <div className="pf-key" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Email Notifications</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Receive updates about your account activity.</div>
                </div>
                <div style={{
                  width: '44px', height: '24px', background: emailNotifs ? 'var(--primary)' : 'var(--text-muted)', borderRadius: '12px',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
                }}>
                  <div style={{
                    width: '18px', height: '18px', background: '#fff', borderRadius: '50%',
                    position: 'absolute', top: '3px', transition: 'left 0.3s, right 0.3s',
                    ...(emailNotifs ? { right: '3px' } : { left: '3px' })
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
