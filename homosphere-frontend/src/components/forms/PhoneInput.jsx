import React from 'react';

export default function PhoneInput({ label, id, value, onChange, placeholder, maxLength }) {
  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    let formatted = input;

    if (input.length > 0) {
      if (input.length < 4) {
        formatted = `(${input}`;
      } else if (input.length < 7) {
        formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
      } else {
        formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
      }
    }

    e.target.value = formatted;
    onChange(e);
  };

  return (
    <div className="space-y-1.5 flex flex-col">
      <div className="flex justify-between items-end">
        <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor={id}>
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-on-surface-variant/70 mr-1">
            {value?.length || 0} / {maxLength}
          </span>
        )}
      </div>
      <input
        className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface"
        id={id}
        name={id}
        placeholder={placeholder || "(555) 000-0000"}
        type="tel"
        value={value}
        onChange={handlePhoneChange}
        maxLength={maxLength || 14}
        title={value}
      />
    </div>
  );
}
