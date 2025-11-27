import React, { useState } from 'react';
import PasswordInput from './PasswordInput';
import MessageDisplay from './MessageDisplay';
import { getInputClass, getFieldError } from '../utils/validators';
import { supabase } from '../utils/supabase';
import '../styles/enterPasswordWindow.css';

const EnterPasswordWindow = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    confirmDelete: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password
    const passwordError = getFieldError('password', formData.password, formData);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate confirm password
    const confirmPasswordError = getFieldError('confirmPassword', formData.confirmPassword, formData);
    if (confirmPasswordError) {
      setError(confirmPasswordError);
      return;
    }

    // Validate checkbox
    if (!formData.confirmDelete) {
      setError('You must confirm account deletion');
      return;
    }

    // Verify password with Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('No user logged in');
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.password
      });

      if (authError) {
        setError('Incorrect password');
        return;
      }

      
      onSubmit(formData.password);
    } catch (err) {
      setError('Failed to verify password');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2 className="title">Delete Account</h2>
        <p className="message">This action cannot be undone. Please enter your password to confirm.</p>

        <form className="form" onSubmit={handleSubmit}>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={getInputClass('password', formData.password, formData)}
            label="Password"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={getInputClass('confirmPassword', formData.confirmPassword, formData)}
            label="Confirm Password"
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="confirmDelete"
              className="checkbox"
              checked={formData.confirmDelete}
              onChange={handleChange}
            />
            <span>I understand this will permanently delete my account</span>
          </label>

          <MessageDisplay error={error} />

          <button type="submit" className="submit delete-button">
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterPasswordWindow;
