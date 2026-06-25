import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, GraduationCap, IndianRupee } from 'lucide-react';
import { COLLEGES, AREAS } from '../utils/constants';

const SearchBar = ({ variant = 'hero' }) => {
  const [searchType, setSearchType] = useState('college');
  const [query, setQuery] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const items = searchType === 'college' ? COLLEGES : AREAS;
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const buildParams = (searchQuery) => {
    const params = new URLSearchParams();
    if (searchQuery) {
      if (searchType === 'college') {
        params.append('collegeNearby', searchQuery);
      } else {
        params.append('area', searchQuery);
      }
    }
    if (minRent) params.append('minRent', minRent);
    if (maxRent) params.append('maxRent', maxRent);
    return params.toString();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query && !minRent && !maxRent) return;
    navigate(`/pgs?${buildParams(query)}`);
  };

  const handleSelect = (item) => {
    setQuery(item);
    setShowDropdown(false);
    navigate(`/pgs?${buildParams(item)}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search by college or area..."
            className="input-field pl-10"
          />
          {showDropdown && query && filteredItems.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-60 overflow-auto">
              {filteredItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  {searchType === 'college' ? (
                    <GraduationCap className="w-5 h-5 text-primary-500" />
                  ) : (
                    <MapPin className="w-5 h-5 text-accent-500" />
                  )}
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="number"
          placeholder="Min ₹"
          value={minRent}
          onChange={(e) => setMinRent(e.target.value)}
          className="input-field w-24 text-sm"
        />
        <input
          type="number"
          placeholder="Max ₹"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
          className="input-field w-24 text-sm"
        />
        <button type="submit" className="btn-primary">
          <Search className="w-5 h-5" />
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="glass rounded-2xl p-2 shadow-xl">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setSearchType('college')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                searchType === 'college'
                  ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              College
            </button>
            <button
              type="button"
              onClick={() => setSearchType('area')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                searchType === 'area'
                  ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Area
            </button>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder={searchType === 'college' ? 'Select your college...' : 'Choose an area...'}
              className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none"
            />
            {showDropdown && filteredItems.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-60 overflow-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                  >
                    {searchType === 'college' ? (
                      <GraduationCap className="w-5 h-5 text-primary-500" />
                    ) : (
                      <MapPin className="w-5 h-5 text-accent-500" />
                    )}
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3 px-2 pt-3 border-t border-gray-200/50 dark:border-gray-600/50">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <IndianRupee className="w-4 h-4" />
            <span>Budget:</span>
          </div>
          <input
            type="number"
            placeholder="Min"
            value={minRent}
            onChange={(e) => setMinRent(e.target.value)}
            className="w-24 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            className="w-24 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-xs text-gray-400">₹/month</span>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
