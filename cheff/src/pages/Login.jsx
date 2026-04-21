import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) setError(result.error);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--chef-bg)' }}>
      <div className="w-full max-w-sm animate-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--chef-text)' }}>Kitchen Display</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--chef-text-sec)' }}>Sign in to your chef station</p>
        </div>

        <div className="chef-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: '#fff2f0', color: '#ff3b30', border: '1px solid #ffccc7' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--chef-text)' }}>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--chef-bg)', border: '1px solid var(--chef-border)', color: 'var(--chef-text)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--chef-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--chef-border)'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--chef-text)' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--chef-bg)', border: '1px solid var(--chef-border)', color: 'var(--chef-text)' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--chef-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--chef-border)'}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              style={{ background: loading ? '#86868b' : 'var(--chef-accent)', color: 'white', border: 'none', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--chef-border)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--chef-text-sec)' }}>
              Demo: <strong>chef</strong> / <strong>1234</strong>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--chef-text-sec)' }}>FastPOS Kitchen v1.0</p>
      </div>
    </div>
  );
}
