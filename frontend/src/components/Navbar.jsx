import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteLogo, setSiteLogo] = useState('');
  const [siteName, setSiteName] = useState('StayNear');
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await api.get('/site-logo');
        if (res.data.data.siteLogo) setSiteLogo(res.data.data.siteLogo);
        if (res.data.data.siteName) setSiteName(res.data.data.siteName);
      } catch (err) {
        // keep defaults
      }
    };
    fetchLogo();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const solid = scrolled || !isHome;

  const linkClass = solid
    ? 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
    : 'text-white/70 hover:text-white';

  const iconBtnClass = solid
    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8'
    : 'text-white/60 hover:text-white hover:bg-white/10';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-white/90 dark:bg-surface/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/[0.07] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            {siteLogo ? (
              <img src={siteLogo} alt={siteName} className="h-9 w-9 rounded-xl object-cover logo-dark" />
            ) : (
              <img src="/staynear-logo.png" alt={siteName} className="h-9 w-9 logo-dark" />
            )}
            <span className={`text-xl font-display font-bold transition-colors duration-300 ${
              solid ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}>
              {siteName}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className={`text-sm font-medium transition-colors duration-200 ${linkClass}`}>
              Home
            </Link>
            <Link to="/pgs" className={`text-sm font-medium transition-colors duration-200 ${linkClass}`}>
              Find PGs
            </Link>
            {user && (
              <Link to="/favorites" className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${linkClass}`}>
                <Heart className="w-4 h-4" />
                Favorites
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${linkClass}`}>
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`p-2 rounded-xl transition-all duration-200 ${iconBtnClass}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    solid ? 'text-gray-900 dark:text-white' : 'text-white'
                  }`}>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    solid ? 'text-gray-500 dark:text-gray-400 hover:text-red-500' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                    solid
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/8'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-all duration-200 shadow-glow-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            {user && (
              <Link to="/favorites" className={`p-2 rounded-xl transition-all ${iconBtnClass}`}>
                <Heart className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className={`p-2 rounded-xl transition-all ${iconBtnClass}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className={`p-2 rounded-xl transition-all ${iconBtnClass}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="md:hidden bg-white dark:bg-surface border-t border-gray-100 dark:border-white/[0.07]">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pgs"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary-500 transition-colors"
            >
              Find PGs
            </Link>
            {user && (
              <Link
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary-500 transition-colors"
              >
                Favorites
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary-500 transition-colors"
              >
                Admin Panel
              </Link>
            )}

            <div className="pt-3 border-t border-gray-100 dark:border-white/[0.07] mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
