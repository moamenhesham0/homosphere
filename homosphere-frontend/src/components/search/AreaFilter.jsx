import FilterPopover from './FilterPopover';

const AREA_MAX = 10000;
const AREA_STEP = 100;

function toNumberOrFallback(value, fallback) {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeBounds(max, maxDefault) {
  const normMax = max !== undefined && max !== null ? max : maxDefault;
  return {
    min: 0,
    max: Math.ceil(normMax / AREA_STEP) * AREA_STEP,
  };
}

function AreaFilter({ value, onChange, isOpen, onOpenChange, maxLotArea, maxPropertyArea }) {
  const lotBounds = normalizeBounds(maxLotArea, AREA_MAX);
  const propBounds = normalizeBounds(maxPropertyArea, AREA_MAX);

  const lotMin = toNumberOrFallback(value.lotMin, lotBounds.min);
  const lotMax = toNumberOrFallback(value.lotMax, lotBounds.max);
  const propertyMin = toNumberOrFallback(value.propertyMin, propBounds.min);
  const propertyMax = toNumberOrFallback(value.propertyMax, propBounds.max);

  const updateLotMin = (newMin) => {
    let nextMin = Math.min(newMin, lotMax);
    onChange({
      ...value,
      lotMin: nextMin === lotBounds.min ? '' : String(nextMin),
      lotMax: lotMax === lotBounds.max ? '' : String(lotMax),
    });
  };

  const updateLotMax = (newMax) => {
    let nextMax = Math.max(newMax, lotMin);
    onChange({
      ...value,
      lotMin: lotMin === lotBounds.min ? '' : String(lotMin),
      lotMax: nextMax === lotBounds.max ? '' : String(nextMax),
    });
  };

  const updatePropMin = (newMin) => {
    let nextMin = Math.min(newMin, propertyMax);
    onChange({
      ...value,
      propertyMin: nextMin === propBounds.min ? '' : String(nextMin),
      propertyMax: propertyMax === propBounds.max ? '' : String(propertyMax),
    });
  };

  const updatePropMax = (newMax) => {
    let nextMax = Math.max(newMax, propertyMin);
    onChange({
      ...value,
      propertyMin: propertyMin === propBounds.min ? '' : String(propertyMin),
      propertyMax: nextMax === propBounds.max ? '' : String(nextMax),
    });
  };

  const lotMinPercent = lotBounds.max > 0 ? ((lotMin - lotBounds.min) / (lotBounds.max - lotBounds.min)) * 100 : 0;
  const lotMaxPercent = lotBounds.max > 0 ? ((lotMax - lotBounds.min) / (lotBounds.max - lotBounds.min)) * 100 : 100;
  const propMinPercent = propBounds.max > 0 ? ((propertyMin - propBounds.min) / (propBounds.max - propBounds.min)) * 100 : 0;
  const propMaxPercent = propBounds.max > 0 ? ((propertyMax - propBounds.min) / (propBounds.max - propBounds.min)) * 100 : 100;

  let valueLabel = 'Any';
  const hasLot = value.lotMin || value.lotMax;
  const hasProp = value.propertyMin || value.propertyMax;
  if (hasLot && hasProp) valueLabel = 'Lot & Prop areas';
  else if (hasLot) valueLabel = `${lotMin}-${lotMax} lot sqft`;
  else if (hasProp) valueLabel = `${propertyMin}-${propertyMax} prop sqft`;

  const commonThumbClass = "pointer-events-none absolute -top-2.5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary";

  return (
    <FilterPopover
      label="Area"
      valueLabel={valueLabel}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
          <h3 className="mb-1 text-sm font-semibold">Lot area (sqft)</h3>

          <div className="mt-6 mb-4 px-2">
            <div className="relative h-1 w-full rounded-full bg-outline-variant/40">
              <div
                className="absolute h-full rounded-full bg-primary"
                style={{
                  left: `${lotMinPercent}%`,
                  right: `${100 - lotMaxPercent}%`,
                }}
              />
              <input
                className={commonThumbClass}
                style={{ zIndex: lotMin > lotMax - AREA_STEP ? 5 : 4 }}
                type="range"
                min={lotBounds.min}
                max={lotBounds.max}
                step={AREA_STEP}
                value={lotMin}
                onChange={(event) => updateLotMin(Number(event.target.value))}
              />
              <input
                className={commonThumbClass}
                style={{ zIndex: 4 }}
                type="range"
                min={lotBounds.min}
                max={lotBounds.max}
                step={AREA_STEP}
                value={lotMax}
                onChange={(event) => updateLotMax(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-medium">
            <span className="rounded bg-primary-container px-2 py-1 text-on-primary-container">{lotMin.toLocaleString('en-US')} sqft</span>
            <span className="rounded bg-primary-container px-2 py-1 text-on-primary-container">{lotMax.toLocaleString('en-US')} sqft</span>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
          <h3 className="mb-1 text-sm font-semibold">Property area (sqft)</h3>

          <div className="mt-6 mb-4 px-2">
            <div className="relative h-1 w-full rounded-full bg-outline-variant/40">
              <div
                className="absolute h-full rounded-full bg-primary"
                style={{
                  left: `${propMinPercent}%`,
                  right: `${100 - propMaxPercent}%`,
                }}
              />
              <input
                className={commonThumbClass}
                style={{ zIndex: propertyMin > propertyMax - AREA_STEP ? 5 : 4 }}
                type="range"
                min={propBounds.min}
                max={propBounds.max}
                step={AREA_STEP}
                value={propertyMin}
                onChange={(event) => updatePropMin(Number(event.target.value))}
              />
              <input
                className={commonThumbClass}
                style={{ zIndex: 4 }}
                type="range"
                min={propBounds.min}
                max={propBounds.max}
                step={AREA_STEP}
                value={propertyMax}
                onChange={(event) => updatePropMax(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-medium">
            <span className="rounded bg-primary-container px-2 py-1 text-on-primary-container">{propertyMin.toLocaleString('en-US')} sqft</span>
            <span className="rounded bg-primary-container px-2 py-1 text-on-primary-container">{propertyMax.toLocaleString('en-US')} sqft</span>
          </div>
        </div>

        <button
          className="text-xs font-medium text-primary hover:underline"
          type="button"
          onClick={() => onChange({ ...value, lotMin: '', lotMax: '', propertyMin: '', propertyMax: '' })}
        >
          Clear
        </button>
      </div>
    </FilterPopover>
  );
}

export default AreaFilter;
