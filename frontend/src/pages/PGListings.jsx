import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUp } from 'lucide-react';
import { staggerContainer, staggerItem } from '../utils/motion';
import { usePageMeta } from '../hooks/usePageMeta';
import PGCard from '../components/PGCard';
import FilterPanel from '../components/FilterPanel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PGListings = () => {
  const [searchParams] = useSearchParams();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [filters, setFilters] = useState({
    area: searchParams.get('area') || '',
    gender: searchParams.get('gender') || '',
    foodIncluded: searchParams.get('foodIncluded') || '',
    acAvailable: searchParams.get('acAvailable') || '',
    sharingType: searchParams.get('sharingType') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    collegeNearby: searchParams.get('collegeNearby') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: 1,
  });

  const activeFilterCount = ['area', 'gender', 'foodIncluded', 'acAvailable', 'sharingType', 'collegeNearby']
    .filter(key => filters[key]).length + ((filters.minRent || filters.maxRent) ? 1 : 0);

  const metaScope = filters.collegeNearby
    ? `PGs near ${filters.collegeNearby}`
    : filters.area
      ? `PGs in ${filters.area}, Mangalore`
      : 'PG Accommodations in Mangalore';
  usePageMeta(
    `${metaScope} | StayNear`,
    `Browse ${metaScope.toLowerCase()} — filter by budget, sharing type, food and AC. Verified listings with student reviews.`
  );

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      area: searchParams.get('area') || '',
      collegeNearby: searchParams.get('collegeNearby') || '',
      gender: searchParams.get('gender') || '',
      foodIncluded: searchParams.get('foodIncluded') || '',
      acAvailable: searchParams.get('acAvailable') || '',
      sharingType: searchParams.get('sharingType') || '',
      minRent: searchParams.get('minRent') || '',
      maxRent: searchParams.get('maxRent') || '',
      page: 1,
    }));
  }, [searchParams]);

  useEffect(() => {
    const fetchPGs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const res = await api.get(`/pgs?${params.toString()}`);
        setPGs(prev => filters.page > 1 ? [...prev, ...res.data.data] : res.data.data);
        setTotal(res.data.total);
        setPagination(res.data.pagination);
      } catch (err) {
        toast.error('Failed to load PGs');
      } finally {
        setLoading(false);
      }
    };
    fetchPGs();
  }, [filters]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Find PG Accommodations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {total} PGs available in Mangalore
            {filters.area && ` in ${filters.area}`}
            {filters.collegeNearby && ` near ${filters.collegeNearby}`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              isOpen={true}
              setIsOpen={() => {}}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar variant="compact" />
              </div>
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden btn-secondary flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full bg-primary-500 text-white text-xs font-semibold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {filters.area || filters.collegeNearby || filters.gender || filters.foodIncluded || filters.acAvailable || filters.sharingType || filters.minRent || filters.maxRent ? (
              <motion.div layout className="flex flex-wrap gap-2 mb-6">
                <AnimatePresence>
                  {filters.area && (
                    <motion.span key="chip-area" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                      {filters.area}
                      <button onClick={() => setFilters(prev => ({ ...prev, area: '' }))} className="ml-1 hover:text-primary-900">×</button>
                    </motion.span>
                  )}
                  {filters.collegeNearby && (
                    <motion.span key="chip-college" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm">
                      {filters.collegeNearby}
                      <button onClick={() => setFilters(prev => ({ ...prev, collegeNearby: '' }))} className="ml-1 hover:text-secondary-900">×</button>
                    </motion.span>
                  )}
                  {filters.gender && (
                    <motion.span key="chip-gender" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm">
                      {filters.gender === 'co-ed' ? 'Co-Ed' : filters.gender}
                      <button onClick={() => setFilters(prev => ({ ...prev, gender: '' }))} className="ml-1 hover:text-accent-900">×</button>
                    </motion.span>
                  )}
                  {(filters.minRent || filters.maxRent) && (
                    <motion.span key="chip-rent" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                      ₹{filters.minRent || '0'} – ₹{filters.maxRent || '∞'}
                      <button onClick={() => setFilters(prev => ({ ...prev, minRent: '', maxRent: '' }))} className="ml-1 hover:text-green-900">×</button>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))}
              </div>
            ) : pgs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No PGs Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      area: '',
                      gender: '',
                      foodIncluded: '',
                      acAvailable: '',
                      sharingType: '',
                      minRent: '',
                      maxRent: '',
                      collegeNearby: '',
                      sort: '-createdAt',
                      page: 1,
                    });
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {pgs.map(pg => (
                    <motion.div key={pg._id} variants={staggerItem}>
                      <PGCard pg={pg} />
                    </motion.div>
                  ))}
                </motion.div>

                {pagination.next && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      className="btn-secondary"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          isOpen={filterOpen}
          setIsOpen={setFilterOpen}
        />
      </div>

      {/* Back to top — sits above the mobile filter FAB */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed right-6 bottom-24 lg:bottom-6 z-40 p-3 rounded-full bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 shadow-lg text-gray-600 dark:text-gray-300 hover:text-primary-500"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PGListings;
