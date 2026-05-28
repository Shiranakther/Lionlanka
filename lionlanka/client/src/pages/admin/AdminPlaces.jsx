import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, MapPin, X } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: { province: '', coordinates: { lat: 7.8731, lng: 80.7718 } },
    images: '',
    historicalPeriod: '',
    historicalSignificance: '',
    visitingHours: '',
    entryFee: '',
    timeline: []
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllPlaces();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch places');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;
    try {
      await adminService.deletePlace(id);
      setPlaces(places.filter(p => p._id !== id));
      toast.success('Place deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete place');
    }
  };

  const handleOpenModal = (place = null) => {
    if (place) {
      setCurrentPlace(place);
      setFormData({
        name: place.name || '',
        description: place.description || '',
        category: place.category || '',
        location: place.location || { province: '', coordinates: { lat: 7.8731, lng: 80.7718 } },
        images: place.images?.join(', ') || '',
        historicalPeriod: place.historicalPeriod || '',
        historicalSignificance: place.historicalSignificance || '',
        visitingHours: place.visitingHours || '',
        entryFee: place.entryFee || '',
        timeline: place.timeline || []
      });
    } else {
      setCurrentPlace(null);
      setFormData({
        name: '', description: '', category: '', 
        location: { province: '', coordinates: { lat: 7.8731, lng: 80.7718 } },
        images: '', historicalPeriod: '', historicalSignificance: '', visitingHours: '', entryFee: '', timeline: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        images: typeof formData.images === 'string' ? formData.images.split(',').map(i => i.trim()).filter(Boolean) : formData.images
      };

      if (currentPlace) {
        await adminService.updatePlace(currentPlace._id, payload);
        toast.success('Place updated successfully');
      } else {
        await adminService.createPlace(payload);
        toast.success('Place created successfully');
      }
      setIsModalOpen(false);
      fetchPlaces();
    } catch (error) {
      console.error(error);
      toast.error(currentPlace ? 'Failed to update place' : 'Failed to create place');
    }
  };

  const addTimelineEvent = () => {
    setFormData({ ...formData, timeline: [...formData.timeline, { year: '', event: '' }] });
  };
  const updateTimelineEvent = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData({ ...formData, timeline: newTimeline });
  };
  const removeTimelineEvent = (index) => {
    setFormData({ ...formData, timeline: formData.timeline.filter((_, i) => i !== index) });
  };

  const filteredPlaces = places.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-white mb-2">Manage Places</h1>
          <p className="text-text-muted">Add, edit, or remove historical locations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto btn-primary py-2 px-4 flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add New Place
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse h-96 bg-white/5 rounded-2xl"></div>
      ) : (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-text-muted font-medium">Place Name</th>
                  <th className="p-4 text-text-muted font-medium">Category</th>
                  <th className="p-4 text-text-muted font-medium">Period</th>
                  <th className="p-4 text-text-muted font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlaces.length > 0 ? (
                  filteredPlaces.map((place) => (
                    <tr key={place._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {place.images && place.images.length > 0 ? (
                            <img src={place.images[0]} alt={place.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-muted">
                              <MapPin size={18} />
                            </div>
                          )}
                          <span className="text-white font-medium">{place.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-text-main capitalize">
                          {place.category}
                        </span>
                      </td>
                      <td className="p-4 text-text-main">{place.historicalPeriod || 'N/A'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(place)}
                            className="p-2 text-text-muted hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Edit Place"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(place._id)}
                            className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete Place"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-text-muted">No places found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cinzel font-bold text-white">
                {currentPlace ? 'Edit Place' : 'Add New Place'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-deep border border-white/10 rounded-xl px-4 py-2 text-white">
                    <option value="">Select Category</option>
                    <option value="Ancient City">Ancient City</option>
                    <option value="Temple">Temple</option>
                    <option value="Fortress">Fortress</option>
                    <option value="Colonial">Colonial</option>
                    <option value="Natural Heritage">Natural Heritage</option>
                    <option value="Museum">Museum</option>
                  </select>
                </div>
              </div>

              {/* Descriptions using ReactQuill for rich text */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
                <div className="bg-white rounded-xl overflow-hidden text-black border border-white/10">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={val => setFormData({...formData, description: val})}
                    className="h-48 mb-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Historical Significance</label>
                <div className="bg-white rounded-xl overflow-hidden text-black border border-white/10">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.historicalSignificance} 
                    onChange={val => setFormData({...formData, historicalSignificance: val})}
                    className="h-32 mb-12"
                  />
                </div>
              </div>

              {/* Location & Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Historical Period</label>
                  <input type="text" value={formData.historicalPeriod} onChange={e => setFormData({...formData, historicalPeriod: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="e.g. Anuradhapura Period" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Province</label>
                  <input type="text" value={formData.location.province} onChange={e => setFormData({...formData, location: { ...formData.location, province: e.target.value }})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Latitude</label>
                  <input type="number" step="any" value={formData.location.coordinates?.lat || ''} onChange={e => setFormData({...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lat: parseFloat(e.target.value) } }})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Longitude</label>
                  <input type="number" step="any" value={formData.location.coordinates?.lng || ''} onChange={e => setFormData({...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lng: parseFloat(e.target.value) } }})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Image URLs (comma separated, first image is cover)</label>
                <input type="text" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="https://..., https://..." />
              </div>

              {/* Visitor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Visiting Hours</label>
                  <input type="text" value={formData.visitingHours} onChange={e => setFormData({...formData, visitingHours: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="e.g. 8:00 AM - 5:00 PM" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Entry Fee</label>
                  <input type="text" value={formData.entryFee} onChange={e => setFormData({...formData, entryFee: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="e.g. Free for locals, $30 for foreigners" />
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-cinzel font-bold text-white">Timeline Events</h3>
                  <button type="button" onClick={addTimelineEvent} className="text-sm btn-primary py-1 px-3 flex items-center gap-1">
                    <Plus size={14} /> Add Event
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.timeline.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="w-1/4">
                        <input type="text" placeholder="Year" value={item.year} onChange={e => updateTimelineEvent(index, 'year', e.target.value)} className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-white focus:outline-none focus:border-primary" />
                      </div>
                      <div className="w-3/4">
                        <input type="text" placeholder="Event Description" value={item.event} onChange={e => updateTimelineEvent(index, 'event', e.target.value)} className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-white focus:outline-none focus:border-primary" />
                      </div>
                      <button type="button" onClick={() => removeTimelineEvent(index)} className="text-text-muted hover:text-red-400 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {formData.timeline.length === 0 && (
                    <p className="text-text-muted text-sm italic">No timeline events added yet.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-main hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2">Save Place</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlaces;
