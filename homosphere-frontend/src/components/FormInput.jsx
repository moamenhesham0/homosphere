import React from 'react';

const FormInput = ({ 
  name, 
  value, 
  onChange, 
  type = "text", 
  className, 
  label, 
  required = false 
}) => {
  return (
    <label>
      <input 
        required={required}
        name={name}
        value={value} 
        onChange={onChange}
        type={type} 
        className={className}
      />
      <span>{label}</span>
    </label>
  );
};

export default FormInput;
