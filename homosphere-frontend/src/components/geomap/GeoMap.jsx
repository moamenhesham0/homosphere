import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon with site colors
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="45" viewBox="0 0 32 45">
      <path fill="#00a676" stroke="#fff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 11 16 29 16 29s16-18 16-29c0-8.8-7.2-16-16-16z"/>
      <circle cx="16" cy="16" r="6" fill="#fff"/>
    </svg>
  `),
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -45],
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationSelect }) {
  const [fetchTimeout, setFetchTimeout] = useState(null);

  useMapEvents({
    click(e) {
      // Immediately place the marker
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);

      // Clear any existing timeout to debounce API calls
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }

      // Debounce API calls by 300ms to prevent excessive requests
      const timeout = setTimeout(() => {
        fetchLocationData(e.latlng.lat, e.latlng.lng, onLocationSelect);
      }, 300);

      setFetchTimeout(timeout);
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
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

    // Fetch nearby valuable places
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

// Fetch nearby valuable amenities using Overpass API
async function fetchNearbyAmenities(lat, lng, radius = 400) {
  try {
    const query = `
      [out:json][timeout:5];
      (
        node["amenity"~"restaurant|cafe|hospital|clinic|pharmacy|school|university|college|bank|marketplace|cinema|theatre|park"](around:${radius},${lat},${lng});
      );
      out body 20;
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
      .slice(0, 20);

    return amenities;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
}

// Forward geocoding - convert address to coordinates
async function forwardGeocode(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.address,
      };
    }
    return null;
  } catch (error) {
    console.error('Error forward geocoding:', error);
    return null;
  }
}

/**
 * GeoMap - Interactive map component for selecting locations
 *
 * @param {Function} onLocationSelect - Callback with location data: { street, city, state, zipCode, latitude, longitude, amenities }
 * @param {Function} onGeocodeRequest - Callback to expose geocoding function to parent
 * @param {Array} initialPosition - [lat, lng] for initial map center (default: [40.7128, -74.0060] - NYC)
 * @param {Number} zoom - Initial zoom level (default: 13)
 */
const GeoMap = ({
  onLocationSelect,
  onGeocodeRequest,
  initialPosition = [40.7128, -74.0060],
  zoom = 13
}) => {
  const [position, setPosition] = useState(null);
  const geocodeSentRef = useRef(false);

  const clearMarker = useCallback(() => {
    setPosition(null);
    onLocationSelect(null);
  }, [onLocationSelect]);

  // Function to geocode an address and update map
  const geocodeAddress = useCallback(async (addressString) => {
    const result = await forwardGeocode(addressString);
    if (result) {
      const newPosition = [result.latitude, result.longitude];
      setPosition(newPosition);
      await fetchLocationData(result.latitude, result.longitude, onLocationSelect);
      return true;
    }
    return false;
  }, [onLocationSelect]);

  // Expose geocoding function to parent component (only once)
  useEffect(() => {
    if (onGeocodeRequest && !geocodeSentRef.current) {
      onGeocodeRequest(geocodeAddress);
      geocodeSentRef.current = true;
    }
  }, [onGeocodeRequest, geocodeAddress]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {position && (
        <button
          onClick={clearMarker}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            background: '#00a676',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Clear Location
        </button>
      )}
      <div style={{ height: '100%', width: '100%' }}>
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
    </div>
  );
};

export default GeoMap;
