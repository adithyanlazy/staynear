import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Phone, Utensils, Snowflake, Users, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PGCard from '../components/PGCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PGDetails = () => {
  const { id } = useParams();
  const { user, addFavorite, removeFavorite } = useAuth();
  const [pg, setPG] = useState(null);
  const [similarPGs, setSimilarPGs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pgRes, similarRes, reviewsRes] = await Promise.all([
          api.get(`/pgs/${id}`),
          api.get(`/pgs/${id}/similar`),
          api.get(`/reviews/pg/${id}`),
        ]);
        setPG(pgRes.data.data);
        setSimilarPGs(similarRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch (err) {
        console.error('Error fetching PG details:', err);
        toast.error('Failed to load PG details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isFavorite = user?.favorites?.some(fav => (typeof fav === 'object' ? fav.pgId : fav) === id);

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(id);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add a review');
      return;
    }
    try {
      await api.post(`/reviews/pg/${id}`, reviewForm);
      toast.success('Review added successfully');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      const res = await api.get(`/reviews/pg/${id}`);
      setReviews(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton type="detail" />
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">PG Not Found</h2>
          <Link to="/pgs" className="btn-primary">Browse All PGs</Link>
        </div>
      </div>
    );
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  ];
  const images = pg.images?.length > 0 ? pg.images : defaultImages;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/pgs" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="w-full">
                <img
                  src={images[currentImage]}
                  alt={pg.name}
                  className="w-full object-contain"
                />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentImage ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === currentImage ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{pg.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {pg.area}, Mangalore
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {pg.rating?.toFixed(1) || 'New'} ({pg.numReviews} reviews)
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleFavorite}
                  className={`p-3 rounded-xl transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">{pg.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                  <div className="text-sm text-gray-500">Sharing</div>
                  <div className="font-semibold capitalize">{pg.sharingType}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-semibold capitalize">{pg.gender === 'co-ed' ? 'Co-Ed' : pg.gender}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                  <Utensils className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-sm text-gray-500">Food</div>
                  <div className="font-semibold">{pg.foodIncluded ? 'Included' : 'Not Included'}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                  <Snowflake className="w-6 h-6 mx-auto mb-2 text-cyan-500" />
                  <div className="text-sm text-gray-500">AC</div>
                  <div className="font-semibold">{pg.acAvailable ? 'Available' : 'Non-AC'}</div>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {pg.amenities?.map((amenity, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Reviews ({reviews.length})</h3>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="btn-primary text-sm py-2"
                  >
                    Add Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="input-field"
                      rows={3}
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary text-sm py-2">Submit</button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn-secondary text-sm py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h4 className="font-medium">{review.user?.name || 'Anonymous'}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary-500 mb-1">₹{pg.rent?.toLocaleString()}</div>
                  <div className="text-gray-500">per month</div>
                </div>
                <div className="text-center mb-6">
                  <span className="text-sm text-gray-500">Security Deposit: </span>
                  <span className="font-semibold">₹{pg.deposit?.toLocaleString()}</span>
                </div>

                <a
                  href={`tel:${pg.contactNumber}`}
                  className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>

                <button
                  onClick={handleFavorite}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'btn-secondary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
                </button>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{pg.contactNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Contact Person</div>
                      <div className="font-medium">{pg.contactName || 'Owner'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium">{pg.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Nearby Colleges</h3>
                <div className="space-y-2">
                  {pg.collegeNearby?.map((college, i) => (
                    <Link
                      key={i}
                      to={`/pgs?collegeNearby=${college}`}
                      className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      {college}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarPGs.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8">Similar PGs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarPGs.map(pg => (
                <PGCard key={pg._id} pg={pg} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PGDetails;
