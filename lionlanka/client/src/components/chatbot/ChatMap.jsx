import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
    <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-lg relative z-0 aspect-video w-full max-h-80">
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
  );
};

export default ChatMap;
