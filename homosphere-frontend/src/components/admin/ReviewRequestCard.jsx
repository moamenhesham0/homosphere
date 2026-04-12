import React from 'react';

export default function ReviewRequestCard({
  image,
  title,
  address,
  price,
  agent,
  submittedDate,
  status,
  flaggedReason,
}) {
  const isFlagged = status === 'Flagged';

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 flex gap-6 hover:shadow-md transition-shadow group shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
      <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
        <img alt="Property thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={image} />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-bold font-headline text-on-surface">{title}</h4>
            {isFlagged ? (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-[10px] uppercase font-black tracking-widest rounded-full font-body">Flagged: {flaggedReason}</span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] uppercase font-black tracking-widest rounded-full font-body">Pending Review</span>
            )}
          </div>
          <p className="text-sm text-on-surface-variant mb-4 font-body">{address} • {price}</p>
          <div className="grid grid-cols-2 gap-4 text-xs font-body">
            <div className="flex items-center gap-2 text-stone-500">
              <span className="material-symbols-outlined text-base">person</span>
              <span>Agent: {agent}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <span>Submitted: {submittedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-4 border-t border-surface-container mt-4 font-body">
          <button className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all">Approve</button>
          {isFlagged ? (
            <button className="px-4 py-2 bg-stone-100 text-stone-600 font-semibold rounded-lg text-sm hover:bg-stone-200 transition-all">Review Flag</button>
          ) : (
            <button className="px-4 py-2 border border-outline-variant text-error font-semibold rounded-lg text-sm hover:bg-error/5 transition-all">Flag</button>
          )}
          <button className="px-4 py-2 text-primary font-bold text-sm flex items-center gap-1 hover:underline underline-offset-4">Details</button>
        </div>
      </div>
    </div>
  );
}
