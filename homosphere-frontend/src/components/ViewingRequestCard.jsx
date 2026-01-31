import React, { useState } from 'react';
import DeclineModal from './DeclineModal';
import RescheduleModal from './RescheduleModal';
import '../styles/ViewingRequestCard.css';

const ViewingRequestCard = ({ request, onStatusUpdate, userRole }) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
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
    const normalized = (status || 'PENDING').toUpperCase();
    if (normalized === 'APPROVED') return 'status-badge status-confirmed';
    if (normalized === 'REJECTED') return 'status-badge status-declined';
    if (normalized === 'RESCHEDULED') return 'status-badge status-reschedule';
    if (normalized === 'WITHDRAWN') return 'status-badge status-declined';
    return 'status-badge status-pending';
  };

  const getStatusText = (status) => {
    const normalized = (status || 'PENDING').toUpperCase();
    const map = {
      'PENDING': 'Pending',
      'APPROVED': 'Confirmed',
      'REJECTED': 'Declined',
      'RESCHEDULED': 'Reschedule Requested',
      'WITHDRAWN': 'Withdrawn'
    };
    return map[normalized] || 'Pending';
  };

 
  const handleConfirm = async () => handleAction('confirmed');
  const handleWithdraw = async () => handleAction('withdrawn');
  
  const handleAction = async (status) => {
    if (isProcessing) return;
    
    const message = status === 'withdrawn' 
      ? 'Are you sure you want to withdraw this request?' 
      : 'Are you sure you want to accept this appointment?';

    if (!window.confirm(message)) return;

    setIsProcessing(true);
    try {
      await onStatusUpdate(request.id, status, {});
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async (message) => {
    setIsProcessing(true);
    try {
      await onStatusUpdate(request.id, 'declined', { agentMessage: message });
      setShowDeclineModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReschedule = async (newDateTime) => {
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
  const isBuyer = (userRole || '').toUpperCase() === 'BUYER';
  const isSeller = !isBuyer; 

  // Access the joined data safely
  const processedData = request.processedRequest || {};

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
              <label>Property</label>
              <div className="info-value">
                <i className="icon-property">🏠</i>
                {request.property?.propertyListing?.title || request.propertyTitle || 'Unknown Property'}
              </div>
            </div>
            
            {isSeller && (
              <div className="info-group">
                <label>Buyer Name</label>
                <div className="info-value">
                  <i className="icon-user">👤</i>
                  {request.name || request.buyerName}
                </div>
              </div>
            )}

            <div className="info-group">
              <label>Requested Date</label>
              <div className="datetime-info">
                <div className="info-value">
                  <i className="icon-calendar">📅</i> {formatDate(request.preferredDate)}
                </div>
                <div className="info-value">
                  <i className="icon-clock">🕐</i> {formatTime(request.startTime)} - {formatTime(request.endTime)}
                </div>
              </div>
            </div>
          </div>

          <div className="actions-section">
            {isSeller && currentStatus === 'PENDING' && (
              <>
                <button className="action-btn confirm-btn" onClick={handleConfirm} disabled={isProcessing}>
                  <span className="btn-icon">✓</span> Confirm
                </button>
                <button className="action-btn reschedule-btn" onClick={() => setShowRescheduleModal(true)} disabled={isProcessing}>
                  <span className="btn-icon">📅</span> Propose New Time
                </button>
                <button className="action-btn decline-btn" onClick={() => setShowDeclineModal(true)} disabled={isProcessing}>
                  <span className="btn-icon">✗</span> Decline
                </button>
              </>
            )}

            {isBuyer && currentStatus === 'PENDING' && (
               <button className="action-btn decline-btn" onClick={handleWithdraw} disabled={isProcessing}>
                  <span className="btn-icon">✗</span> Withdraw Request
               </button>
            )}

            {isBuyer && currentStatus === 'RESCHEDULED' && (
              <>
                <button className="action-btn confirm-btn" onClick={handleConfirm} disabled={isProcessing}>
                  <span className="btn-icon">✓</span> Accept New Time
                </button>
                <button className="action-btn decline-btn" onClick={handleWithdraw} disabled={isProcessing}>
                  <span className="btn-icon">✗</span> Withdraw Request
                </button>
              </>
            )}
          </div>

          {processedData.agentMessage && (
            <div className="status-note agent-message">
              <strong>Agent Note:</strong> {processedData.agentMessage}
            </div>
          )}
         
          {processedData.newDate && currentStatus === 'RESCHEDULED' && (
            <div className="status-note reschedule-note">
              <strong>Proposed New Time:</strong>{' '}
              {formatDate(processedData.newDate)} at{' '}
              {formatTime(processedData.newStartTime)} - {formatTime(processedData.newEndTime)}
            </div>
          )}

        </div>
      </div>
      
      {showDeclineModal && <DeclineModal onClose={() => setShowDeclineModal(false)} onConfirm={handleDecline} isProcessing={isProcessing} />}
      {showRescheduleModal && <RescheduleModal onClose={() => setShowRescheduleModal(false)} onConfirm={handleReschedule} isProcessing={isProcessing} currentRequest={request} />}
    </>
  );
};

export default ViewingRequestCard;