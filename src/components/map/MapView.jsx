import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Link } from 'react-router-dom';
import { createCategoryIcon, userLocationIcon } from './CategoryMarker';
import MapController from './MapController';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Tag, Building2, Globe, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({
  museums = [],
  userLocation = null,
  nearbyRadius = null,
  sidebarOpen = true,
  onMuseumSelect
}) => {
  const { t } = useLanguage();
  // Memoize markers to avoid re-creating icons on every render
  const markers = useMemo(() => {
    return museums
      .filter((m) => m.latitude && m.longitude)
      .map((museum) => ({
        ...museum,
        position: [parseFloat(museum.latitude), parseFloat(museum.longitude)],
        icon: createCategoryIcon(museum.nama_kategori),
      }));
  }, [museums]);

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      className="h-full w-full z-0"
      zoomControl={true}
      minZoom={4}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Auto-zoom controller */}
      <MapController
        museums={museums}
        userLocation={userLocation}
        sidebarOpen={sidebarOpen}
      />

      {/* Museum markers with clustering */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount();
          let size = 'small';
          let dimension = 36;
          if (count >= 50) { size = 'large'; dimension = 48; }
          else if (count >= 10) { size = 'medium'; dimension = 42; }

          return L.divIcon({
            html: `<div style="
              width: ${dimension}px;
              height: ${dimension}px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #10B981, #6366F1);
              color: white;
              font-weight: 700;
              font-size: ${size === 'large' ? '14px' : '12px'};
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            ">${count}</div>`,
            className: 'custom-cluster-icon',
            iconSize: L.point(dimension, dimension),
          });
        }}
      >
        {markers.map((museum) => (
          <Marker
            key={museum.id}
            position={museum.position}
            icon={museum.icon}
            eventHandlers={{
              click: () => onMuseumSelect(museum),
            }}
          >
            <Popup className="museum-popup">
              <div className="flex flex-col w-48 overflow-hidden rounded-lg">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 relative">
                  {museum.foto_utama ? (
                    <img 
                      src={`http://localhost:5000${museum.foto_utama}`} 
                      alt={museum.nama_museum} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Building2 size={32} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-white/90 backdrop-blur-sm text-[10px] font-bold text-emerald-600 shadow-sm">
                    {t(museum.nama_kategori || 'Museum')}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 px-3 py-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-2 leading-snug">
                    {museum.nama_museum}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                    <MapPin size={10} className="text-emerald-500" />
                    <span className="truncate">{museum.nama_kabupaten}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* User location marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
          <Popup>
            <div className="text-center p-1">
              <p className="font-semibold text-sm text-slate-900">{t('your_location')}</p>
              <p className="text-xs text-slate-500 mt-1">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Nearby radius circle */}
      {userLocation && nearbyRadius && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={nearbyRadius * 1000}
          pathOptions={{
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.08,
            weight: 2,
            dashArray: '8 4',
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapView;
