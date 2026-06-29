import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthGate from './components/AuthGate';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout';

const Home = lazy(() => import('./pages/Home'));
const PGListings = lazy(() => import('./pages/PGListings'));
const PGDetails = lazy(() => import('./pages/PGDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Favorites = lazy(() => import('./pages/Favorites'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const PGManagement = lazy(() => import('./pages/admin/PGManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ReviewModeration = lazy(() => import('./pages/admin/ReviewModeration'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <AuthGate />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pgs" element={<PGListings />} />
            <Route path="/pg/:id" element={<PGDetails />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin/*"
            element={
              <PrivateRoute admin>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
            <Route path="pgs" element={<Suspense fallback={<PageLoader />}><PGManagement /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<PageLoader />}><UserManagement /></Suspense>} />
            <Route path="reviews" element={<Suspense fallback={<PageLoader />}><ReviewModeration /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
          </Route>

          <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />

          <Route path="*" element={<AppContent />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;