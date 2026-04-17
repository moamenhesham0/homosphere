import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ label, id, value, onChange, placeholder, maxLength, required }) {
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="relative">
        <input
          className="w-full pl-4 pr-12 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface"
          id={id}
          name={id}
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          required={required}
          title={value}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
