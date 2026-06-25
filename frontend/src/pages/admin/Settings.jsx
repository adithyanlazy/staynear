import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, Image, ToggleLeft, ToggleRight } from 'lucide-react';
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
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setSettings(res.data.data);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Website Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your platform settings</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default Settings;
