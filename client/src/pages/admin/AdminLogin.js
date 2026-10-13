import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-md p-5 sm:p-8 rounded-sm shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-display text-xl sm:text-2xl text-charcoal-900">VastuSoundarya</h1>
          <p className="text-charcoal-500 text-sm mt-1">Admin Login</p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full min-h-[44px] px-4 py-3 border border-charcoal-200 rounded-sm focus:outline-none focus:border-gold-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full min-h-[44px] px-4 py-3 border border-charcoal-200 rounded-sm focus:outline-none focus:border-gold-600"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full min-h-[44px] disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 inline-flex w-full items-center justify-center min-h-[44px] text-sm text-charcoal-600 hover:text-gold-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
