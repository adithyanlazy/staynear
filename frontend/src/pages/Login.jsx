import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Login = () => {
  const [loginType, setLoginType] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const { login, loadUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginType === 'phone') {
        const res = await api.post('/auth/login-phone', { phone, password });
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        await loadUser();
        toast.success('Welcome back!');
        navigate('/');
      } else {
        const data = await login(email, password);
        if (data.requiresVerification) {
          toast.error('Please verify your email first');
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        toast.success('Welcome back!');
        if (data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error('Too many attempts. Please wait a few minutes and try again.');
      } else if (err.response?.status === 401) {
        setWrongPassword(true);
        setPassword('');
      } else {
        toast.error(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <img src="/logo-icon.svg" alt="StayNear" className="w-12 h-12" />
          </Link>
          <h1 className="text-3xl font-display font-bold">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to continue to StayNear</p>
        </div>

        <div className="card p-8">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                loginType === 'phone'
                  ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                loginType === 'email'
                  ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginType === 'phone' ? (
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative flex">
                  <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="input-field rounded-l-none flex-1"
                    placeholder="98765 43210"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setWrongPassword(false); }}
                  className={`input-field pl-10 pr-10 ${wrongPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {wrongPassword && (
                <p className="mt-1.5 text-sm text-red-500">Wrong password</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
