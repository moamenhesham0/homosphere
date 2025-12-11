import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const RequestViewPage = () => {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [viewingRequests, setViewingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.SIGNIN);
      return;
    }

    fetchViewingRequests();
  }, [isAuthenticated, token]);

  const fetchViewingRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/viewing-requests/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch viewing requests: ${response.statusText}`);
      }

      const data = await response.json();
      setViewingRequests(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching viewing requests:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Property Viewing Requests</h1>
      
      {viewingRequests.length === 0 ? (
        <p>No viewing requests found.</p>
      ) : (
        <div className="requests-list">
          {viewingRequests.map((request) => (
            <div key={request.id} className="request-card">
              <h3>Property Viewing Request</h3>
              <p><strong>Property:</strong> {request.propertyId}</p>
              <p><strong>Requested Date:</strong> {new Date(request.requestedDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Requester:</strong> {request.requesterName}</p>
              <p><strong>Phone:</strong> {request.requesterPhone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestViewPage;
