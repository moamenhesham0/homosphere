import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import axios from 'axios';
import FloatingLabelInput from './FloatingLabelInput';
import MessageDisplay from './MessageDisplay';
import { getFieldError, getInputClass } from '../utils/validators';
import '../styles/RequestViewForm.css';

const RequestViewForm = ({ propertyId, propertyTitle, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    startTime: '',
    endTime: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {

        const token = session.access_token;
        const response = await axios.get('http://localhost:8080/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setFormData(prev => ({
            ...prev,
            name: `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim(),
            email: response.data.email || '',
            phone: response.data.phone || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const fieldNames = ['name', 'email', 'phone', 'preferredDate', 'startTime', 'endTime'];
    const newErrors = {};

    for (const fieldName of fieldNames) {
      const error = getFieldError(fieldName, formData[fieldName], formData);
      if (error) {
        newErrors[fieldName] = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setErrors({ submit: 'You must be logged in to request a viewing.' });
        setIsLoading(false);
        return;
      }

      const token = session.access_token;
  
      const requestData = {
        propertyId: propertyId,
        propertyTitle: propertyTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        startTime: formData.startTime + ':00', // Format as HH:mm:ss
        endTime: formData.endTime + ':00', // Format as HH:mm:ss
        message: formData.message || ''
      };

      console.log('Request data:', requestData);

      const response = await axios.post('http://localhost:8080/api/viewing-requests', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting viewing request:', error);
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="request-view-form">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Request Sent!</h2>
          <p>An agent will contact you shortly to confirm.</p>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="request-view-form" onClick={(e) => e.stopPropagation()}>
      <div className="form-header">
        <h2>Request a Viewing</h2>
        <button onClick={onClose} className="close-icon">&times;</button>
      </div>

      <form onSubmit={handleSubmit}>
        <FloatingLabelInput
          required
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          type="text"
          error={errors.name}
          label={<>Name <span className="required">*</span></>}
          placeholder="Enter your full name"
          maxLength={50}
        />

        <FloatingLabelInput
          required
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          type="tel"
          error={errors.phone}
          label={<>Phone <span className="required">*</span></>}
          placeholder="Enter your phone number"
        />

        <FloatingLabelInput
          required
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          error={errors.email}
          label={<>Email <span className="required">*</span></>}
          placeholder="Enter your email address"
        />

        <div className="form-group">
          <label htmlFor="preferredDate">
            Preferred Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleInputChange}
            min={getTodayDate()}
            className={errors.preferredDate ? 'error' : ''}
          />
          {errors.preferredDate && <span className="error-message">{errors.preferredDate}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">
              Start Time <span className="required">*</span>
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className={errors.startTime ? 'error' : ''}
            />
            {errors.startTime && <span className="error-message">{errors.startTime}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endTime">
              End Time <span className="required">*</span>
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className={errors.endTime ? 'error' : ''}
            />
            {errors.endTime && <span className="error-message">{errors.endTime}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message (Optional)</label>
          <div className="textarea-wrapper">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              placeholder="Any special requests or questions..."
              maxLength="200"
            />
            <span className="character-count">{formData.message.length}/200</span>
          </div>
        </div>

        <MessageDisplay error={errors.submit} successMessage={null} />

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestViewForm;
