import React from 'react';
import '../styles/FloatingLabelInput.css';

const FloatingLabelInput = ({ 
  name, 
  value, 
  onChange, 
  type = "text", 
  label,
  error,
  required = false,
  placeholder = "",
  maxLength
}) => {
  const inputClass = error ? 'input input-error' : 'input input-success';
  
  return (
    <div className="floating-label-group">
      <label>
        <span>{label}</span>
        <input 
          required={required}
          name={name}
          value={value} 
          onChange={onChange}
          type={type} 
          className={inputClass}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </label>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FloatingLabelInput;
