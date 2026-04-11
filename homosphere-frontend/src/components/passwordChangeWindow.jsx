import React, { useState } from 'react';
import PasswordInput from './PasswordInput';
import MessageDisplay from './MessageDisplay';
import { getInputClass, getFieldError } from '../utils/validators';
import { supabase } from '../utils/supabase';
import '../styles/enterPasswordWindow.css';

const PasswordChangeWindow = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
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

    // Validate current password
    const currentPasswordError = getFieldError('currentPassword', formData.currentPassword, formData);
    if (currentPasswordError) {
      setError(currentPasswordError);
      return;
    }

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

    // Verify current password with Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('No user logged in');
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword
      });

      if (authError) {
        setError('Incorrect current password');
        return;
      }

      await onSubmit(formData.password);
    } catch (err) {
      setError('Failed to verify current password');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>

        <h2 className="title">Change Password</h2>
        <p className="message">Please enter your current password and your new password.</p>

        <form className="form" onSubmit={handleSubmit}>

            <PasswordInput
                name="currentPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className={getInputClass('currentPassword', formData.currentPassword, formData)}
                label="Current Password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
            />

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


          <MessageDisplay error={error} />

          <button type="submit" className="submit delete-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeWindow;