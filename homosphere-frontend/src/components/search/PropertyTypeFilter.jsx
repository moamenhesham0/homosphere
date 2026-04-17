import FilterPopover from './FilterPopover';

const TYPE_OPTIONS = [
  { label: 'Any', value: 'ANY', icon: 'home' },
  { label: 'Villa', value: 'VILLA', icon: 'villa' },
  { label: 'Appartment', value: 'APARTMENT', icon: 'apartment' },
];

function PropertyTypeFilter({ value, onChange, isOpen, onOpenChange }) {
  return (
    <FilterPopover
      label="Type"
      valueLabel={TYPE_OPTIONS.find((option) => option.value === value)?.label || 'Any'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-on-surface">Home type</h3>

        {TYPE_OPTIONS.map((option) => (
          <label className="flex items-center gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low px-2 py-2 hover:bg-surface-container" key={option.value}>
            <input
              type="radio"
              name="property-type"
              className="accent-primary"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="material-symbols-outlined text-base text-outline">{option.icon}</span>
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </FilterPopover>
  );
}

export default PropertyTypeFilter;

