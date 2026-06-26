import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import PGCard from '../components/PGCard';
import FilterPanel from '../components/FilterPanel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../utils/api';

const PGListings = () => {
  const [searchParams] = useSearchParams();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef(null);

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPGs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        if (debouncedSearch) params.append('search', debouncedSearch);

        const res = await api.get(`/pgs?${params.toString()}`);
        setPGs(res.data.data);
        setTotal(res.data.total);
        setPagination(res.data.pagination);
      } catch (err) {
        toast.error('Failed to load PGs');
      } finally {
        setLoading(false);
      }
    };
    fetchPGs();
  }, [filters, debouncedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

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
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="input-field pl-10"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </form>
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden btn-secondary flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {filters.area || filters.collegeNearby || filters.gender || filters.foodIncluded || filters.acAvailable || filters.sharingType || filters.minRent || filters.maxRent ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.area && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                    {filters.area}
                    <button onClick={() => setFilters(prev => ({ ...prev, area: '' }))} className="ml-1 hover:text-primary-900">×</button>
                  </span>
                )}
                {filters.collegeNearby && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm">
                    {filters.collegeNearby}
                    <button onClick={() => setFilters(prev => ({ ...prev, collegeNearby: '' }))} className="ml-1 hover:text-secondary-900">×</button>
                  </span>
                )}
                {filters.gender && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm">
                    {filters.gender === 'co-ed' ? 'Co-Ed' : filters.gender}
                    <button onClick={() => setFilters(prev => ({ ...prev, gender: '' }))} className="ml-1 hover:text-accent-900">×</button>
                  </span>
                )}
              </div>
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
                    setSearchQuery('');
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pgs.map(pg => (
                    <PGCard key={pg._id} pg={pg} />
                  ))}
                </div>

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

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
      />
    </div>
  );
};

export default PGListings;
