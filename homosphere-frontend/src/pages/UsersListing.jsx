import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaSearch } from "react-icons/fa";
import "../styles/UsersListing.css";

export default function UsersListing() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      let url;
      if (searchTerm !== "") {
        url = `http://localhost:8080/api/admin/users-listing/search?query=${encodeURIComponent(searchTerm)}&page=${page}&size=10`;
      } else if (roleFilter === "all") {
        url = `http://localhost:8080/api/admin/users-listing?page=${page}&size=10`;
      } else {
        url = `http://localhost:8080/api/admin/users-listing/filter?role=${roleFilter}&page=${page}&size=10`;
      }
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
    };
    if (token) fetchUsers();
  }, [page, token, roleFilter, searchTerm]);

  // Get user initials for placeholder
  const getInitial = (user) => {
    if (user.firstName && user.firstName.length > 0) {
      return user.firstName[0].toUpperCase();
    }
    if (user.userName && user.userName.length > 0) {
      return user.userName[0].toUpperCase();
    }
    return '?';
  };

  const getPhotoUrl = (photo) => photo ? `https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/${photo}` : null;

  const handleSearch = () => {
    setPage(0);
    setSearchTerm(searchInput.trim());
  };

  return (
    <div className="users-listing-container">
      <div className="users-listing-header">
        <h2>Team Members</h2>
        <div className="users-listing-controls">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by full name or email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button className="search-btn-inside" onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>
          <select
            className="filter-dropdown"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Position</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
            <option value="broker">Broker</option>
          </select>
        </div>
      </div>

      <div className="users-cards-grid">
        {users.map((user) => (
          <div
            className="user-card"
            key={user.id}
            onClick={() => setSelectedUser(user)}
          >
            <div className="user-card-menu">⋮</div>
            <div className="user-card-photo">
              {user.photo ? (
                <img src={getPhotoUrl(user.photo)} alt="User" />
              ) : (
                <div className="user-card-placeholder">{getInitial(user)}</div>
              )}
            </div>
            <div className="user-card-main">
              <div className="user-card-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="user-card-role">{user.role}</div>
              <div className="user-card-contact">
                {user.phone && (
                  <div className="user-card-phone">{user.phone}</div>
                )}
                <div className="user-card-email">{user.email}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <div
          className="user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="user-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="user-modal-close"
              onClick={() => setSelectedUser(null)}
            >
              ×
            </button>
            <div className="user-modal-header">
              {selectedUser.photo ? (
                <img src={getPhotoUrl(selectedUser.photo)} alt="User" />
              ) : (
                <div className="user-card-placeholder">{getInitial(selectedUser)}</div>
              )}
              <div className="user-modal-info">
                <div className="user-modal-name">
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
                <div className="user-modal-role">{selectedUser.role}</div>
              </div>
            </div>
            <div className="user-modal-details">
              <div>
                <b>Email:</b> {selectedUser.email}
              </div>
              <div>
                <b>Username:</b> {selectedUser.userName || "-"}
              </div>
              <div>
                <b>Location:</b> {selectedUser.location || "-"}
              </div>
              <div>
                <b>Phone:</b> {selectedUser.phone || "-"}
              </div>
              <div>
                <b>Bio:</b> {selectedUser.bio || "-"}
              </div>
              <div>
                <b>Status:</b> {selectedUser.status || "-"}
              </div>
              <div>
                <b>Verified:</b> {selectedUser.isVerified ? "Yes" : "No"}
              </div>
            </div>
            <div className="user-modal-actions">
              <button className="profile-btn public-profile-btn" onClick={() => window.open(`/public-profile/${selectedUser.id}`, '_blank')}>Show Public Profile</button>
              <button className="profile-btn private-profile-btn" onClick={() => window.open(`/private-profile/${selectedUser.id}`, '_blank')}>Show Private Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}