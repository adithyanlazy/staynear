import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Search, X, Star, ImagePlus, GripVertical, Video, Film, UploadCloud } from 'lucide-react';
import { AREAS, COLLEGES, GENDER_OPTIONS, SHARING_OPTIONS, AMENITIES } from '../../utils/constants';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const PGManagement = () => {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPG, setEditingPG] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [videoDragIndex, setVideoDragIndex] = useState(null);
  const [videoDragOverIndex, setVideoDragOverIndex] = useState(null);
  const [mediaTab, setMediaTab] = useState('images');
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [isDraggingVideos, setIsDraggingVideos] = useState(false);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const videoDragItem = useRef(null);
  const videoDragOverItem = useRef(null);
  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', description: '', rent: '', deposit: '', gender: 'boys',
    foodIncluded: false, acAvailable: false, sharingType: 'double',
    area: 'Surathkal', collegeNearby: [], address: '', latitude: '',
    longitude: '', images: [], videos: [], amenities: [], contactNumber: '',
    contactName: '', featured: false,
  });

  useEffect(() => { fetchPGs(); }, []);

  const fetchPGs = async () => {
    try {
      const res = await api.get('/pgs/admin/all?limit=100');
      setPGs(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch PGs');
    } finally {
      setLoading(false);
    }
  };

  const filteredPGs = pgs.filter(pg => {
    const matchSearch = !search || pg.name.toLowerCase().includes(search.toLowerCase()) || pg.area.toLowerCase().includes(search.toLowerCase());
    const matchArea = !filterArea || pg.area === filterArea;
    const matchGender = !filterGender || pg.gender === filterGender;
    return matchSearch && matchArea && matchGender;
  });

  const handleOpenModal = (pg = null) => {
    if (pg) {
      setEditingPG(pg);
      setFormData({
        name: pg.name, description: pg.description, rent: pg.rent, deposit: pg.deposit,
        gender: pg.gender, foodIncluded: pg.foodIncluded, acAvailable: pg.acAvailable,
        sharingType: pg.sharingType, area: pg.area, collegeNearby: pg.collegeNearby || [],
        address: pg.address, latitude: pg.latitude, longitude: pg.longitude,
        images: pg.images || [], videos: pg.videos || [], amenities: pg.amenities || [],
        contactNumber: pg.contactNumber, contactName: pg.contactName || '', featured: pg.featured,
      });
    } else {
      setEditingPG(null);
      setFormData({
        name: '', description: '', rent: '', deposit: '', gender: 'boys',
        foodIncluded: false, acAvailable: false, sharingType: 'double',
        area: 'Surathkal', collegeNearby: [], address: '', latitude: '',
        longitude: '', images: [], videos: [], amenities: [], contactNumber: '',
        contactName: '', featured: false,
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

  const handleDelete = async () => {
    try {
      await api.delete(`/pgs/${deleteId}`);
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

  const isValidImageUrl = (url) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) ||
      url.includes('unsplash') || url.includes('images.unsplash') ||
      url.includes('imgur') || url.includes('cloudinary');
  };

  const isValidVideoUrl = (url) => {
    return /^https?:\/\/.+\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) ||
      url.includes('youtube.com') || url.includes('youtu.be') ||
      url.includes('vimeo.com') || url.includes('drive.google.com');
  };

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    if (!isValidImageUrl(url)) {
      toast.error('Please enter a valid image URL');
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    setNewImageUrl('');
    toast.success('Image added');
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleImageUrlKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFiles = (files) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files only');
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    const oversized = imageFiles.filter(f => f.size > maxSize);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} file(s) exceed 5MB limit`);
      return;
    }
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, e.target.result] }));
      };
      reader.readAsDataURL(file);
    });
    toast.success(`${imageFiles.length} image(s) added`);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDraggingFiles(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileDragEnter = (e) => {
    e.preventDefault();
    setIsDraggingFiles(true);
  };

  const handleFileDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDraggingFiles(false);
    }
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
  };

  const addVideo = () => {
    const url = newVideoUrl.trim();
    if (!url) return;
    if (!isValidVideoUrl(url)) {
      toast.error('Please enter a valid video URL (YouTube, Vimeo, MP4, etc.)');
      return;
    }
    setFormData(prev => ({ ...prev, videos: [...prev.videos, url] }));
    setNewVideoUrl('');
    toast.success('Video added');
  };

  const removeVideo = (index) => {
    setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  const handleVideoUrlKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addVideo();
    }
  };

  const handleVideoFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processVideoFiles(files);
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
  };

  const processVideoFiles = (files) => {
    const videoFiles = files.filter(f => f.type.startsWith('video/'));
    if (videoFiles.length === 0) {
      toast.error('Please select video files only');
      return;
    }
    const maxSize = 50 * 1024 * 1024;
    const oversized = videoFiles.filter(f => f.size > maxSize);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} file(s) exceed 50MB limit`);
      return;
    }
    videoFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, videos: [...prev.videos, e.target.result] }));
      };
      reader.readAsDataURL(file);
    });
    toast.success(`${videoFiles.length} video(s) added`);
  };

  const handleVideoFileDrop = (e) => {
    e.preventDefault();
    setIsDraggingVideos(false);
    const files = Array.from(e.dataTransfer.files);
    processVideoFiles(files);
  };

  const handleVideoFileDragEnter = (e) => {
    e.preventDefault();
    setIsDraggingVideos(true);
  };

  const handleVideoFileDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDraggingVideos(false);
    }
  };

  const handleVideoFileDragOver = (e) => {
    e.preventDefault();
  };

  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const getVimeoEmbedUrl = (url) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  };

  const getVideoEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return getYouTubeEmbedUrl(url);
    if (url.includes('vimeo.com')) return getVimeoEmbedUrl(url);
    return url;
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const startIndex = dragItem.current;
    if (startIndex === null || startIndex === dropIndex) return;

    const newImages = [...formData.images];
    const [removed] = newImages.splice(startIndex, 1);
    newImages.splice(dropIndex, 0, removed);

    setFormData(prev => ({ ...prev, images: newImages }));
    setDragIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleVideoDragStart = (e, index) => {
    videoDragItem.current = index;
    setVideoDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleVideoDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    videoDragOverItem.current = index;
    setVideoDragOverIndex(index);
  };

  const handleVideoDragEnter = (e, index) => {
    e.preventDefault();
    setVideoDragOverIndex(index);
  };

  const handleVideoDragLeave = (e) => {
    e.preventDefault();
    setVideoDragOverIndex(null);
  };

  const handleVideoDrop = (e, dropIndex) => {
    e.preventDefault();
    const startIndex = videoDragItem.current;
    if (startIndex === null || startIndex === dropIndex) return;

    const newVideos = [...formData.videos];
    const [removed] = newVideos.splice(startIndex, 1);
    newVideos.splice(dropIndex, 0, removed);

    setFormData(prev => ({ ...prev, videos: newVideos }));
    setVideoDragIndex(null);
    setVideoDragOverIndex(null);
    videoDragItem.current = null;
    videoDragOverItem.current = null;
  };

  const handleVideoDragEnd = () => {
    setVideoDragIndex(null);
    setVideoDragOverIndex(null);
    videoDragItem.current = null;
    videoDragOverItem.current = null;
  };

  const moveImage = (from, to) => {
    if (to < 0 || to >= formData.images.length) return;
    const newImages = [...formData.images];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const moveVideo = (from, to) => {
    if (to < 0 || to >= formData.videos.length) return;
    const newVideos = [...formData.videos];
    const [removed] = newVideos.splice(from, 1);
    newVideos.splice(to, 0, removed);
    setFormData(prev => ({ ...prev, videos: newVideos }));
  };

  const genderBadge = (gender) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    if (gender === 'boys') return `${base} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`;
    if (gender === 'girls') return `${base} bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400`;
    return `${base} bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white">PG Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{filteredPGs.length} listings found</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> Add PG
        </button>
      </div>

      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search PGs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
          <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} className="input-field py-2 text-sm w-full sm:w-40">
            <option value="">All Areas</option>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="input-field py-2 text-sm w-full sm:w-40">
            <option value="">All Genders</option>
            {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="hidden md:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPGs.length > 0 ? filteredPGs.map(pg => (
                    <tr key={pg._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={pg.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{pg.name}</p>
                            {pg.featured && <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{pg.area}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">₹{pg.rent?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={genderBadge(pg.gender)}>
                          {pg.gender === 'co-ed' ? 'Co-Ed' : pg.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-600 dark:text-gray-400">{pg.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${pg.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {pg.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(pg)} className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(pg._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No PGs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {filteredPGs.length > 0 ? filteredPGs.map(pg => (
              <div key={pg._id} className="card p-4">
                <div className="flex gap-3">
                  <img src={pg.images?.[0] || 'https://via.placeholder.com/56'} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{pg.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{pg.area}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleOpenModal(pg)} className="p-1.5 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(pg._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">₹{pg.rent?.toLocaleString()}</span>
                      <span className={genderBadge(pg.gender)}>
                        {pg.gender === 'co-ed' ? 'Co-Ed' : pg.gender}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {pg.rating?.toFixed(1) || 'N/A'}
                      </span>
                      {pg.featured && <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">Featured</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${pg.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {pg.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No PGs found</div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{editingPG ? 'Edit PG' : 'Add New PG'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">PG Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rent (₹/month)</label>
                  <input type="number" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deposit (₹)</label>
                  <input type="number" value={formData.deposit} onChange={(e) => setFormData({ ...formData, deposit: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="input-field">
                    {GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sharing Type</label>
                  <select value={formData.sharingType} onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })} className="input-field">
                    {SHARING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area</label>
                  <select value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="input-field">
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input type="text" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} className="input-field" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="input-field" required />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'foodIncluded', label: 'Food Included' },
                  { key: 'acAvailable', label: 'AC Available' },
                  { key: 'featured', label: 'Featured' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nearby Colleges</label>
                <div className="flex flex-wrap gap-2">
                  {COLLEGES.map(college => (
                    <button key={college} type="button" onClick={() => toggleCollege(college)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${formData.collegeNearby.includes(college) ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                      {college}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map(amenity => (
                    <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${formData.amenities.includes(amenity) ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-3">
                  <button type="button" onClick={() => setMediaTab('images')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${mediaTab === 'images' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    <ImagePlus className="w-4 h-4" /> Images ({formData.images.length})
                  </button>
                  <button type="button" onClick={() => setMediaTab('videos')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${mediaTab === 'videos' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    <Film className="w-4 h-4" /> Videos ({formData.videos.length})
                  </button>
                </div>

                {mediaTab === 'images' && (
                  <div>
                    <div
                      onDrop={handleFileDrop}
                      onDragEnter={handleFileDragEnter}
                      onDragLeave={handleFileDragLeave}
                      onDragOver={handleFileDragOver}
                      className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all cursor-pointer ${
                        isDraggingFiles
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <UploadCloud className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 ${isDraggingFiles ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      <p className={`text-sm font-medium ${isDraggingFiles ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {isDraggingFiles ? 'Drop images here' : 'Drag & drop images here, or click to browse'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP — Max 5MB each</p>
                    </div>

                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                      <span className="text-xs text-gray-400">or paste URL</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={handleImageUrlKeyDown}
                        placeholder="Paste image URL and press Enter or click Add"
                        className="input-field flex-1"
                      />
                      <button type="button" onClick={addImage} className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <GripVertical className="w-3 h-3" /> Drag to reorder or use arrow buttons. First image is the cover.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {formData.images.map((url, index) => (
                            <div
                              key={index}
                              draggable
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragOver={(e) => handleDragOver(e, index)}
                              onDragEnter={(e) => handleDragEnter(e, index)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, index)}
                              onDragEnd={handleDragEnd}
                              className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                                dragIndex === index ? 'opacity-50 scale-95 border-primary-500' :
                                dragOverIndex === index ? 'border-primary-500 scale-105' :
                                'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                              }`}
                            >
                              <img src={url} alt={`PG image ${index + 1}`} className="w-full h-full object-cover" draggable={false} />
                              <div className="absolute top-2 left-2 flex items-center gap-1">
                                {index === 0 && (
                                  <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Cover</span>
                                )}
                                <span className="bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">#{index + 1}</span>
                              </div>
                              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(index, index - 1); }}
                                  disabled={index === 0}
                                  className="p-1 bg-black/60 rounded text-white hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(index, index + 1); }}
                                  disabled={index === formData.images.length - 1}
                                  className="p-1 bg-black/60 rounded text-white hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                  className="p-1 bg-red-500 rounded text-white hover:bg-red-600">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <GripVertical className="w-6 h-6 text-white/70" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.images.length === 0 && (
                      <div className="mt-3 text-center py-4">
                        <ImagePlus className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No images added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Upload from your computer or paste a URL above</p>
                      </div>
                    )}
                  </div>
                )}

                {mediaTab === 'videos' && (
                  <div>
                    <div
                      onDrop={handleVideoFileDrop}
                      onDragEnter={handleVideoFileDragEnter}
                      onDragLeave={handleVideoFileDragLeave}
                      onDragOver={handleVideoFileDragOver}
                      className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all cursor-pointer ${
                        isDraggingVideos
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                      onClick={() => videoFileInputRef.current?.click()}
                    >
                      <input
                        ref={videoFileInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoFileSelect}
                        className="hidden"
                      />
                      <UploadCloud className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 ${isDraggingVideos ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      <p className={`text-sm font-medium ${isDraggingVideos ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {isDraggingVideos ? 'Drop videos here' : 'Drag & drop video files here, or click to browse'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">MP4, WebM, MOV, OGG — Max 50MB each</p>
                    </div>

                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                      <span className="text-xs text-gray-400">or paste URL</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        onKeyDown={handleVideoUrlKeyDown}
                        placeholder="Paste video URL (YouTube, Vimeo, MP4) and press Enter"
                        className="input-field flex-1"
                      />
                      <button type="button" onClick={addVideo} className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Supports YouTube, Vimeo, MP4, WebM, and MOV URLs</p>
                    {formData.videos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <GripVertical className="w-3 h-3" /> Drag to reorder or use arrow buttons.
                        </p>
                        <div className="space-y-3">
                          {formData.videos.map((url, index) => {
                            const embedUrl = getVideoEmbedUrl(url);
                            const isDirectVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
                            return (
                              <div
                                key={index}
                                draggable
                                onDragStart={(e) => handleVideoDragStart(e, index)}
                                onDragOver={(e) => handleVideoDragOver(e, index)}
                                onDragEnter={(e) => handleVideoDragEnter(e, index)}
                                onDragLeave={handleVideoDragLeave}
                                onDrop={(e) => handleVideoDrop(e, index)}
                                onDragEnd={handleVideoDragEnd}
                                className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                                  videoDragIndex === index ? 'opacity-50 border-primary-500' :
                                  videoDragOverIndex === index ? 'border-primary-500' :
                                  'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                }`}
                              >
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50">
                                  <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <div className="w-16 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0 overflow-hidden">
                                    {isDirectVideo ? (
                                      <video src={url} className="w-full h-full object-cover" muted />
                                    ) : embedUrl ? (
                                      <iframe src={embedUrl} className="w-full h-full" allowFullScreen frameBorder="0" title={`Video ${index + 1}`} />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Video className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 dark:text-white truncate">{url}</p>
                                    <p className="text-xs text-gray-400">Video {index + 1}</p>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button type="button" onClick={() => moveVideo(index, index - 1)}
                                      disabled={index === 0}
                                      className="p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    <button type="button" onClick={() => moveVideo(index, index + 1)}
                                      disabled={index === formData.videos.length - 1}
                                      className="p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <button type="button" onClick={() => removeVideo(index)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {formData.videos.length === 0 && (
                      <div className="mt-3 text-center py-4">
                        <Film className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No videos added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Upload from your computer or paste a URL above</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingPG ? 'Update PG' : 'Create PG'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete PG"
        message="Are you sure you want to delete this PG? This will also remove all associated reviews."
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default PGManagement;
