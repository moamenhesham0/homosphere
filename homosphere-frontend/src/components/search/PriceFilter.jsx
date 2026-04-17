import FilterPopover from './FilterPopover';

const PRICE_MIN = 0;
const PRICE_MAX = 2000000;
const PRICE_STEP = 25000;
const RANGE_STEP = 1;

function normalizeBounds(min, max) {
  const normMin = min !== undefined && min !== null ? min : PRICE_MIN;
  const normMax = max !== undefined && max !== null ? max : PRICE_MAX;
  return {
    min: Math.floor(normMin / PRICE_STEP) * PRICE_STEP,
    max: Math.ceil(normMax / PRICE_STEP) * PRICE_STEP,
  };
}

function getStep(min, max) {
  return PRICE_STEP;
}

function formatMoney(amount) {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function PriceFilter({ value, onChange, isOpen, onOpenChange, minBound, maxBound }) {
  const bounds = normalizeBounds(minBound, maxBound);
  const priceStep = getStep(bounds.min, bounds.max);
  const hasMin = value.min !== '' && value.min !== null && value.min !== undefined;
  const hasMax = value.max !== '' && value.max !== null && value.max !== undefined;

  const minValue = hasMin ? Number(value.min) : bounds.min;
  const maxValue = hasMax ? Number(value.max) : bounds.max;

  const updateMin = (newMin) => {
    let nextMin = newMin;
    if (nextMin > maxValue) nextMin = maxValue;

    if (nextMin === 0 || nextMin === bounds.min) {
      onChange({ ...value, min: '' });
    } else {
      onChange({ ...value, min: nextMin });
    }
  };

  const updateMax = (newMax) => {
    let nextMax = newMax;
    if (nextMax < minValue) nextMax = minValue;

    if (nextMax === bounds.max) {
      onChange({ ...value, max: '' });
    } else {
      onChange({ ...value, max: nextMax });
    }
  };

  const updateMinInput = (val) => {
    if (val === '' || val === null || Number(val) === 0 || Number(val) === bounds.min) {
      onChange({ ...value, min: '' });
      return;
    }
    updateMin(Number(val));
  };

  const updateMaxInput = (val) => {
    if (val === '' || val === null || Number(val) === bounds.max) {
      onChange({ ...value, max: '' });
      return;
    }
    updateMax(Number(val));
  };

  let valueLabel = 'Any';
  if (hasMin && hasMax) valueLabel = `${formatMoney(minValue)} - ${formatMoney(maxValue)}`;
  else if (hasMin) valueLabel = `Min ${formatMoney(minValue)}`;
  else if (hasMax) valueLabel = `Max ${formatMoney(maxValue)}`;

  const minPercent = ((minValue - bounds.min) / (bounds.max - bounds.min)) * 100;
  const maxPercent = ((maxValue - bounds.min) / (bounds.max - bounds.min)) * 100;

  return (
    <FilterPopover label="Price" valueLabel={valueLabel} isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-on-surface">Price range</h3>
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <label className="text-xs text-outline">
              Min
              {/*<input*/}
              {/*  className="mt-1 w-full rounded-md border border-outline-variant/40 bg-surface px-2 py-1 text-sm"*/}
              {/*  type="number"*/}
              {/*  min={bounds.min}*/}
              {/*  max={bounds.max}*/}
              {/*  step={priceStep}*/}
              {/*  value={value.min}*/}
              {/*  placeholder="Any"*/}
              {/*  onChange={(event) => updateMinInput(event.target.value)}*/}
              {/*/>*/}
            </label>
            <label className="text-xs text-outline">
              Max
              {/*<input*/}
              {/*  className="mt-1 w-full rounded-md border border-outline-variant/40 bg-surface px-2 py-1 text-sm"*/}
              {/*  type="number"*/}
              {/*  min={bounds.min}*/}
              {/*  max={bounds.max}*/}
              {/*  step={priceStep}*/}
              {/*  value={value.max}*/}
              {/*  placeholder="Any"*/}
              {/*  onChange={(event) => updateMaxInput(event.target.value)}*/}
              {/*/>*/}
            </label>
          </div>

          <div className="mt-8 mb-4 px-2">
            <div className="relative h-1 w-full rounded-full bg-outline-variant/40">
              <div
                className="absolute h-full rounded-full bg-primary"
                style={{
                  left: `${minPercent}%`,
                  right: `${100 - maxPercent}%`,
                }}
              />
              <input
                className="pointer-events-none absolute -top-2.5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                style={{ zIndex: minValue > maxValue - priceStep ? 5 : 4 }}
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={priceStep}
                value={minValue}
                onChange={(event) => updateMin(Number(event.target.value))}
              />
              <input
                className="pointer-events-none absolute -top-2.5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                style={{ zIndex: 4 }}
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={priceStep}
                value={maxValue}
                onChange={(event) => updateMax(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="rounded bg-primary-container px-2 py-1 text-on-primary-container">{formatMoney(minValue)}</span>
            <span className="rounded bg-primary-container px-2 py-1 text-on-primary-container">{formatMoney(maxValue)}</span>
          </div>

          <button
            className="mt-3 text-xs font-medium text-primary hover:underline"
            type="button"
            onClick={() => onChange({ ...value, min: '', max: '' })}
          >
            Clear
          </button>
        </div>
      </div>
    </FilterPopover>
  );
}

export default PriceFilter;
