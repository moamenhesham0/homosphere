import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Geocode address to coordinates using Nominatim
async function geocodeAddress(street, city, state, zipCode) {
  try {
    const addressParts = [street, city, state, zipCode].filter(Boolean);
    const address = addressParts.join(', ');

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Reverse geocode coordinates to address
async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await response.json();

    const address = data.address || {};
    return {
      street: `${address.road || ''} ${address.house_number || ''}`.trim() || null,
      city: address.city || address.town || address.village || null,
      state: address.state || null,
      zipCode: address.postcode || null,
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * ReadOnlyGeoMap - Display-only map component that shows a location
 *
 * @param {Number} latitude - Latitude coordinate
 * @param {Number} longitude - Longitude coordinate
 * @param {String} street - Street address (optional, for geocoding)
 * @param {String} city - City (optional, for geocoding)
 * @param {String} state - State (optional, for geocoding)
 * @param {String} zipCode - Zip code (optional, for geocoding)
 * @param {Number} zoom - Zoom level (default: 15)
 * @param {Function} onCoordinatesResolved - Callback when coords are resolved from address
 * @param {Function} onAddressResolved - Callback when address is resolved from coords
 */
const ReadOnlyGeoMap = ({
  latitude,
  longitude,
  street,
  city,
  state,
  zipCode,
  zoom = 15,
  onCoordinatesResolved,
  onAddressResolved,
}) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveLocation = async () => {
      setLoading(true);

      // If coordinates are provided
      if (latitude && longitude) {
        setPosition([latitude, longitude]);

        // Optionally resolve address from coordinates
        if (onAddressResolved) {
          const addressData = await reverseGeocode(latitude, longitude);
          if (addressData) {
            onAddressResolved(addressData);
          }
        }
        setLoading(false);
        return;
      }

      // If address is provided, geocode it
      if (street || city || state || zipCode) {
        const coords = await geocodeAddress(street, city, state, zipCode);
        if (coords) {
          setPosition([coords.latitude, coords.longitude]);

          // Notify parent of resolved coordinates
          if (onCoordinatesResolved) {
            onCoordinatesResolved(coords);
          }
        }
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    resolveLocation();
  }, [latitude, longitude, street, city, state, zipCode]);

  if (loading) {
    return (
      <div style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading map...</p>
      </div>
    );
  }

  if (!position) {
    return (
      <div style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No location data available</p>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        dragging={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

// Export helper functions for use outside components
export const getCoordinatesFromAddress = geocodeAddress;
export const getAddressFromCoordinates = reverseGeocode;

export default ReadOnlyGeoMap;
