export default function Seller({
  listedProperties,
  isLoading,
  isEditing,
  onRemoveListedProperty,
  getPropertyImageUrl,
  formatPrice,
  formatCompactAddress,
}) {
  return (
    <>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-black text-emerald-900 tracking-tight">Listed Homes</h1>
            {isEditing && (
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">EDIT MODE</span>
            )}
          </div>
          <p className="text-on-surface-variant font-body">
            {isLoading
              ? 'Loading your listed properties...'
              : `You have ${listedProperties.length} listed properties.`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-semibold transition-all hover:opacity-80"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-semibold transition-all hover:opacity-80"
            type="button"
          >
            Sort: Newest
          </button>
        </div>
      </header>

      {listedProperties.length === 0 && !isLoading ? (
        <div className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">
          No listed properties yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {listedProperties.map((property, index) => (
            <div
              key={property.propertyListingId}
              className="group bg-surface-container-lowest rounded-xl overflow-hidden transition-all border border-transparent hover:border-error/20"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={property.title || 'Listed property'}
                  src={getPropertyImageUrl(property)}
                />
                {isEditing ? (
                  <button
                    className="absolute top-4 right-4 bg-error text-white p-2 rounded-full shadow-lg hover:bg-error/90 transition-colors z-10"
                    type="button"
                    onClick={() => onRemoveListedProperty(property.propertyListingId)}
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                ) : (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-error flex items-center justify-center shadow-sm z-10">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </div>
                )}
                {index === 0 && (
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full uppercase tracking-widest">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-on-surface">{formatPrice(property.price)}</h3>
                  <p className="text-on-surface-variant text-sm">
                    {formatCompactAddress(property.city, property.state) || property.title || 'Location unavailable'}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-on-surface-variant text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">bed</span>
                    <span>{property.bedrooms || 0} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">bathtub</span>
                    <span>{property.bathrooms || 0} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">square_foot</span>
                    <span>
                      {property.propertyAreaSqFt
                        ? `${Number(property.propertyAreaSqFt).toLocaleString('en-US')} sqft`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-primary-container/20 rounded-xl p-12 text-center space-y-4">
        <h4 className="text-2xl font-headline font-bold text-emerald-900">Looking for something specific?</h4>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Our local agents are ready to help you find the perfect property that matches your unique vision.
        </p>
        <button className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg mt-4 hover:shadow-lg transition-all" type="button">
          Contact an Agent
        </button>
      </div>
    </>
  );
}
