import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Loader2 } from 'lucide-react';
import API from '../../services/api';

const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// Official Google Maps URLs API — most reliable format
const getGoogleMapsUrl = (lat, lng, label) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}&query_place_id=${encodeURIComponent(label)}`;
};

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChatMap = ({ map, maps }) => {
  const rawPoints = maps && maps.length > 0 ? maps : map ? [map] : [];
  const [points, setPoints] = useState(rawPoints);
  const [loading, setLoading] = useState(false);

  // On mount, try to get exact coordinates from DB
  useEffect(() => {
    if (rawPoints.length === 0) return;

    const lookupCoordinates = async () => {
      setLoading(true);
      try {
        const names = rawPoints.map(p => p.label).filter(Boolean);
        if (names.length === 0) {
          setPoints(rawPoints);
          setLoading(false);
          return;
        }

        const res = await API.post('/api/places/coordinates-lookup', { names });
        const dbResults = res.data.results || {};

        // Merge: use DB coordinates if available, otherwise keep AI-provided ones
        const merged = rawPoints.map(p => {
          const dbMatch = dbResults[p.label];
          if (dbMatch) {
            return {
              ...p,
              lat: dbMatch.lat,
              lng: dbMatch.lng,
              dbName: dbMatch.dbName,
              fromDb: true
            };
          }
          return p;
        });

        setPoints(merged);
      } catch (err) {
        // If lookup fails, just use AI coordinates
        setPoints(rawPoints);
      } finally {
        setLoading(false);
      }
    };

    lookupCoordinates();
  }, [map, maps]);
  
  if (rawPoints.length === 0) return null;

  const validPoints = points.filter(p => p.lat != null && p.lng != null && !isNaN(p.lat) && !isNaN(p.lng));

  // Calculate center and zoom
  let center = [7.8731, 80.7718]; // Default Sri Lanka center
  let zoom = 7;

  if (validPoints.length === 1) {
    center = [validPoints[0].lat, validPoints[0].lng];
    zoom = 12;
  } else if (validPoints.length === 0 && !loading) {
    return null; // Don't show map if no valid points to show
  }

  return (
    <div className="my-4">
      {/* Embedded Map */}
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg relative z-0 aspect-video w-full max-h-80">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-black/30">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
              {validPoints.map((p, i) => (
                <Marker key={i} position={[p.lat, p.lng]}>
                  <Popup>
                    <div className="text-deep text-center">
                      <strong className="block mb-1 font-cinzel">{p.label}</strong>
                      <Link 
                        to={`/places/${generateSlug(p.label)}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        )}
      </div>

      {/* View Live Map Buttons */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mt-2">
          {validPoints.map((p, i) => (
            <a
              key={i}
              href={getGoogleMapsUrl(p.lat, p.lng, p.dbName || p.label)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                         bg-gradient-to-r from-blue-600/20 to-green-500/20 
                         border border-blue-500/30 hover:border-blue-400/50
                         text-blue-300 hover:text-blue-200
                         transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10
                         backdrop-blur-sm group"
            >
              <MapPin size={12} className="text-red-400" />
              <span>{validPoints.length > 1 ? p.label : 'View Live Map'}</span>
              <ExternalLink size={11} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              {p.fromDb && (
                <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-green-400" title="Exact coordinates from database" />
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMap;
