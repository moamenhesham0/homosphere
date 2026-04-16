import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const FilterPopover = ({ label, valueLabel, children, isOpen: controlledIsOpen, onOpenChange, width: customWidth = 320 }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState(null);
  const containerRef = useRef(null);
  const panelRef = useRef(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (next) => {
      if (!isControlled) {
        setInternalIsOpen(next);
      }

      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const updatePanelPosition = useCallback(() => {
    if (!containerRef.current || typeof window === 'undefined') {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const viewportPadding = 12;

    let widthValue;
    if (customWidth === 'auto') {
      widthValue = 'fit-content';
    } else {
      const preferredWidth = customWidth;
      const maxWidth = Math.max(260, window.innerWidth - viewportPadding * 2);
      widthValue = `${Math.min(preferredWidth, maxWidth)}px`;
    }

    let left = rect.left;
    if (customWidth !== 'auto') {
      const widthNum = parseFloat(widthValue);
      if (left + widthNum > window.innerWidth - viewportPadding) {
        left = window.innerWidth - widthNum - viewportPadding;
      }
    } else {
      if (left + 400 > window.innerWidth - viewportPadding) {
        left = Math.max(viewportPadding, window.innerWidth - 400 - viewportPadding);
      }
    }

    left = Math.max(viewportPadding, left);

    setPanelStyle({
      top: `${rect.bottom + 8}px`,
      left: `${left}px`,
      width: widthValue,
      maxWidth: `calc(100vw - ${viewportPadding * 2}px)`
    });
  }, [customWidth]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    updatePanelPosition();

    const onOutsideClick = (event) => {
      if (containerRef.current?.contains(event.target) || panelRef.current?.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    };

    const onViewportChange = () => {
      updatePanelPosition();
    };

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onOutsideClick);
    document.addEventListener('keydown', onEscape);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);

    return () => {
      document.removeEventListener('mousedown', onOutsideClick);
      document.removeEventListener('keydown', onEscape);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
    };
  }, [isOpen, updatePanelPosition]);

  const panel =
    isOpen && panelStyle
      ? createPortal(
          <div className="fixed inset-0 z-9999 pointer-events-none">
            <section
              ref={panelRef}
              className="pointer-events-auto fixed rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-2xl"
              style={panelStyle}
            >
              {children}
            </section>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        className="flex min-h-10 items-center gap-1.5 rounded-full border border-transparent px-5 py-2 text-sm font-medium leading-none tracking-[0.01em] transition-none"
        style={
          isOpen
            ? { backgroundColor: '#becac2', color: '#2f3932' }
            : { backgroundColor: '#dae5dd', color: '#3d4942' }
        }
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        {valueLabel ? (
          <span className="max-w-24 truncate rounded-full bg-[#edf3ef] px-2 py-0.5 text-[11px] font-medium text-[#556158]">
            {valueLabel}
          </span>
        ) : null}
        <span
          className={`material-symbols-outlined text-[18px] leading-none transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ color: isOpen ? '#4a564f' : '#46524b' }}
        >
          expand_more
        </span>
      </button>
      {panel}
    </div>
  );
};

export { FilterPopover };
export default FilterPopover;
