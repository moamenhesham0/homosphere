import React from 'react';

export default function InputField({ label, id, type = 'text', value, onChange, placeholder, maxLength, required }) {
  return (
    <div className="space-y-1.5">
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
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        title={value}
      />
    </div>
  );
}
