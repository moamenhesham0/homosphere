import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import axios from 'axios';
import ViewingRequestCard from '../ViewingRequestCard';
import '../../styles/AgentDashboard.css';

const AgentDashboard = () => {
  const [viewingRequests, setViewingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [filters, setFilters] = useState({
    propertyName: '',
    status: 'all' 
  });

  useEffect(() => {
    fetchViewingRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [viewingRequests, filters]);

  const fetchViewingRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setError('Please log in to view requests');
        setIsLoading(false);
        return;
      }

      const userId = session.user.id;
      
      const role = session.user.user_metadata?.role; 
      setUserRole(role); 

      let endpoint = '';
      if ((role || '').toUpperCase() === 'BUYER') {
        endpoint = `http://localhost:8080/api/viewing-requests/buyer/${userId}`;
      } else {
        endpoint = `http://localhost:8080/api/viewing-requests/seller/${userId}`;
      }
      
      const response = await axios.get(endpoint);

      const sorted = response.data.sort((a, b) => {
        const dateA = new Date(a.preferredDate);
        const dateB = new Date(b.preferredDate);
        const dateDiff = dateA - dateB;
        if (dateDiff !== 0) return dateDiff;
        return (a.startTime || '').localeCompare(b.startTime || '');
      });

      setViewingRequests(sorted);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching viewing requests:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load viewing requests';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...viewingRequests];

    if (filters.propertyName.trim()) {
      const searchTerm = filters.propertyName.toLowerCase();
      filtered = filtered.filter(req => {
        const title1 = req.propertyTitle?.toLowerCase() || '';
        const title2 = req.property?.propertyListing?.title?.toLowerCase() || '';
        return title1.includes(searchTerm) || title2.includes(searchTerm);
      });
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(req => {
        const reqStatus = (req.status || 'PENDING').toUpperCase();
        if (filters.status === 'confirmed') return reqStatus === 'APPROVED';
        if (filters.status === 'declined') return reqStatus === 'REJECTED';
        if (filters.status === 'reschedule') return reqStatus === 'RESCHEDULED';
        if (filters.status === 'withdrawn') return reqStatus === 'WITHDRAWN';
        return reqStatus === filters.status.toUpperCase();
      });
    }

    setFilteredRequests(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusUpdate = async (requestId, newStatus, additionalData = {}) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert('Please log in to update requests');
        return;
      }
      
      const userId = session.user.id; 

      let backendStatus = newStatus.toUpperCase();
      if (newStatus === 'confirmed') backendStatus = 'APPROVED';
      if (newStatus === 'declined') backendStatus = 'REJECTED';
      if (newStatus === 'reschedule') backendStatus = 'RESCHEDULED';
      if (newStatus === 'withdrawn') backendStatus = 'WITHDRAWN';

      const response = await axios.patch(
        `http://localhost:8080/api/viewing-requests/${requestId}/status`,
        {
          status: backendStatus,
          processedBy: userId,
          ...additionalData
        }
      );

      setViewingRequests(prev => 
        prev.map(req => 
          req.id === requestId ? response.data : req
        )
      );
      alert(`Request ${newStatus} successfully!`);
    } catch (err) {
      console.error('Error updating request:', err);
      alert('Failed to update request status');
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: viewingRequests.length,
      pending: 0,
      confirmed: 0,
      declined: 0,
      reschedule: 0,
      withdrawn: 0
    };

    viewingRequests.forEach(req => {
      const status = (req.status || 'PENDING').toUpperCase();

      if (status === 'PENDING') counts.pending++;
      else if (status === 'APPROVED') counts.confirmed++;
      else if (status === 'REJECTED') counts.declined++;
      else if (status === 'RESCHEDULED') counts.reschedule++;
      else if (status === 'WITHDRAWN') counts.withdrawn++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="agent-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>{(userRole || '').toUpperCase() === 'BUYER' ? 'My Viewing Requests' : 'Agent Dashboard'}</h1>
          <p className="subtitle">
            {(userRole || '').toUpperCase() === 'BUYER' 
              ? 'Track the status of your property viewings' 
              : 'Manage your viewing requests efficiently'}
          </p>
        </header>

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="propertyName">Property Name</label>
            <input
              type="text"
              id="propertyName"
              name="propertyName"
              placeholder="Search by property title..."
              value={filters.propertyName}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="confirmed">Confirmed ({statusCounts.confirmed})</option>
              <option value="declined">Declined ({statusCounts.declined})</option>
              <option value="reschedule">Reschedule ({statusCounts.reschedule})</option>
              <option value="withdrawn">Withdrawn ({statusCounts.withdrawn})</option>
            </select>
          </div>
          
          <button 
            onClick={() => setFilters({ propertyName: '', status: 'all' })}
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>

        <div className="requests-stats">
          <div className="stat-card">
            <div className="stat-value">{statusCounts.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statusCounts.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statusCounts.reschedule}</div>
            <div className="stat-label">Reschedule</div>
          </div>
        </div>

        <div className="requests-list">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <p>No viewing requests found</p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <ViewingRequestCard
                key={request.id}
                request={request}
                onStatusUpdate={handleStatusUpdate}
                userRole={userRole} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;