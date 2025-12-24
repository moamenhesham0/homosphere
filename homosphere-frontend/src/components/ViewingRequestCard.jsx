import React, { useState } from 'react';
import DeclineModal from './DeclineModal';
import RescheduleModal from './RescheduleModal';
import '../styles/ViewingRequestCard.css';

const ViewingRequestCard = ({ request, onStatusUpdate }) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

 
  const getStatusClass = (status) => {
    const normalizedStatus = (status || 'PENDING').toUpperCase();
    
    if (normalizedStatus === 'APPROVED') return 'status-badge status-confirmed';
    if (normalizedStatus === 'REJECTED') return 'status-badge status-declined';
    if (normalizedStatus === 'RESCHEDULED') return 'status-badge status-reschedule';
    
    return 'status-badge status-pending';
  };


  const getStatusText = (status) => {
    const normalizedStatus = (status || 'PENDING').toUpperCase();
    const statusMap = {
      'PENDING': 'Pending',
      'APPROVED': 'Confirmed',
      'REJECTED': 'Declined',
      'RESCHEDULED': 'Reschedule Requested'
    };
    return statusMap[normalizedStatus] || 'Pending';
  };

  const handleConfirm = async () => {
    if (isProcessing) return;
    const confirmed = window.confirm('Are you sure you want to confirm this viewing request?');
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await onStatusUpdate(request.id, 'confirmed', {});
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async (message) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onStatusUpdate(request.id, 'declined', { agentMessage: message });
      setShowDeclineModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReschedule = async (newDateTime) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onStatusUpdate(request.id, 'reschedule', {
        newDate: newDateTime.date,
        newStartTime: newDateTime.startTime,
        newEndTime: newDateTime.endTime,
        agentMessage: newDateTime.message || ''
      });
      setShowRescheduleModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStatus = (request.status || 'PENDING').toUpperCase();
  const isPending = currentStatus === 'PENDING';

  return (
    <>
      <div className="viewing-request-card">
        <div className="card-header">
          <div className="request-id">Request #{request.id.substring(0, 8)}</div>
          <div className={getStatusClass(request.status)}>
            {getStatusText(request.status)}
          </div>
        </div>

        <div className="card-body">
          <div className="info-section">
            <div className="info-group">
              <label>Buyer Name</label>
              <div className="info-value">
                <i className="icon-user">👤</i>
                {request.name || request.buyerName || 'N/A'}
              </div>
            </div>

            <div className="info-group">
              <label>Contact Info</label>
              <div className="contact-details">
                <div className="info-value">
                  <i className="icon-email">✉️</i>
                  <a href={`mailto:${request.email || request.buyerEmail}`}>
                    {request.email || request.buyerEmail || 'No Email'}
                  </a>
                </div>
                <div className="info-value">
                  <i className="icon-phone">📞</i>
                  <a href={`tel:${request.phone || request.buyerPhone}`}>
                    {request.phone || request.buyerPhone || 'No Phone'}
                  </a>
                </div>
              </div>
            </div>

            <div className="info-group">
              <label>Property</label>
              <div className="info-value">
                <i className="icon-property">🏠</i>
                {/* --- FIX 3: Display nested Property Title correctly --- */}
                {request.property?.propertyListing?.title || 
                 request.propertyTitle || 
                 'Unknown Property'}
              </div>
            </div>

            <div className="info-group">
              <label>Requested Date & Time</label>
              <div className="datetime-info">
                <div className="info-value">
                  <i className="icon-calendar">📅</i>
                  {formatDate(request.preferredDate)}
                </div>
                <div className="info-value">
                  <i className="icon-clock">🕐</i>
                  {formatTime(request.startTime)} - {formatTime(request.endTime)}
                </div>
              </div>
            </div>

            {request.message && (
              <div className="info-group">
                <label>Message</label>
                <div className="info-value message-text">
                  {request.message}
                </div>
              </div>
            )}
            
            <div className="info-group">
              <label>Submitted</label>
              <div className="info-value">
                {formatDate(request.submittedAt)}
              </div>
            </div>
          </div>

          {isPending && (
            <div className="actions-section">
              <button 
                className="action-btn confirm-btn"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                <span className="btn-icon">✓</span>
                Confirm
              </button>
              
              <button 
                className="action-btn reschedule-btn"
                onClick={() => setShowRescheduleModal(true)}
                disabled={isProcessing}
              >
                <span className="btn-icon">📅</span>
                Propose New Time
              </button>
              
              <button 
                className="action-btn decline-btn"
                onClick={() => setShowDeclineModal(true)}
                disabled={isProcessing}
              >
                <span className="btn-icon">✗</span>
                Decline
              </button>
            </div>
          )}

          {request.processedRequest?.agentMessage && (
            <div className="status-note agent-message">
              <strong>Agent Note:</strong> {request.processedRequest.agentMessage}
            </div>
          )}
        </div>

         <div className="card-footer">
          <div className="audit-info">
            {request.processedRequest?.processedAt && (
              <span className="audit-timestamp">
                Processed on {formatDate(request.processedRequest.processedAt)}
                {request.processedRequest.processedBy && (
                  <> by {request.processedRequest.processedBy.firstName} {request.processedRequest.processedBy.lastName}</>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {showDeclineModal && (
        <DeclineModal
          onClose={() => setShowDeclineModal(false)}
          onConfirm={handleDecline}
          isProcessing={isProcessing}
        />
      )}

      {showRescheduleModal && (
        <RescheduleModal
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={handleReschedule}
          isProcessing={isProcessing}
          currentRequest={request}
        />
      )}
    </>
  );
};

export default ViewingRequestCard;