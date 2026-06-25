import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { AREAS, COLLEGES, GENDER_OPTIONS, SHARING_OPTIONS, AMENITIES } from '../utils/constants';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Admin = () => {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPG, setEditingPG] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rent: '',
    deposit: '',
    gender: 'boys',
    foodIncluded: false,
    acAvailable: false,
    sharingType: 'double',
    area: 'Surathkal',
    collegeNearby: [],
    address: '',
    latitude: '',
    longitude: '',
    images: [],
    amenities: [],
    contactNumber: '',
    contactName: '',
    featured: false,
  });

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      const res = await api.get('/pgs?limit=100');
      setPGs(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch PGs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pg = null) => {
    if (pg) {
      setEditingPG(pg);
      setFormData({
        name: pg.name,
        description: pg.description,
        rent: pg.rent,
        deposit: pg.deposit,
        gender: pg.gender,
        foodIncluded: pg.foodIncluded,
        acAvailable: pg.acAvailable,
        sharingType: pg.sharingType,
        area: pg.area,
        collegeNearby: pg.collegeNearby || [],
        address: pg.address,
        latitude: pg.latitude,
        longitude: pg.longitude,
        images: pg.images || [],
        amenities: pg.amenities || [],
        contactNumber: pg.contactNumber,
        contactName: pg.contactName || '',
        featured: pg.featured,
      });
    } else {
      setEditingPG(null);
      setFormData({
        name: '',
        description: '',
        rent: '',
        deposit: '',
        gender: 'boys',
        foodIncluded: false,
        acAvailable: false,
        sharingType: 'double',
        area: 'Surathkal',
        collegeNearby: [],
        address: '',
        latitude: '',
        longitude: '',
        images: [],
        amenities: [],
        contactNumber: '',
        contactName: '',
        featured: false,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPG) {
        await api.put(`/pgs/${editingPG._id}`, formData);
        toast.success('PG updated successfully');
      } else {
        await api.post('/pgs', formData);
        toast.success('PG created successfully');
      }
      setShowModal(false);
      fetchPGs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PG?')) return;
    try {
      await api.delete(`/pgs/${id}`);
      toast.success('PG deleted successfully');
      fetchPGs();
    } catch (err) {
      toast.error('Failed to delete PG');
    }
  };

  const toggleCollege = (college) => {
    setFormData(prev => ({
      ...prev,
      collegeNearby: prev.collegeNearby.includes(college)
        ? prev.collegeNearby.filter(c => c !== college)
        : [...prev.collegeNearby, college],
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage PG listings</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add PG
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pgs.map(pg => (
                    <tr key={pg._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{pg.name}</div>
                        {pg.featured && (
                          <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">Featured</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{pg.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">₹{pg.rent?.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pg.gender === 'boys' ? 'bg-blue-100 text-blue-700' :
                          pg.gender === 'girls' ? 'bg-pink-100 text-pink-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {pg.gender === 'co-ed' ? 'Co-Ed' : pg.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {pg.rating?.toFixed(1) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(pg)}
                            className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pg._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingPG ? 'Edit PG' : 'Add New PG'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">PG Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rent (₹/month)</label>
                  <input
                    type="number"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deposit (₹)</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="input-field"
                  >
                    {GENDER_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sharing Type</label>
                  <select
                    value={formData.sharingType}
                    onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })}
                    className="input-field"
                  >
                    {SHARING_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="input-field"
                  >
                    {AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.foodIncluded}
                    onChange={(e) => setFormData({ ...formData, foodIncluded: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Food Included</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acAvailable}
                    onChange={(e) => setFormData({ ...formData, acAvailable: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">AC Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Featured</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nearby Colleges</label>
                <div className="flex flex-wrap gap-2">
                  {COLLEGES.map(college => (
                    <button
                      key={college}
                      type="button"
                      onClick={() => toggleCollege(college)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.collegeNearby.includes(college)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {college}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingPG ? 'Update PG' : 'Create PG'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
