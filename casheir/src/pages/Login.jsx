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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--pos-bg)' }}>
      <div className="w-full max-w-sm animate-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍔</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--pos-text)' }}>FastPOS</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--pos-text-secondary)' }}>
            Sign in to your cashier terminal
          </p>
        </div>

        {/* Card */}
        <div className="pos-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: '#fff2f0', color: 'var(--pos-error)', border: '1px solid #ffccc7' }}>
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pos-text)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--pos-bg)',
                  border: '1px solid var(--pos-border)',
                  color: 'var(--pos-text)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--pos-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--pos-border)'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pos-text)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--pos-bg)',
                  border: '1px solid var(--pos-border)',
                  color: 'var(--pos-text)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--pos-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--pos-border)'}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: loading ? '#86868b' : 'var(--pos-accent)',
                color: 'white',
                border: 'none',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--pos-border)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--pos-text-secondary)' }}>
              Demo: <strong>cashier</strong> / <strong>1234</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--pos-text-secondary)' }}>
          FastPOS v2.0 — Cashier Terminal
        </p>
      </div>
    </div>
  );
}
