import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Info, ExternalLink, Calendar, ChevronLeft, Languages, Loader2 } from 'lucide-react';
import { PlaceCardSkeleton } from '../components/ui/Skeleton';
import API from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PlaceDetail = () => {
  const { slug } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Translation State
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await API.get(`/api/places/${slug}`);
        setPlace(res.data.place);
        setTranslatedContent(null);
        setTargetLang('en');
      } catch (error) {
        console.error('Place not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [slug]);

  const handleTranslate = async () => {
    if (targetLang === 'en') {
      setTranslatedContent(null);
      return;
    }
    
    setIsTranslating(true);
    try {
      // Translate description
      const descRes = await API.post('/api/translate', { 
        text: place.description, 
        targetLanguage: targetLang === 'si' ? 'Sinhala' : 'Tamil'
      });
      
      let sigRes = { data: { translatedText: '' } };
      if (place.historicalSignificance) {
        sigRes = await API.post('/api/translate', { 
          text: place.historicalSignificance, 
          targetLanguage: targetLang === 'si' ? 'Sinhala' : 'Tamil'
        });
      }

      setTranslatedContent({
        description: descRes.data.translatedText,
        historicalSignificance: sigRes.data.translatedText
      });
    } catch (error) {
      console.error('Translation failed', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) return <div className="pt-20 p-10"><PlaceCardSkeleton /></div>;
  if (!place) return <div className="min-h-screen pt-32 text-center text-white">Place not found.</div>;

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const coverUrl = place.images?.[0] ? (place.images[0].startsWith('http') ? place.images[0] : `${API_URL}${place.images[0]}`) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep"
    >
      <Helmet>
        <title>{place.name} — Lion Lanka</title>
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full h-[65vh] min-h-[500px]">
        <div className="absolute inset-0 z-0">
          {coverUrl ? (
             <img src={coverUrl} alt={place.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[var(--grad-hero)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12">
           <Link to="/places" className="inline-flex items-center gap-2 text-muted hover:text-white mb-6 transition-colors w-fit">
            <ChevronLeft size={16} /> Back to Places
          </Link>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/20 bg-black/30 backdrop-blur-sm w-fit mb-4">
             {place.category}
          </span>
          <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-white mb-2">{place.name}</h1>
          <div className="flex items-center gap-2 text-lg text-primary">
            <MapPin size={20} /> {place.location?.province}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Col: Info */}
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-cinzel font-bold text-white flex items-center gap-2">
                  <Info className="text-primary" /> About
                </h2>
                
                {/* Language Translator UI */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                  <Languages size={18} className="text-text-muted ml-2" />
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="bg-transparent text-white text-sm focus:outline-none px-2 py-1 cursor-pointer"
                  >
                    <option value="en" className="bg-deep">English</option>
                    <option value="si" className="bg-deep">සිංහල (Sinhala)</option>
                    <option value="ta" className="bg-deep">தமிழ் (Tamil)</option>
                  </select>
                  <button 
                    onClick={handleTranslate}
                    disabled={isTranslating || (targetLang === 'en' && !translatedContent)}
                    className="btn-primary py-1 px-3 text-sm rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTranslating ? <Loader2 size={16} className="animate-spin" /> : 'Translate'}
                  </button>
                </div>
              </div>
              <div 
                className={`text-lg text-text-main/90 leading-relaxed prose prose-invert max-w-none ${targetLang === 'si' ? 'font-sinhala' : ''} ${targetLang === 'ta' ? 'font-tamil' : ''}`}
                dangerouslySetInnerHTML={{ __html: translatedContent ? translatedContent.description : place.description }}
              />
              {place.historicalSignificance && (
                 <div className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20">
                   <h3 className="text-primary font-bold mb-2 font-cinzel">Historical Significance</h3>
                   <div 
                     className={`text-text-main/90 prose prose-invert max-w-none ${targetLang === 'si' ? 'font-sinhala' : ''} ${targetLang === 'ta' ? 'font-tamil' : ''}`} 
                     dangerouslySetInnerHTML={{ __html: translatedContent ? translatedContent.historicalSignificance : place.historicalSignificance }} 
                   />
                 </div>
              )}
            </section>

            {/* Image Gallery */}
            {place.images && place.images.length > 0 && (
              <section>
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {place.images.map((imgUrl, idx) => {
                    const fullUrl = imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;
                    return (
                      <div key={idx} className="rounded-2xl overflow-hidden aspect-video border border-white/10">
                        <img src={fullUrl} alt={`${place.name} gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Timeline */}
            {place.timeline && place.timeline.length > 0 && (
              <section>
                <h2 className="text-2xl font-cinzel font-bold text-white mb-8 flex items-center gap-2">
                  <Calendar className="text-primary" /> Timeline
                </h2>
                <div className="pl-4 border-l-2 border-white/10 space-y-8">
                  {place.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-deep border-2 border-primary"></div>
                      <span className="text-primary font-bold font-cinzel text-xl mb-1 block">{item.year}</span>
                      <p className="text-text-main/90">{item.event}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
          </div>

          {/* Right Col: Sidebar */}
          <div className="space-y-6">
            
            <div className="p-6 rounded-2xl bg-card border border-white/10 shadow-lg">
              <h3 className="font-cinzel font-bold text-lg text-white mb-6">Visitor Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Visiting Hours</h4>
                    <p className="text-sm text-muted">{place.visitingHours || '8:00 AM - 5:00 PM'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-primary">
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Entry Fee</h4>
                    <p className="text-sm text-muted">{place.entryFee || 'Ticket required for foreigners'}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Coordinates Map Placeholder */}
            {(() => {
              const coords = place.location?.coordinates;
              if (!coords) return null;
              
              let lat, lng;
              if (Array.isArray(coords)) {
                lat = coords[1];
                lng = coords[0];
              } else {
                lat = coords.lat;
                lng = coords.lng;
              }
              
              if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return null;
              
              return (
                <div className="w-full h-64 rounded-2xl bg-surface border border-white/10 overflow-hidden relative z-0">
                  <MapContainer 
                    center={[lat, lng]} 
                    zoom={13} 
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[lat, lng]}>
                      <Popup>
                        {place.name}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              );
            })()}
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceDetail;
