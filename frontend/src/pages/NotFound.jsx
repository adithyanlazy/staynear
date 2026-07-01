import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const NotFound = () => {
  usePageMeta('Page Not Found | StayNear');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            to="/pgs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
          >
            <Search className="w-5 h-5" />
            Find PGs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
