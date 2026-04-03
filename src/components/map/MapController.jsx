import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Controller component untuk auto-zoom peta ke bounds semua marker.
 * Menggunakan useMap() hook dari react-leaflet.
 */
const MapController = ({ museums, userLocation, sidebarOpen, selectedMuseum }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Trigger map resize with delay because of sidebar animations
    const timeouts = [50, 150, 300, 600].map(ms => 
      setTimeout(() => map.invalidateSize({ animate: true }), ms)
    );

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [map, sidebarOpen, selectedMuseum]);

  useEffect(() => {
    if (!map) return;

    // Prioritize zooming to selected museum
    if (selectedMuseum) {
      map.setView([parseFloat(selectedMuseum.latitude), parseFloat(selectedMuseum.longitude)], 15, { animate: true });
      return;
    }

    // Then user location
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 12, { animate: true });
      return;
    }

    // Default to fit bounds or Indonesia
    if (museums && museums.length > 0) {
      const validMuseums = museums.filter(m => m.latitude && m.longitude);
      if (validMuseums.length === 1) {
        map.setView([parseFloat(validMuseums[0].latitude), parseFloat(validMuseums[0].longitude)], 14, { animate: true });
      } else if (validMuseums.length > 1) {
        const bounds = L.latLngBounds(validMuseums.map(m => [parseFloat(m.latitude), parseFloat(m.longitude)]));
        map.fitBounds(bounds, { padding: [50, 50], animate: true, maxZoom: 16 });
      }
    } else {
      map.setView([-2.5, 118], 5, { animate: true });
    }
  }, [museums, userLocation, map, selectedMuseum]);

  return null;
};

export default MapController;
