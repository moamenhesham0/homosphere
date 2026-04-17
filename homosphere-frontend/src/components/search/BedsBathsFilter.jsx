import FilterPopover from './FilterPopover';

function toCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function BedsBathsFilter({ value, onChange, isOpen, onOpenChange, maxBathroom, maxBedroom }) {
  const bedrooms = toCount(value.bedrooms);
  const bathrooms = toCount(value.bathrooms);


  const updateCount = (key, next) => {
    if (next <= 0) {
      onChange({ ...value, [key]: '' });
      return;
    }
    let nextVal = Math.min((key === 'bedrooms' ? maxBedroom : maxBathroom) || Infinity, next);
    onChange({ ...value, [key]: String(nextVal) });
  };

  return (
    <FilterPopover
      label="Beds & Baths"
      valueLabel={`${bedrooms || 'Any'} bd / ${bathrooms || 'Any'} ba`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-on-surface">Minimum rooms</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-2">
            <p className="text-xs text-outline">Bedrooms</p>
            <div className="mt-2 flex items-center justify-between">
              <button className="rounded-md bg-surface-container-high px-2 py-1 hover:bg-surface-container" type="button" onClick={() => updateCount('bedrooms', bedrooms - 1)}>-</button>
              <span className="text-sm font-medium">{bedrooms || 'Any'}</span>
              <button className="rounded-md bg-surface-container-high px-2 py-1 hover:bg-surface-container" type="button" onClick={() => updateCount('bedrooms', bedrooms + 1)}>+</button>
            </div>
          </div>
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-2">
            <p className="text-xs text-outline">Bathrooms</p>
            <div className="mt-2 flex items-center justify-between">
              <button className="rounded-md bg-surface-container-high px-2 py-1 hover:bg-surface-container" type="button" onClick={() => updateCount('bathrooms', bathrooms - 1)}>-</button>
              <span className="text-sm font-medium">{bathrooms || 'Any'}</span>
              <button className="rounded-md bg-surface-container-high px-2 py-1 hover:bg-surface-container" type="button" onClick={() => updateCount('bathrooms', bathrooms + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>
    </FilterPopover>
  );
}

export default BedsBathsFilter;

