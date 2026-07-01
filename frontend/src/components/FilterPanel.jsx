import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { AREAS, GENDER_OPTIONS, SHARING_OPTIONS, SORT_OPTIONS } from '../utils/constants';

const FilterPanel = ({ filters, setFilters, isOpen, setIsOpen }) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
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
  };

  const hasActiveFilters = filters.area || filters.gender || filters.foodIncluded || 
    filters.acAvailable || filters.sharingType || filters.minRent || filters.maxRent;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 btn-primary rounded-full p-4 shadow-2xl"
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '-110%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-auto w-80 lg:w-72
        bg-white dark:bg-gray-800 z-50 lg:z-0
        overflow-y-auto lg:overflow-visible
        lg:rounded-2xl lg:shadow-lg lg:border lg:border-gray-200 dark:lg:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleChange('sort', e.target.value)}
                className="input-field text-sm"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Area</label>
              <select
                value={filters.area}
                onChange={(e) => handleChange('area', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">All Areas</option>
                {AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange('gender', filters.gender === opt.value ? '' : opt.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.gender === opt.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget Range (₹/month)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minRent}
                  onChange={(e) => handleChange('minRent', e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxRent}
                  onChange={(e) => handleChange('maxRent', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sharing Type</label>
              <div className="flex flex-wrap gap-2">
                {SHARING_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange('sharingType', filters.sharingType === opt.value ? '' : opt.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.sharingType === opt.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amenities</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.foodIncluded === 'true'}
                    onChange={(e) => handleChange('foodIncluded', e.target.checked ? 'true' : '')}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Food Included</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.acAvailable === 'true'}
                    onChange={(e) => handleChange('acAvailable', e.target.checked ? 'true' : '')}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">AC Available</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-full mt-6 btn-primary"
          >
            Show Results
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default FilterPanel;
