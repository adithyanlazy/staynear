import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PGListings from './pages/PGListings';
import PGDetails from './pages/PGDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerifyPhone from './pages/VerifyPhone';
import Favorites from './pages/Favorites';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import PGManagement from './pages/admin/PGManagement';
import UserManagement from './pages/admin/UserManagement';
import ReviewModeration from './pages/admin/ReviewModeration';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <PrivateRoute admin>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="pgs" element={<PGManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pgs" element={<PGListings />} />
                    <Route path="/pg/:id" element={<PGDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-phone" element={<VerifyPhone />} />
                    <Route
                      path="/favorites"
                      element={
                        <PrivateRoute>
                          <Favorites />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
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
