import { useState, useEffect } from 'react';
import { Building2, Users, MessageSquare, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/admin/StatsCard';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-3 sm:p-6 animate-pulse">
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-24 mb-3 sm:mb-4"></div>
              <div className="h-5 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 sm:w-16 mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-14 sm:w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatsCard icon={Building2} label="Total PGs" value={stats?.totalPGs || 0} color="primary" />
        <StatsCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="secondary" />
        <StatsCard icon={MessageSquare} label="Total Reviews" value={stats?.totalReviews || 0} color="accent" />
        <StatsCard icon={Star} label="Avg Rent" value={`₹${(stats?.avgRent || 0).toLocaleString()}`} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent PGs</h2>
            <Link to="/admin/pgs" className="text-xs sm:text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {stats?.recentPGs?.length > 0 ? (
              stats.recentPGs.map((pg) => (
                <div key={pg._id} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <img
                    src={pg.images?.[0] || 'https://via.placeholder.com/48'}
                    alt={pg.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm">{pg.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{pg.area}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">₹{pg.rent?.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {pg.rating?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No PGs yet</p>
            )}
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Reviews</h2>
            <Link to="/admin/reviews" className="text-xs sm:text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {stats?.recentReviews?.length > 0 ? (
              stats.recentReviews.map((review) => (
                <div key={review._id} className="p-2 sm:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {review.user?.name || 'Unknown'} on {review.pg?.name || 'Deleted PG'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active PGs</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.activePGs || 0}</p>
          <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${stats?.totalPGs ? (stats.activePGs / stats.totalPGs) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Gender Split</h3>
          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-500">{stats?.genderBreakdown?.boys || 0}</p>
              <p className="text-xs text-gray-500">Boys</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-pink-500">{stats?.genderBreakdown?.girls || 0}</p>
              <p className="text-xs text-gray-500">Girls</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-500">{stats?.genderBreakdown?.coEd || 0}</p>
              <p className="text-xs text-gray-500">Co-Ed</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">User Roles</h3>
          <div className="space-y-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Admins</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.adminCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Users</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.userCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
