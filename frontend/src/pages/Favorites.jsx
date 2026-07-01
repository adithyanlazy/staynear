import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PGCard from '../components/PGCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../utils/api';
import { usePageMeta } from '../hooks/usePageMeta';

const Favorites = () => {
  usePageMeta('My Favorites | StayNear');
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/auth/favorites');
        setFavorites(res.data.data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user?.favorites]);

  const handleRemoveFavorite = (pgId) => {
    setFavorites(prev => prev.filter(pg => pg._id !== pgId));
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} saved {favorites.length === 1 ? 'PG' : 'PGs'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start exploring and save PGs you like!
            </p>
            <Link to="/pgs" className="btn-primary inline-flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find PGs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(pg => (
              <PGCard key={pg._id} pg={pg} onRemoveFavorite={handleRemoveFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
