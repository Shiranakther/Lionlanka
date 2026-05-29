import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin } from 'lucide-react';

const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const getGoogleMapsUrl = (lat, lng, label) => {
  const encodedLabel = encodeURIComponent(label);
  return `https://www.google.com/maps/place/${encodedLabel}/@${lat},${lng},15z`;
};

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChatMap = ({ map, maps }) => {
  const points = maps && maps.length > 0 ? maps : map ? [map] : [];
  
  if (points.length === 0) return null;

  // Calculate center and zoom
  let center = [7.8731, 80.7718]; // Default Sri Lanka center
  let zoom = 7;

  if (points.length === 1) {
    center = [points[0].lat, points[0].lng];
    zoom = 12;
  }

  return (
    <div className="my-4">
      {/* Embedded Map */}
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg relative z-0 aspect-video w-full max-h-80">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup>
            {points.map((p, i) => (
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
      </div>

      {/* View Live Map Buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {points.map((p, i) => (
          <a
            key={i}
            href={getGoogleMapsUrl(p.lat, p.lng, p.label)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                       bg-gradient-to-r from-blue-600/20 to-green-500/20 
                       border border-blue-500/30 hover:border-blue-400/50
                       text-blue-300 hover:text-blue-200
                       transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10
                       backdrop-blur-sm"
          >
            <MapPin size={12} className="text-red-400" />
            <span>{points.length > 1 ? p.label : 'View Live Map'}</span>
            <ExternalLink size={11} className="opacity-60" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ChatMap;
