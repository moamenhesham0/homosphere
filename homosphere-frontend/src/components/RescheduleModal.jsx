import React, { useState } from 'react';
import '../styles/RescheduleModal.css';

const RescheduleModal = ({ onClose, onConfirm, isProcessing, currentRequest }) => {
  const [dateTime, setDateTime] = useState({
    date: '',
    startTime: '',
    endTime: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDateTime(prev => ({
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
    const newErrors = {};

    if (!dateTime.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(dateTime.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Cannot select a past date';
      }
    }

    if (!dateTime.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!dateTime.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (dateTime.startTime && dateTime.endTime) {
      const [startHours, startMinutes] = dateTime.startTime.split(':').map(Number);
      const [endHours, endMinutes] = dateTime.endTime.split(':').map(Number);
      
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      const duration = endTotalMinutes - startTotalMinutes;

      if (duration <= 0) {
        newErrors.endTime = 'End time must be after start time';
      } else if (duration < 30) {
        newErrors.endTime = 'Viewing must be at least 30 minutes';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onConfirm(dateTime);
  };

  const formatOriginalDateTime = () => {
    if (!currentRequest) return '';
    
    const date = new Date(currentRequest.preferredDate);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const formatTime = (timeString) => {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return `${dateStr} at ${formatTime(currentRequest.startTime)} - ${formatTime(currentRequest.endTime)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reschedule-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Propose New Time</h2>
          <button className="close-btn" onClick={onClose} disabled={isProcessing}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="modal-description">
              Suggest an alternative date and time for the viewing. The buyer will be 
              notified and can accept or decline your proposal.
            </p>

            {currentRequest && (
              <div className="original-request-info">
                <strong>Original Request:</strong> {formatOriginalDateTime()}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="date">Proposed Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={dateTime.date}
                onChange={handleInputChange}
                min={getTodayDate()}
                className={errors.date ? 'error' : ''}
                disabled={isProcessing}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="time-group">
              <div className="form-group">
                <label htmlFor="startTime">Start Time *</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={dateTime.startTime}
                  onChange={handleInputChange}
                  className={errors.startTime ? 'error' : ''}
                  disabled={isProcessing}
                />
                {errors.startTime && <span className="error-text">{errors.startTime}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time *</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={dateTime.endTime}
                  onChange={handleInputChange}
                  className={errors.endTime ? 'error' : ''}
                  disabled={isProcessing}
                />
                {errors.endTime && <span className="error-text">{errors.endTime}</span>}
              </div>
            </div>

            <div className="info-note">
              <i className="icon-info">ℹ️</i>
              <span>Viewing duration must be at least 30 minutes</span>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={dateTime.message}
                onChange={handleInputChange}
                placeholder="Explain why you're proposing a new time..."
                rows="3"
                maxLength="200"
                disabled={isProcessing}
              />
              <div className="char-count">
                {dateTime.message.length}/200
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Proposing...' : 'Propose New Time'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
