import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart, Utensils, Snowflake, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { isPGFavorite } from '../utils/favorites';
import { spring } from '../utils/motion';
import { nearestCollege } from '../utils/distance';

const MotionLink = motion.create(Link);

const PGCard = ({ pg, onRemoveFavorite }) => {
  const { user, addFavorite, removeFavorite } = useAuth();
  const isFavorite = isPGFavorite(user, pg._id);

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

  const near = nearestCollege(pg);

  const genderColor = {
    boys: 'bg-blue-500/85',
    girls: 'bg-pink-500/85',
    'co-ed': 'bg-violet-500/85',
  }[pg.gender] || 'bg-violet-500/85';

  const genderLabel = {
    boys: 'Boys',
    girls: 'Girls',
    'co-ed': 'Co-Ed',
  }[pg.gender] || pg.gender;

  return (
    <MotionLink
      to={`/pg/${pg._id}`}
      className="card group block"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={pg.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
          alt={pg.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {pg.available === false && (
            <span className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Full
            </span>
          )}
          {pg.featured && (
            <span className="bg-gold-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              ✦ Featured
            </span>
          )}
          <span className={`${genderColor} text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm`}>
            {genderLabel}
          </span>
        </div>

        {/* Bottom-left amenity tags */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {pg.foodIncluded && (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
              <Utensils className="w-3 h-3" /> Food
            </span>
          )}
          {pg.acAvailable && (
            <span className="bg-cyan-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
              <Snowflake className="w-3 h-3" /> AC
            </span>
          )}
        </div>

        {/* Bottom-right rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-gold-500 fill-current" />
          <span className="text-xs font-semibold text-gray-800 dark:text-white">
            {pg.rating?.toFixed(1) || 'New'}
          </span>
        </div>

        {/* Favorite button */}
        <motion.button
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          whileTap={{ scale: 0.85 }}
          animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors line-clamp-1 mb-1.5">
          {pg.name}
        </h3>

        <div className="flex items-center text-gray-400 dark:text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-gray-300 dark:text-gray-600" />
          <span className="line-clamp-1">{pg.area}, Mangalore</span>
        </div>

        {near && (
          <div className="text-xs font-medium text-primary-500 dark:text-primary-400 mb-3 -mt-1.5">
            {near.label}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {pg.sharingType} sharing
          </span>
          {pg.amenities?.includes('WiFi') && (
            <span className="text-primary-500 dark:text-primary-400 font-medium">
              WiFi
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{pg.rent?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">/mo</span>
          </div>
          <div className="flex items-center gap-1 text-primary-500 dark:text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </MotionLink>
  );
};

export default PGCard;
