import { useState, useEffect } from 'react';
import { Search, Star, Trash2, MessageSquare } from 'lucide-react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchSearch = !search ||
      review.comment?.toLowerCase().includes(search.toLowerCase()) ||
      review.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      review.pg?.name?.toLowerCase().includes(search.toLowerCase());
    const matchRating = !filterRating || review.rating === parseInt(filterRating);
    return matchSearch && matchRating;
  });

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/reviews/${deleteId}`);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white">Review Moderation</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{filteredReviews.length} reviews found</p>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {ratingDistribution.map(({ rating, count }) => (
          <div key={rating} className="card p-2 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{rating}</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            <div className="h-1 sm:h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 sm:mt-2 overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="input-field py-2 text-sm w-full sm:w-40">
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredReviews.length > 0 ? filteredReviews.map(review => (
            <div key={review._id} className="card p-3 sm:p-5">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{review.user?.name?.[0] || '?'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{review.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">on</span>
                    <span className="text-xs sm:text-sm font-medium text-primary-500">{review.pg?.name || 'Deleted PG'}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                </div>
                <button
                  onClick={() => setDeleteId(review._id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="card p-8 sm:p-12 text-center">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default ReviewModeration;
