import FilterPopover from './FilterPopover';

function SortDirectionFilter({ value, onChange, isOpen, onOpenChange }) {
  const updateValue = (key, nextValue) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <FilterPopover
      label="Sort"
      valueLabel={`${value.field === 'price' ? 'Price' : 'Area'} ${value.direction.toUpperCase()}`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-on-surface">Sort direction</h3>

        <label className="block text-xs text-outline">Sort by</label>
        <select
          className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-3 py-2 text-sm"
          value={value.field}
          onChange={(event) => updateValue('field', event.target.value)}
        >
          <option value="price">Price</option>
          <option value="propertyAreaSqFt">Property area</option>
        </select>

        <label className="block text-xs text-outline">Direction</label>
        <select
          className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-3 py-2 text-sm"
          value={value.direction}
          onChange={(event) => updateValue('direction', event.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </FilterPopover>
  );
}

export default SortDirectionFilter;

