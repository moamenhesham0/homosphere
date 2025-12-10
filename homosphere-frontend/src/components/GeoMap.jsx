import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      fetchLocationData(e.latlng.lat, e.latlng.lng, onLocationSelect);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Fetch location data using Nominatim (OpenStreetMap)
async function fetchLocationData(lat, lng, onLocationSelect) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await response.json();

    const address = data.address || {};
    const locationData = {
      street: `${address.road || ''} ${address.house_number || ''}`.trim() || null,
      city: address.city || address.town || address.village || null,
      state: address.state || null,
      zipCode: address.postcode || null,
      latitude: lat,
      longitude: lng,
    };

    // Fetch nearby amenities
    const amenities = await fetchNearbyAmenities(lat, lng);

    onLocationSelect({
      ...locationData,
      amenities,
    });
  } catch (error) {
    console.error('Error fetching location data:', error);
    onLocationSelect(null);
  }
}

// Fetch nearby amenities using Overpass API
async function fetchNearbyAmenities(lat, lng, radius = 500) {
  try {
    const query = `
      [out:json];
      (
        node["amenity"](around:${radius},${lat},${lng});
        way["amenity"](around:${radius},${lat},${lng});
      );
      out body;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();

    const amenities = data.elements
      .filter(el => el.tags && el.tags.amenity)
      .map(el => ({
        name: el.tags.name || el.tags.amenity,
        type: el.tags.amenity,
      }))
      .slice(0, 20); // Limit to 20 amenities

    return amenities;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
}

/**
 * GeoMap - Interactive map component for selecting locations
 *
 * @param {Function} onLocationSelect - Callback with location data: { street, city, state, zipCode, latitude, longitude, amenities }
 * @param {Array} initialPosition - [lat, lng] for initial map center (default: [40.7128, -74.0060] - NYC)
 * @param {Number} zoom - Initial zoom level (default: 13)
 */
const GeoMap = ({
  onLocationSelect,
  initialPosition = [40.7128, -74.0060],
  zoom = 13
}) => {
  const [position, setPosition] = useState(null);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={initialPosition}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};

export default GeoMap;
