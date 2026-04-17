import { useState, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import FilterPopover from './FilterPopover';
import { US_STATES_BY_CODE, toStateCode } from '../../constants/usStates';

// A lightweight GeoJSON file containing US State boundaries and properties
const US_STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

const BLANK_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#f9fbf9' } }]
};

export default function StateFilter({ value, onChange, isOpen, onOpenChange }) {
  const selectedCode = toStateCode(value);
  const selectedState = US_STATES_BY_CODE[selectedCode];

  // Map interaction states
  const [hoveredStateName, setHoveredStateName] = useState(null);

  // Initial camera settings focused on the US
  const [viewState, setViewState] = useState({
    longitude: -96.5,
    latitude: 39.0,
    zoom: 3.5,
    pitch: 0,
    bearing: 0
  });

  // Data-driven styling for the state polygons
  const fillLayer = useMemo(() => ({
    id: 'states-fill',
    type: 'fill',
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'name'], selectedState?.name || ''],
        '#194a24', // Selected state color
        ['==', ['get', 'name'], hoveredStateName || ''],
        '#b3c9b9', // Hover state color
        '#d5e1d9'  // Default state color
      ],
      'fill-opacity': 0.8
    }
  }), [selectedState, hoveredStateName]);

  // Styling for the boundary lines between states
  const lineLayer = useMemo(() => ({
    id: 'states-line',
    type: 'line',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1.5,
      'line-opacity': 0.8
    }
  }), []);

  // Data-driven styling for the text labels (fixes the getBBox issue entirely)
  const labelLayer = useMemo(() => ({
    id: 'states-labels',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'name'], // Pulls the state name directly from the GeoJSON
      'text-size': 12,
      'text-anchor': 'center'
    },
    paint: {
      'text-color': [
        'case',
        ['==', ['get', 'name'], selectedState?.name || ''],
        '#ffffff', // White text for selected state
        '#4b6653'  // Default green text
      ]
    }
  }), [selectedState]);

  const handleMapClick = (event) => {
    const feature = event.features[0];
    if (feature) {
      const clickedName = feature.properties.name;
      const clickedCode = toStateCode(clickedName);
      if (clickedCode) {
        onChange(selectedCode === clickedCode ? '' : clickedCode);
      }
    }
  };

  const onHover = (event) => {
    const feature = event.features && event.features[0];
    setHoveredStateName(feature ? feature.properties.name : null);
  };

  const onMouseLeave = () => {
    setHoveredStateName(null);
  };

  return (
      <FilterPopover
          label="State"
          valueLabel={selectedCode || 'Any'}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          width="auto"
      >
        <div className="space-y-3 w-[22rem] sm:w-[30rem] lg:w-[46rem]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-on-surface">Choose a state</h3>
            <button
                className="rounded-md bg-surface-container-high px-2 py-1 text-xs text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                onClick={() => onChange('')}
                disabled={!selectedCode}
            >
              Clear
            </button>
          </div>

          {/* The Map Container */}
          <div className="h-[400px] w-full rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm relative bg-[#f9fbf9]">
            {isOpen && (
                <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapLib={maplibregl}
                    mapStyle={BLANK_MAP_STYLE} // Replaces basemap with a blank canvas to show ONLY America
                    maxBounds={[
                      [-180, 15], // Southwest bound (keeps Hawaii/Alaska in view)
                      [-45, 75]   // Northeast bound (blocks panning out to Europe/Asia)
                    ]}
                    minZoom={3}
                    maxZoom={7}
                    onClick={handleMapClick}
                    interactiveLayerIds={['states-fill']}
                    onMouseMove={onHover}
                    onMouseLeave={onMouseLeave}
                    cursor={hoveredStateName ? 'pointer' : 'grab'}
                    dragRotate={false}
                >
                  <Source id="us-states" type="geojson" data={US_STATES_GEOJSON_URL} generateId={true}>
                    <Layer {...fillLayer} />
                    <Layer {...lineLayer} />
                    <Layer {...labelLayer} />
                  </Source>
                </Map>
            )}
          </div>
        </div>
      </FilterPopover>
  );
}