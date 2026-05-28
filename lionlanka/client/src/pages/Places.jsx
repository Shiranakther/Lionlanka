import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import PlaceCard from '../components/ui/PlaceCard';
import SearchBar from '../components/ui/SearchBar';
import { PlaceCardSkeleton } from '../components/ui/Skeleton';
import { getPlacesAPI } from '../services/placeService'; // We didn't create a placeService yet, assuming it exists or fetch directly
import API from '../services/api';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const CATEGORIES = ['Ancient City', 'Temple', 'Fortress', 'Colonial', 'Natural Heritage', 'Museum'];

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const params = { category, search };
        const res = await API.get('/api/places', { params });
        setPlaces(res.data.places);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [category, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-deep pt-24 pb-20"
    >
      <Helmet>
        <title>Historical Places — Lion Lanka</title>
        <meta name="description" content="Explore ancient cities, temples, and fortresses of Sri Lanka." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">Historical Places</h1>
            <p className="text-muted">Journey through the architectural marvels and sacred sites of antiquity.</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchBar placeholder="Search places..." onSearch={setSearch} />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button 
            onClick={() => setCategory('')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              category === '' 
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 border border-transparent' 
                : 'glass text-muted hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            All Places
          </button>
          
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat 
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 border border-transparent' 
                  : 'glass text-muted hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <PlaceCardSkeleton key={i} />)}
          </div>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-cinzel text-white mb-2">No places found</h3>
            <p className="text-muted">We couldn't find any historical places matching your criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Places;
