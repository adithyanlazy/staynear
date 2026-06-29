import { Link } from 'react-router-dom';
import { Home, Search, Star, Shield } from 'lucide-react';

const AuthGate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="min-h-screen flex flex-col">
        <header className="px-4 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/staynear-logo.png" alt="StayNear" className="w-10 h-10 logo-dark" />
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">StayNear</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <img src="/staynear-logo.png" alt="StayNear" className="w-20 h-20 mx-auto mb-6 logo-dark" />
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Find Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500"> PG Home</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover comfortable PG accommodations near your college in Mangalore. 
                Search by area, budget, and amenities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Search</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Find PGs by college, area, or budget</p>
              </div>
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-secondary-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real Reviews</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Read genuine reviews from students</p>
              </div>
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Verified Listings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All PGs are verified for accuracy</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-4 py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
            StayNear — PG Accommodation Finder for Mangalore
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthGate;
