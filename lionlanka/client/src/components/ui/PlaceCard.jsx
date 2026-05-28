import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

const PlaceCard = ({ place }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  // Use first image if exists, else fallback
  const imageUrl = place.images && place.images.length > 0 
    ? (place.images[0].startsWith('http') ? place.images[0] : `${API_URL}${place.images[0]}`)
    : null;

  return (
    <Link to={`/places/${place.slug || place.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full h-full">
      <motion.div 
        whileHover="hover"
        className="relative w-full h-80 rounded-2xl overflow-hidden group cursor-pointer"
      >
        {/* Background Image with Parallax-like zoom */}
        <motion.div
          variants={{
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={place.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[var(--grad-hero)]" />
          )}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Content */}
        <motion.div 
          variants={{
            hover: { y: -8 }
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-20 flex flex-col justify-end p-6"
        >
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/20 bg-black/30 backdrop-blur-sm">
              {place.category}
            </span>
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-white mb-2 leading-tight">
            {place.name}
          </h3>

          <div className="flex items-center gap-2 text-muted text-sm mb-4">
            <MapPin size={14} className="text-primary" />
            <span>{place.location?.province || 'Sri Lanka'}</span>
          </div>

          <div className="flex items-center gap-2 text-primary font-medium text-sm overflow-hidden h-6">
            <span className="relative">
              Explore History
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
            <motion.div
              variants={{
                hover: { x: 5 }
              }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={14} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default PlaceCard;
