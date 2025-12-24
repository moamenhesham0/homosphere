import React, { useState } from 'react';
import '../styles/DeclineModal.css';

const DeclineModal = ({ onClose, onConfirm, isProcessing }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const predefinedReasons = [
    'Property no longer available',
    'Time slot already booked',
    'Property under maintenance',
    'Buyer does not meet requirements',
    'Other (specify below)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reason) {
      setError('Please select a reason');
      return;
    }

    if (reason === 'Other (specify below)' && !customReason.trim()) {
      setError('Please provide a custom reason');
      return;
    }

    const finalReason = reason === 'Other (specify below)' 
      ? customReason.trim() 
      : reason;

    onConfirm(finalReason);
  };

  const handleReasonChange = (selectedReason) => {
    setReason(selectedReason);
    setError('');
    if (selectedReason !== 'Other (specify below)') {
      setCustomReason('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content decline-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Decline Viewing Request</h2>
          <button className="close-btn" onClick={onClose} disabled={isProcessing}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="modal-description">
              Please select or provide a reason for declining this viewing request. 
              The buyer will be notified via email.
            </p>

            <div className="reason-options">
              {predefinedReasons.map((option) => (
                <label key={option} className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value={option}
                    checked={reason === option}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    disabled={isProcessing}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {reason === 'Other (specify below)' && (
              <div className="custom-reason-section">
                <label htmlFor="customReason">Custom Reason</label>
                <textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => {
                    setCustomReason(e.target.value);
                    setError('');
                  }}
                  placeholder="Please explain why you are declining this request..."
                  rows="4"
                  maxLength="200"
                  disabled={isProcessing}
                />
                <div className="char-count">
                  {customReason.length}/200
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
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
              className="btn btn-danger"
              disabled={isProcessing}
            >
              {isProcessing ? 'Declining...' : 'Decline Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeclineModal;
