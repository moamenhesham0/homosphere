function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Address, City, or ZIP',
  isLoading = false,
}) {
  return (
    <div className="relative shrink-0 min-w-[320px] flex-1">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
      <input
        className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 text-sm"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !isLoading) {
            onSubmit();
          }
        }}
      />
    </div>
  );
}

export default SearchBar;

