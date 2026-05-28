import React, { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminHomePage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSiteConfig();
      // If no config exists yet from DB, set a default
      if (data) {
        setConfig(data);
      } else {
        setConfig({
          featuredPlaces: [],
          timelineEvents: [],
          stats: {
            artifacts: 0,
            sites: 0,
            kingdoms: 0
          },
          heroTitle: '',
          heroSubtitle: '',
          chatbotPromoTitle: '',
          chatbotPromoSubtitle: '',
          newsletterTitle: '',
          newsletterSubtitle: ''
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch site config');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.updateSiteConfig(config);
      toast.success('Site configuration saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (key, value) => {
    setConfig({
      ...config,
      stats: {
        ...config.stats,
        [key]: parseInt(value) || 0
      }
    });
  };

  const updateField = (key, value) => {
    setConfig({
      ...config,
      [key]: value
    });
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-white/5 rounded-2xl"></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-cinzel font-bold text-white mb-2">Home Page Configuration</h1>
        <p className="text-text-muted">Manage global settings, featured content, and statistics displayed on the home page.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Settings className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-white">Homepage Content</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Hero Title</label>
                <input 
                  type="text" 
                  value={config?.heroTitle || ''} 
                  onChange={e => updateField('heroTitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
                  placeholder="e.g. Ancient Heritage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Hero Subtitle</label>
                <input 
                  type="text" 
                  value={config?.heroSubtitle || ''} 
                  onChange={e => updateField('heroSubtitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
                  placeholder="Explore thousands of years..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Chatbot Promo Title</label>
                <input 
                  type="text" 
                  value={config?.chatbotPromoTitle || ''} 
                  onChange={e => updateField('chatbotPromoTitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Chatbot Promo Subtitle</label>
                <textarea 
                  value={config?.chatbotPromoSubtitle || ''} 
                  onChange={e => updateField('chatbotPromoSubtitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none h-24 resize-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Newsletter Title</label>
                <input 
                  type="text" 
                  value={config?.newsletterTitle || ''} 
                  onChange={e => updateField('newsletterTitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Newsletter Subtitle</label>
                <input 
                  type="text" 
                  value={config?.newsletterSubtitle || ''} 
                  onChange={e => updateField('newsletterSubtitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Settings className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-white">Homepage Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Artifacts Discovered</label>
              <input 
                type="number" 
                value={config?.stats?.artifacts || 0} 
                onChange={e => updateStat('artifacts', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Historical Sites</label>
              <input 
                type="number" 
                value={config?.stats?.sites || 0} 
                onChange={e => updateStat('sites', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Ancient Kingdoms</label>
              <input 
                type="number" 
                value={config?.stats?.kingdoms || 0} 
                onChange={e => updateStat('kingdoms', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-colors outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 opacity-70">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-2">Featured Places / Timeline (Coming Soon)</h2>
            <p className="text-sm text-text-muted">Advanced arrays management for featured places and timeline will be implemented in future updates.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary py-3 px-8 flex items-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={20} />
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHomePage;
