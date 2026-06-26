import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, Utensils, Snowflake, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PGCard = ({ pg, onRemoveFavorite }) => {
  const { user, addFavorite, removeFavorite } = useAuth();
  const isFavorite = user?.favorites?.some(fav => {
    if (typeof fav === 'object') {
      return (fav.pgId?._id || fav.pgId || fav._id) === pg._id;
    }
    return fav === pg._id;
  });

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(pg._id);
        toast.success('Removed from favorites');
        if (onRemoveFavorite) onRemoveFavorite(pg._id);
      } else {
        await addFavorite(pg._id);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Link to={`/pg/${pg._id}`} className="card-hover group">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={pg.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
            alt={pg.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <button
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {pg.featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
            pg.gender === 'boys' 
              ? 'bg-blue-500/90 text-white' 
              : pg.gender === 'girls' 
                ? 'bg-pink-500/90 text-white' 
                : 'bg-purple-500/90 text-white'
          }`}>
            {pg.gender === 'co-ed' ? 'Co-Ed' : pg.gender === 'boys' ? 'Boys' : 'Girls'}
          </span>
          {pg.foodIncluded && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-500/90 text-white flex items-center gap-1">
              <Utensils className="w-3 h-3" /> Food
            </span>
          )}
          {pg.acAvailable && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-cyan-500/90 text-white flex items-center gap-1">
              <Snowflake className="w-3 h-3" /> AC
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
            {pg.name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{pg.rating?.toFixed(1) || 'New'}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{pg.area}, Mangalore</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {pg.sharingType} sharing
          </span>
          {pg.amenities?.includes('WiFi') && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              WiFi
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-2xl font-bold text-primary-500">₹{pg.rent?.toLocaleString()}</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <span className="text-sm text-gray-500">₹{pg.deposit?.toLocaleString()} deposit</span>
        </div>
      </div>
    </Link>
  );
};

export default PGCard;
