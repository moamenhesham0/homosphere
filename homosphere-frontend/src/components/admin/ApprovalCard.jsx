import React from 'react';

export default function ApprovalCard({
  propertyId,
  image,
  title,
  address,
  price,
  agent,
  photosCount,
  status,
  submittedTime,
  flaggedReason,
  warningMessage,
  onApprove,
  onReject,
  onView,
}) {
  const isFlagged = status === 'Flagged';

  return (
    <div className={`group bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 hover:bg-white transition-all border ${isFlagged ? 'border-error-container/50' : 'border-transparent hover:border-outline-variant/10'}`}>
      <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0">
        <img alt={title} className="w-full h-full object-cover" src={image} />
      </div>
      <div className="flex-1 flex flex-col justify-between h-32">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isFlagged ? (
              <span className="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded-full tracking-wider uppercase">Flagged: {flaggedReason}</span>
            ) : (
              <span className="px-2 py-0.5 bg-primary-container/20 text-primary text-[10px] font-bold rounded-full tracking-wider uppercase">Pending Review</span>
            )}
            <span className="text-[10px] text-gray-400 font-medium">Submitted {submittedTime}</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface font-headline leading-tight">{title}</h3>
          <p className="text-sm text-on-surface-variant line-clamp-1">{address} • {price}</p>
        </div>
        <div className="flex items-center gap-4">
          {warningMessage ? (
            <div className="flex items-center gap-1 text-xs text-error font-medium">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>{warningMessage}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="material-symbols-outlined text-sm">person</span>
                <span>Agent: {agent}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="material-symbols-outlined text-sm">photo_library</span>
                <span>{photosCount} Photos</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary hover:scale-105 transition-transform shadow-[0px_12px_32px_rgba(26,27,31,0.06)]"
          type="button"
          onClick={() => onApprove?.(propertyId)}
        >
          <span className="material-symbols-outlined">check</span>
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-error hover:bg-error-container transition-colors"
          type="button"
          onClick={() => onReject?.(propertyId)}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
          type="button"
          onClick={() => onView?.(propertyId)}
        >
          <span className="material-symbols-outlined">visibility</span>
        </button>
      </div>
    </div>
  );
}
