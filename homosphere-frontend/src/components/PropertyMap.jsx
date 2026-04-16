import React, { useState, useMemo, useRef, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';

/**
 * @typedef {Object} Property
 * @property {string|number} id
 * @property {string} type - "Villa", "Apartment", or "House", etc.
 * @property {number} lat
 * @property {number} lng
 * @property {number} [price]
 */

/**
 * @typedef {Object} GeoJSONFeature
 * @property {string} type
 * @property {Object} properties
 * @property {boolean} properties.cluster
 * @property {number} properties.cluster_id
 * @property {number} properties.point_count
 * @property {number} properties.point_count_abbreviated
 * @property {string|number} properties.propertyId
 * @property {string} properties.type
 * @property {Object} geometry
 * @property {string} geometry.type
 * @property {number[]} geometry.coordinates
 */

export default function PropertyMap({ properties = [], hoveredPropertyId }) {
  const mapRef = useRef(null);

  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });

  const [bounds, setBounds] = useState(null);

  // Convert raw properties to GeoJSON format for Supercluster
  const points = useMemo(() => {
    return properties
      .filter((p) => typeof p.lng === 'number' && typeof p.lat === 'number')
      .map((p) => ({
        type: 'Feature',
        properties: {
          cluster: false,
          propertyId: p.id,
          type: p.type,
          price: p.price,
        },
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat],
        },
      }));
  }, [properties]);

  // Initialize Supercluster instance
  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 60,
      maxZoom: 16,
    });
    sc.load(points);
    return sc;
  }, [points]);

  // Compute the visible clusters/points based on bounds and zoom
  const clusters = useMemo(() => {
    if (!bounds || !supercluster) return [];

    return supercluster.getClusters(
      [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]],
      Math.floor(viewState.zoom)
    );
  }, [bounds, viewState.zoom, supercluster]);

  const handleMapLoad = useCallback((e) => {
    const map = e.target;
    setBounds(map.getBounds().toArray());
  }, []);

  const handleMapMove = useCallback((e) => {
    setViewState(e.viewState);
    if (mapRef.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray());
    }
  }, []);

  // Pan to hovered property
  React.useEffect(() => {
    if (hoveredPropertyId && mapRef.current) {
      const property = properties.find((p) => p.id === hoveredPropertyId);
      if (property && typeof property.lng === 'number' && typeof property.lat === 'number') {
        mapRef.current.flyTo({
          center: [property.lng, property.lat],
          zoom: Math.max(viewState.zoom, 14), // zoom in if not already zoomed, or keep current zoom if higher
          duration: 800,
        });
      }
    }
  }, [hoveredPropertyId, properties]);

  const handleClusterClick = (clusterId, longitude, latitude) => {
    const expansionZoom = supercluster.getClusterExpansionZoom(clusterId);

    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: Math.min(expansionZoom, 16),
      duration: 500,
    });
  };

  return (
    <div className="w-full h-full relative bg-surface-container">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMapMove}
        onLoad={handleMapLoad}
        mapLib={maplibregl}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        interactiveLayerIds={[]}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties;

          if (isCluster) {
            // Render Cluster Marker
            return (
              <Marker
                key={`cluster-${cluster.properties.cluster_id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleClusterClick(cluster.properties.cluster_id, longitude, latitude);
                }}
              >
                <div
                  className="flex items-center justify-center rounded-2xl bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/30 cursor-pointer hover:bg-emerald-600 transition-colors"
                  style={{
                    width: `${Math.max(30, 20 + (pointCount / points.length) * 40)}px`,
                    height: `${Math.max(30, 20 + (pointCount / points.length) * 40)}px`,
                    fontSize: '14px',
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          // Render Individual Property Marker
          const propertyType = cluster.properties.type?.toLowerCase();
          const isVilla = propertyType === 'villa';
          const isHovered = cluster.properties.propertyId === hoveredPropertyId;

          return (
            <Marker
              key={`property-${cluster.properties.propertyId}`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                // Optionally handle individual marker click (e.g., selecting it)
              }}
            >
              <div
                className={`p-2 rounded-t-full rounded-br-full rounded-bl-sm -rotate-45 cursor-pointer shadow-md flex items-center justify-center transition-transform duration-300 ${
                  isHovered ? 'scale-125 z-50 ring-4 ring-white shadow-xl' : ''
                } ${
                  isVilla ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'
                }`}
                title={`${cluster.properties.type} - ID: ${cluster.properties.propertyId}`}
              >
                <div className="rotate-45 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">
                    {isVilla ? 'holiday_village' : 'apartment'}
                  </span>
                </div>
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
