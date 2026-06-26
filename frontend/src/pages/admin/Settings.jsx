import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, Image, ToggleLeft, ToggleRight, MapPin, GraduationCap, Plus, X, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    maintenanceMode: false,
    allowRegistrations: true,
    maxImagesPerPG: 5,
    areas: [],
    colleges: [],
    popularAreas: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newArea, setNewArea] = useState('');
  const [newCollege, setNewCollege] = useState('');
  const [newPopularArea, setNewPopularArea] = useState('');
  const [newPopularAreaImage, setNewPopularAreaImage] = useState('');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      const data = res.data.data;
      setSettings({
        ...settings,
        ...data,
        areas: data.areas || [],
        colleges: data.colleges || [],
        popularAreas: data.popularAreas || [],
      });
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        maintenanceMode: settings.maintenanceMode,
        allowRegistrations: settings.allowRegistrations,
        maxImagesPerPG: settings.maxImagesPerPG,
        areas: settings.areas || [],
        colleges: settings.colleges || [],
        popularAreas: settings.popularAreas || [],
      };
      await api.put('/admin/settings', payload);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addArea = () => {
    const val = newArea.trim();
    if (!val) return;
    if (settings.areas?.includes(val)) {
      toast.error('Area already exists');
      return;
    }
    setSettings(prev => ({ ...prev, areas: [...(prev.areas || []), val] }));
    setNewArea('');
  };

  const removeArea = (area) => {
    setSettings(prev => ({ ...prev, areas: (prev.areas || []).filter(a => a !== area) }));
  };

  const addCollege = () => {
    const val = newCollege.trim();
    if (!val) return;
    if (settings.colleges?.includes(val)) {
      toast.error('College already exists');
      return;
    }
    setSettings(prev => ({ ...prev, colleges: [...(prev.colleges || []), val] }));
    setNewCollege('');
  };

  const removeCollege = (college) => {
    setSettings(prev => ({ ...prev, colleges: (prev.colleges || []).filter(c => c !== college) }));
  };

  const addPopularArea = () => {
    const name = newPopularArea.trim();
    const image = newPopularAreaImage.trim();
    if (!name) return;
    if (settings.popularAreas?.some(a => a.name === name)) {
      toast.error('Area already exists');
      return;
    }
    setSettings(prev => ({ ...prev, popularAreas: [...(prev.popularAreas || []), { name, image }] }));
    setNewPopularArea('');
    setNewPopularAreaImage('');
  };

  const removePopularArea = (index) => {
    setSettings(prev => ({ ...prev, popularAreas: (prev.popularAreas || []).filter((_, i) => i !== index) }));
  };

  const updatePopularAreaName = (index, name) => {
    setSettings(prev => ({
      ...prev,
      popularAreas: (prev.popularAreas || []).map((a, i) => i === index ? { ...a, name } : a)
    }));
  };

  const updatePopularAreaImage = (index, image) => {
    setSettings(prev => ({
      ...prev,
      popularAreas: (prev.popularAreas || []).map((a, i) => i === index ? { ...a, image } : a)
    }));
  };

  const handlePopularAreaFile = (index, file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      updatePopularAreaImage(index, e.target.result);
      toast.success('Image uploaded');
    };
    reader.readAsDataURL(file);
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button onClick={() => onChange(!enabled)} className="relative">
        {enabled ? (
          <ToggleRight className="w-10 h-10 text-primary-500" />
        ) : (
          <ToggleLeft className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        )}
      </button>
    </div>
  );

  const TagEditor = ({ icon: Icon, iconColor, label, items, value, onChange, onAdd, onRemove, placeholder }) => (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        {label}
        <span className="ml-auto text-sm font-normal text-gray-500">{items.length} items</span>
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          placeholder={placeholder}
          className="input-field flex-1"
        />
        <button onClick={onAdd} className="btn-primary px-4 flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            {item}
            <button onClick={() => onRemove(item)} className="hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500">No items added yet</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white">Website Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Configure your platform settings</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-500" />
            General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary-500" />
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-primary-500" />
            Listings
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Max Images per PG</label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.maxImagesPerPG}
              onChange={(e) => setSettings({ ...settings, maxImagesPerPG: parseInt(e.target.value) || 5 })}
              className="input-field"
            />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Toggles</h2>
          <ToggleSwitch
            enabled={settings.maintenanceMode}
            onChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
            label="Maintenance Mode"
            description="Temporarily disable public access to the site"
          />
          <ToggleSwitch
            enabled={settings.allowRegistrations}
            onChange={(val) => setSettings({ ...settings, allowRegistrations: val })}
            label="Allow Registrations"
            description="Allow new users to create accounts"
          />
        </div>

        <TagEditor
          icon={MapPin}
          iconColor="text-accent-500"
          label="Search Areas"
          items={settings.areas}
          value={newArea}
          onChange={setNewArea}
          onAdd={addArea}
          onRemove={removeArea}
          placeholder="Add a new area..."
        />

        <TagEditor
          icon={GraduationCap}
          iconColor="text-primary-500"
          label="Search Colleges"
          items={settings.colleges}
          value={newCollege}
          onChange={setNewCollege}
          onAdd={addCollege}
          onRemove={removeCollege}
          placeholder="Add a new college..."
        />

        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-accent-500" />
            Popular Areas (Homepage)
            <span className="ml-auto text-sm font-normal text-gray-500">{settings.popularAreas.length} areas</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newPopularArea}
              onChange={(e) => setNewPopularArea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPopularArea())}
              placeholder="Area name"
              className="input-field flex-1"
            />
            <input
              type="text"
              value={newPopularAreaImage}
              onChange={(e) => setNewPopularAreaImage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPopularArea())}
              placeholder="Image URL (optional)"
              className="input-field flex-1"
            />
            <button onClick={addPopularArea} className="btn-primary px-4 flex items-center gap-1 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {settings.popularAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="relative flex-shrink-0">
                  <img
                    src={area.image || 'https://via.placeholder.com/80'}
                    alt={area.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Image className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePopularAreaFile(index, e.target.files[0])}
                    />
                  </label>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <input
                    type="text"
                    value={area.name}
                    onChange={(e) => updatePopularAreaName(index, e.target.value)}
                    className="input-field text-sm font-medium"
                    placeholder="Area name"
                  />
                  <input
                    type="text"
                    value={area.image}
                    onChange={(e) => updatePopularAreaImage(index, e.target.value)}
                    placeholder="Image URL"
                    className="input-field text-sm"
                  />
                </div>
                <button onClick={() => removePopularArea(index)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                  Delete
                </button>
              </div>
            ))}
            {settings.popularAreas.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">No popular areas added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
