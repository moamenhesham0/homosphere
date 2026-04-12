import React from 'react';
import { Link } from 'react-router-dom';

export default function PropertyCard({
  propertyId,
  image,
  price,
  addressLine1,
  addressLine2,
  beds,
  baths,
  sqft,
  featured,
  trend,
  newConstruction,
  onFavoriteClick,
}) {
  const card = (
    <div className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-on-surface/5 hover:translate-y-[-4px]">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Property" src={image} />
        {featured && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg font-bold text-xs text-primary uppercase tracking-wider">
            Featured
          </div>
        )}
        {newConstruction && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg font-bold text-xs text-primary uppercase tracking-wider">
            New Construction
          </div>
        )}
        <button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-error flex items-center justify-center hover:bg-white transition-all shadow-sm"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onFavoriteClick?.();
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </button>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-headline font-extrabold text-emerald-900">{price}</h3>
          {trend && (
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              <span className="material-symbols-outlined text-sm">trending_up</span> {trend}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-stone-500 text-sm mb-4 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">bed</span> {beds} bds
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">bathtub</span> {baths} ba
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">square_foot</span> {sqft} sqft
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-on-surface font-medium text-sm leading-relaxed mb-1">{addressLine1}</p>
          {addressLine2 && (
            <p className="text-outline text-xs uppercase tracking-widest font-semibold">{addressLine2}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (!propertyId) {
    return card;
  }

  return (
    <Link to={`/property-details/${propertyId}`}>
      {card}
    </Link>
  );
}
